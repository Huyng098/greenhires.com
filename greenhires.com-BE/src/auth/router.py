import logging
from typing import Annotated
from src.auth.exceptions import EmailVerified
from src.auth.social.google import GoogleSSO
from src.auth.social.facebook import FacebookSSO
from src.auth.social.linkedin import LinkedInSSO
from fastapi import (
    APIRouter,
    Depends,
    Form,
    HTTPException,
    status,
    Request,
    BackgroundTasks,
)
from src.auth import service, utils
from src.auth.dependencies import valid_account_create
from src.auth import schema
from src import schema as baseSchema
from fastapi.security import OAuth2PasswordRequestForm
from src.config import settings
from src.auth.service import init_oauth2, oauth2_and_redirect
from src.utils.email import send_email
from src.auth.constants import reset_link_template, success_reset_template
from src.auth.config import auth_config
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from fastapi_limiter.depends import RateLimiter
from fastapi.responses import RedirectResponse

google_sso = GoogleSSO(
    client_id=settings.GOOGLE_OAUTH_CLIENT_ID,
    client_secret=settings.GOOGLE_OAUTH_CLIENT_SECRET,
    redirect_uri=settings.GOOGLE_OAUTH_CALLBACK_URL,
    allow_insecure_http=True,
)

facebook_sso = FacebookSSO(
    client_id=settings.FACEBOOK_OAUTH_CLIENT_ID,
    client_secret=settings.FACEBOOK_OAUTH_CLIENT_SECRET,
    redirect_uri=settings.FACEBOOK_OAUTH_CALLBACK_URL,
    allow_insecure_http=True,
)

linkedin_sso = LinkedInSSO(
    client_id=settings.LINKEDIN_OAUTH_CLIENT_ID,
    client_secret=settings.LINKEDIN_OAUTH_CLIENT_SECRET,
    redirect_uri=settings.LINKEDIN_OAUTH_CALLBACK_URL,
    allow_insecure_http=True,
)
router = APIRouter()


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=schema.AccountResponse,
)
async def register(
    background_tasks: BackgroundTasks,
    auth_data: schema.AccountCreate = Depends(valid_account_create),
    db: AsyncSession = Depends(get_db),
) -> schema.BasicInformation:
    account = await service.create_email_account(db, auth_data)
    # Send email to verify email
    background_tasks.add_task(
        service.send_verification_email, db, account
    )
    return schema.AccountResponse(user=account)


@router.post(
    "/tokens",
    dependencies=[Depends(RateLimiter(times=5, minutes=1))],
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)
) -> schema.AccountResponse:
    account = await service.authenticate_email_account(
        db, form_data.username, form_data.password
    )
    access_token_value, refresh_token_value = await utils.create_auth_token(
        db, account.id, account.role
    )
    return schema.AccountResponse(
        access_token=access_token_value,
        token_type="bearer",
        refresh_token=refresh_token_value,
        access_token_max_age=auth_config.ACCESS_TOKEN_EXP,
        refresh_token_max_age=auth_config.REFRESH_TOKEN_EXP,
        user=account,
    )


@router.get("/google/login")
async def google_auth_init():
    """Initialize auth and redirect"""
    return await init_oauth2(google_sso)


@router.get("/google/callback")
async def google_auth_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Verify login"""
    try:
        response, access_token_value, refresh_token_value, role = await oauth2_and_redirect(
            db, request, google_sso, "google"
        )
        return utils.set_cookie(response, access_token_value, refresh_token_value, role,
                                auth_config.ACCESS_TOKEN_EXP, auth_config.REFRESH_TOKEN_EXP)
    except Exception as e:
        logging.error(f"Error during Google OAuth2 callback: {str(e)}")
        return RedirectResponse(f"{settings.PUBLIC_CLIENT_URL}", status_code=302)

@router.get("/facebook/login")
async def facebook_auth_init():
    """Initialize facebook auth and redirect"""
    return await init_oauth2(facebook_sso)


@router.get("/facebook/callback")
async def facebook_auth_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Verify facebook login"""
    try:
        response, access_token_value, refresh_token_value, role = await oauth2_and_redirect(
            db, request, facebook_sso, "facebook"
        )
        return utils.set_cookie(response, access_token_value, refresh_token_value, role,
                                auth_config.ACCESS_TOKEN_EXP, auth_config.REFRESH_TOKEN_EXP)
    except Exception as e:
        logging.error(f"Error during Facebook OAuth2 callback: {str(e)}")
        return RedirectResponse(f"{settings.PUBLIC_CLIENT_URL}", status_code=302)


@router.get("/linkedin-openid/login")
async def linkedin_auth_init():
    """Initialize linkedin auth and redirect"""
    return await init_oauth2(linkedin_sso)


@router.get("/linkedin-openid/callback")
async def linkedin_auth_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Verify linkedin login"""
    try:
        response, access_token_value, refresh_token_value, role = await oauth2_and_redirect(
            db, request, linkedin_sso, "linkedin"
        )
        return utils.set_cookie(response, access_token_value, refresh_token_value, role,
                                auth_config.ACCESS_TOKEN_EXP, auth_config.REFRESH_TOKEN_EXP)
    except Exception as e:
        logging.error(f"Error during LinkedIn OAuth2 callback: {str(e)}")
        return RedirectResponse(f"{settings.PUBLIC_CLIENT_URL}", status_code=302)

@router.post(
    "/forgot-password",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=baseSchema.Message,
)
async def forgot_password(
    form: schema.EmailForm,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> baseSchema.Message:
    """Send reset password email"""
    if await service.get_account_by_email(db, form.email):
        token = await utils.create_reset_token()
        # Update reset token in db
        html = reset_link_template.format(
            reset_link=f"{settings.RESET_PASSWORD_URL}={token}"
        )
        # Send email
        background_tasks.add_task(send_email, form.email, html)
        await service.update_reset_token(db, form.email, token)
    return baseSchema.Message(message="Email sent")


@router.post("/reset-password", status_code=status.HTTP_202_ACCEPTED)
async def reset_password(
    form: schema.ResetPassword,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> baseSchema.Message:
    """Reset password"""
    email = await service.update_password_by_token(db, form.token, form.password)
    background_tasks.add_task(send_email, email, success_reset_template)
    return baseSchema.Message(message="Password reset successful")


@router.post("/verify-email")
async def verify_email(
    data: schema.VerifyEmail, db: AsyncSession = Depends(get_db)
) -> baseSchema.Message:
    """Verify email"""
    await service.verify_email(db, data.email, data.token)
    return baseSchema.Message(message="Email verified")


@router.post("/resend-verification-email")
async def resend_verification_email(
    data: schema.EmailForm,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> baseSchema.Message:
    """Resend verification email"""
    account = await service.get_account_by_email(db, data.email)
    if not account:  # Account does not exist
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Account not found"
        )
    if account.email_verified:
        raise EmailVerified()

    background_tasks.add_task(
        service.send_verification_email, db, account
    )
    return baseSchema.Message(message="Email resent")


@router.post("/refresh-token")
async def refresh_token(
    grant_type: Annotated[str, Form()],
    refresh_token: Annotated[str, Form()],
    db: AsyncSession = Depends(get_db),
) -> schema.AccountResponse:
    """Refresh access token"""
    if grant_type != "refresh_token":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid grant type"
        )
    jwt_data = await service.verify_refresh_token(db, refresh_token)
    access_token_value, refresh_token_value = await utils.create_auth_token(
        db, jwt_data.account_id, jwt_data.role
    )
    return schema.AccountResponse(
        access_token=access_token_value,
        token_type="bearer",
        refresh_token=refresh_token_value,
        access_token_max_age=auth_config.ACCESS_TOKEN_EXP,
        refresh_token_max_age=auth_config.REFRESH_TOKEN_EXP,
        user={"role": jwt_data.role},
    )

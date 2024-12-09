from datetime import datetime, timezone
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from src.auth import jwt
from src.utils.email import send_email
from src.utils import utils
from src.auth.exceptions import (
    EmailVerified,
    InvalidCredentials,
    InvalidOTP,
    RefreshTokenNotValid,
    ResetTokenNotValid,
)
from src.auth import schema
from src.auth.security import check_password, hash_password
from src.auth.model import Account, ProviderEnum, Secret
from src.auth.social.base import OpenID
from src.config import settings
from src.auth import utils as auth_utils
from fastapi.responses import RedirectResponse
from src.auth.social.base import SSOBase
from fastapi import Request
from src.notification import service as noti_service
from src.notification.model import NotificationType
from src.user.model import Feature
from src.utils.mail_template import generate_verification_email


async def create_oauth_account(
    db: AsyncSession, account: schema.AuthAccount
) -> schema.BasicInformation:
    account_db = Account(
        email_verified=True,
        **account.model_dump(exclude_none=True, exclude={"password", "email_verified"}),
        secret=Secret(
            last_signed_in=(
                datetime.now(timezone.utc)
                if account.provider != ProviderEnum.email
                else None
            ),
        ),
        feature=Feature(),
    )
    db.add(account_db)
    await db.commit()
    await db.refresh(account_db)
    return schema.BasicInformation.model_validate(account_db)


async def create_email_account(
    db: AsyncSession,
    account: schema.AccountCreate | schema.AccountCreatedAdmin,
    admin_id: str = None,
) -> schema.BasicInformation:
    account_db = Account(
        **account.model_dump(exclude_none=True, exclude={"password"}),
        secret=Secret(password=hash_password(account.password)),
        feature=Feature(),
    )
    db.add(account_db)
    await db.commit()
    await db.refresh(account_db)
    account_dto = schema.BasicInformation.model_validate(account_db)
    # Notify to admin and superadmin except the current admin
    if admin_id:
        current_admin = await get_account_by_id(db, admin_id)
        await noti_service.send_notification_to_admin(
            db=db,
            title="New account created",
            content=f"New account created with email {account.email} created by {current_admin.firstname} {current_admin.lastname}",
            key=NotificationType.USER,
            key_id=account_db.id,
            filtered_admin_id=current_admin.id,
        )
    return account_dto


async def get_account_by_id(
    db: AsyncSession, account_id: str
) -> schema.BasicInformation | None:
    stmt = select(Account).where(Account.id == account_id)
    result = await db.execute(stmt)
    account = result.scalars().first()
    return schema.BasicInformation.model_validate(account) if account else None


async def delete_refresh_token(db: AsyncSession, account_id: str) -> None:
    stmt = (
        update(Secret).values(refresh_token=None).where(Secret.account_id == account_id)
    )
    await db.execute(stmt)
    await db.commit()


async def get_account_by_email(db: AsyncSession, email: str) -> Account | None:
    stmt = select(Account).where(Account.email == email)
    result = await db.execute(stmt)
    account = result.scalars().first()
    return account


async def update_social_account(db: AsyncSession, provider: str, id: str) -> None:
    statement = update(Account).values(provider=provider).where(Account.id == id)
    await db.execute(statement)
    await db.commit()


async def create_refresh_token(
    db: AsyncSession, *, account_id: str, refresh_token: str | None = None
) -> str:
    if not refresh_token:
        refresh_token = utils.generate_random_alphanum(64)

    statement = (
        update(Secret)
        .values(refresh_token=refresh_token, last_signed_in=datetime.now(timezone.utc))
        .where(Secret.account_id == account_id)
    )
    await db.execute(statement)
    await db.commit()
    return refresh_token


async def authenticate_email_account(
    db: AsyncSession, username: str, password: str
) -> schema.BasicInformation | None:
    account = await get_account_by_email(db, username)
    if not account:
        raise InvalidCredentials()
    if not check_password(password, account.secret.password):
        raise InvalidCredentials()
    return schema.BasicInformation.model_validate(account)


async def init_oauth2(sso: SSOBase) -> RedirectResponse:
    """Initialize oauth2 auth"""
    with sso:
        return await sso.get_login_redirect(
            params={"prompt": "consent", "access_type": "offline"}
        )


async def oauth2_and_redirect(
    db: AsyncSession, request: Request, sso: SSOBase, provider: str
) -> tuple[RedirectResponse, str, str, schema.AccountRoleEnum]:
    """Initialize auth and redirect for the given provider"""
    with sso:
        account: OpenID = await sso.verify_and_process(request)
        acc = await get_account_by_email(db, account.email)
        if acc is None:  # Account does not exist -> create a new account
            acc = await create_oauth_account(
                db,
                schema.AuthAccount(
                    email=account.email,
                    oauth2_id=account.id,
                    firstname=account.first_name,
                    lastname=account.last_name,
                    picture=account.picture,
                    provider=provider,
                    email_verified=True,
                ),
            )
        # else:  # Update last_signed_in
            # await update_social_account(db, provider=provider, id=acc.id)
        role = acc.role.value
        access_token, refresh_token = await auth_utils.create_auth_token(
            db, id=acc.id, role=role
        )
    return (
        RedirectResponse(url=f'{settings.PUBLIC_CLIENT_URL}?socialLogin=true', status_code=302),
        access_token,
        refresh_token,
        role,
    )


async def update_reset_token(db: AsyncSession, email: str, token: str) -> None:
    """Update reset token for the given email"""
    stmt = select(Account).where(Account.email == email)
    result = await db.execute(stmt)
    account = result.scalars().first()
    stmt = (
        update(Secret).values(reset_token=token).where(Secret.account_id == account.id)
    )
    await db.execute(stmt)
    await db.commit()


async def update_password_by_token(db: AsyncSession, token: str, password: str) -> str:
    """Update password for the given token"""
    stmt = (
        update(Secret)
        .values(reset_token=None, password=hash_password(password))
        .where(Secret.reset_token == token)
        .returning(Secret.account_id)
    )
    result = await db.execute(stmt)
    account_id = result.scalars().first()
    await db.commit()
    if account_id is None:
        raise ResetTokenNotValid()
    stmt = select(Account).where(Account.id == account_id)
    result = await db.execute(stmt)
    account = result.scalars().first()
    return account.email


async def send_verification_email(
    db: AsyncSession, account: Account
) -> None:
    """Send verification email"""
    token = utils.generate_otp_secret(length=6)
    stmt = (
        update(Secret)
        .values(verification_token=token)
        .where(Secret.account_id == account.id)
    )
    await db.execute(stmt)
    await db.commit()
    url = f"{settings.PUBLIC_CLIENT_URL}/auth/signup/verify-email?email={account.email}&token={token}"
    email_content = generate_verification_email(account.firstname, url, token)
    await send_email(account.email, email_content, "Verification your email address")


async def verify_email(db: AsyncSession, email: str, token: str) -> None:
    """Verify email by token"""
    stmt = select(Account).where(Account.email == email)
    result = await db.execute(stmt)
    account = result.scalars().first()
    if not account or account.secret.verification_token != token:
        raise InvalidOTP()
    elif account.email_verified:
        raise EmailVerified()
    else:
        account.email_verified = True
        account.secret.verification_token = None
        await db.commit()


async def verify_refresh_token(
    db: AsyncSession, refresh_token: str
) -> schema.JWTData | None:
    """Verify refresh token"""
    jwt_data = jwt.verify_token(refresh_token, "refresh")
    statement = select(Secret.refresh_token).where(
        Secret.account_id == jwt_data.account_id
    )
    result = await db.execute(statement)
    token = result.scalars().first()
    if not token:
        return None
    if token != refresh_token:
        raise RefreshTokenNotValid()
    return jwt_data

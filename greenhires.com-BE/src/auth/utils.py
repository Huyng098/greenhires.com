from typing import Any
from fastapi import Response
from src.auth import jwt, service
from src.auth.config import auth_config
from src.config import settings
import secrets
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime


def get_token_settings(
    key: str,
    token: str,
    max_age: int,
    expired: bool = False,
) -> dict[str, Any]:
    base_cookie = {
        "key": key,
        "httponly": True,
        "samesite": "strict",
        "domain": settings.SITE_DOMAIN,
        "secure": auth_config.SECURE_COOKIES,
    }
    if expired:
        return base_cookie

    return {
        **base_cookie,
        "value": token,
        "max_age": max_age,
    }


async def create_auth_token(
        db: AsyncSession,
        id: str, role: str) -> tuple[Response, str, str]:
    refresh_token_value = jwt.create_token("refresh", id, role)
    refresh_token_value = await service.create_refresh_token(db, account_id=id,
                                                             refresh_token=refresh_token_value)
    access_token_value = jwt.create_token("access", id, role)
    return access_token_value, refresh_token_value


async def create_reset_token() -> str:
    return secrets.token_urlsafe(32)


HUMANTREE_ACCESS_TOKEN = "accessToken"
HUMANTREE_REFRESH_TOKEN = "refreshToken"
HUMANTREE_ROLE = "role"
HUMANTREE_ACCESS_TOKEN_EXPIRED = "accessTokenExpiredIn"

COOKIE_CONFIG = {
    "path": "/",
    "secure": True,
    "samesite": "none",  # "lax" | "strict" | "none"
    "httponly": True,
    "domain": f'.{settings.SITE_DOMAIN}',
}


def set_cookie(
    response: Response,
    access_token_value: str,
    refresh_token_value: str,
    user_role: str,
    access_token_max_age: int,
    refresh_token_max_age: int,
) -> Response:
    # Set the expiration timestamp for the access token
    response.set_cookie(
        key=HUMANTREE_ACCESS_TOKEN_EXPIRED,
        value=str(int(datetime.now().timestamp() * 1000) + access_token_max_age * 1000),
        max_age=access_token_max_age,
        **COOKIE_CONFIG,
    )
    
    # Set the access token
    response.set_cookie(
        key=HUMANTREE_ACCESS_TOKEN,
        value=access_token_value,
        max_age=access_token_max_age,
        **COOKIE_CONFIG,
    )
    
    # Set the refresh token
    response.set_cookie(
        key=HUMANTREE_REFRESH_TOKEN,
        value=refresh_token_value,
        max_age=refresh_token_max_age,
        **COOKIE_CONFIG,
    )
    
    # Set the user role
    response.set_cookie(
        key=HUMANTREE_ROLE,
        value=user_role,
        max_age=refresh_token_max_age,
        **COOKIE_CONFIG,
    )
    
    return response

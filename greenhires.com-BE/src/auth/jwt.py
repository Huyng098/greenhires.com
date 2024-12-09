from datetime import datetime, timedelta, timezone
from typing import Literal

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from src.auth.model import AccountRoleEnum

from src.auth.config import auth_config
from src.auth.exceptions import AuthRequired, InvalidToken, NotEnoughPermissions
from src.auth.schema import JWTData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/tokens")


def create_token(
    grantType: Literal["access", "refresh"],
    account_id: str,
    role: str,
) -> str:
    if grantType == "access":
        expires_delta = timedelta(seconds=auth_config.ACCESS_TOKEN_EXP)
    else:
        expires_delta = timedelta(seconds=auth_config.REFRESH_TOKEN_EXP)
    jwt_data = {
        "sub": str(account_id),
        "exp": datetime.now(timezone.utc) + expires_delta,
        "role": role,
    }
    if grantType == "access":
        secret = auth_config.ACCESS_TOKEN_SECRET
    else:
        secret = auth_config.REFRESH_TOKEN_SECRET
    return jwt.encode(jwt_data, secret, algorithm=auth_config.JWT_ALG)


def verify_token(
    token: str,
    grantType: Literal["access", "refresh"],
) -> JWTData:
    if grantType == "access":
        secret = auth_config.ACCESS_TOKEN_SECRET
    else:
        secret = auth_config.REFRESH_TOKEN_SECRET
    try:
        payload = jwt.decode(token, secret, algorithms=[auth_config.JWT_ALG])
    except JWTError:
        raise InvalidToken()
    return JWTData(**payload)


async def parse_jwt_account_data_optional(
    token: str = Depends(oauth2_scheme),
) -> JWTData | None:
    return verify_token(token, "access")


async def parse_jwt_account_data(
    token: JWTData | None = Depends(parse_jwt_account_data_optional),
) -> JWTData:
    if not token:
        raise AuthRequired()
    return token


async def parse_jwt_admin_data(
    token: JWTData = Depends(parse_jwt_account_data),
) -> JWTData:
    if not token.role in [AccountRoleEnum.admin, AccountRoleEnum.superadmin]:
        raise NotEnoughPermissions()
    return token


async def parse_jwt_superadmin_data(
    token: JWTData = Depends(parse_jwt_account_data),
) -> JWTData:
    if not token.role == AccountRoleEnum.superadmin:
        raise NotEnoughPermissions()
    return token


async def parse_jwt_consultant_data(
    token: JWTData = Depends(parse_jwt_account_data),
) -> JWTData:
    if not token.role in [AccountRoleEnum.consultant,
                          AccountRoleEnum.superadmin, AccountRoleEnum.admin]:
        raise NotEnoughPermissions()
    return token

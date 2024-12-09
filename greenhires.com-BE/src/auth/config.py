from pydantic_settings import BaseSettings


class AuthConfig(BaseSettings):
    JWT_ALG: str
    ACCESS_TOKEN_SECRET: str
    REFRESH_TOKEN_SECRET: str

    ACCESS_TOKEN_KEY: str = "accessToken"
    ACCESS_TOKEN_EXP: int = 60 * 15 * 1000  # 15 minutes * 1000 only for test
    REFRESH_TOKEN_KEY: str = "refreshToken"
    REFRESH_TOKEN_EXP: int = 60 * 60 * 24 * 2  # 2 days
    SECURE_COOKIES: bool = True


auth_config = AuthConfig()

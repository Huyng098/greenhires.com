from typing import Any, Literal
from pydantic import PostgresDsn, RedisDsn, model_validator
from pydantic_settings import BaseSettings
from src.constants import Environment


class Config(BaseSettings):
    DATABASE_URL: PostgresDsn
    REDIS_URL: RedisDsn
    PUSH_NOTIFICATION_CHANNEL: str = "notifications"

    SITE_DOMAIN: str = "myapp.com"

    GOOGLE_OAUTH_CLIENT_ID: str = ""
    GOOGLE_OAUTH_CLIENT_SECRET: str = ""

    FACEBOOK_OAUTH_CLIENT_ID: str = ""
    FACEBOOK_OAUTH_CLIENT_SECRET: str = ""

    LINKEDIN_OAUTH_CLIENT_ID: str = ""
    LINKEDIN_OAUTH_CLIENT_SECRET: str = ""

    SECRET: str = "SECRET"
    ENVIRONMENT: Environment = Environment.PRODUCTION

    SENTRY_DSN: str | None = None

    CORS_ORIGINS: list[str]
    CORS_ORIGINS_REGEX: str | None = None
    CORS_HEADERS: list[str]

    GOOGLE_OAUTH_CALLBACK_URL: str
    FACEBOOK_OAUTH_CALLBACK_URL: str
    LINKEDIN_OAUTH_CALLBACK_URL: str

    RESET_PASSWORD_URL: str
    PUBLIC_CLIENT_URL: str

    IS_USE_LOCAL_STATIC_FILES: bool = False
    LOCAL_STATIC_FILES_DIR: str = ""
    LOCAL_STATIC_FILES_DOMAIN: str = ""

    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_S3_BUCKET_NAME: str
    AWS_DEFAULT_REGION: str

    ICONFINDER_API_KEY: str
    UNSPLASH_ACCESS_KEY: str

    APP_VERSION: str = "1"

    ZALOPAY_APP_ID: str = ""
    ZALOPAY_KEY_1: str = ""
    ZALOPAY_KEY_2: str = ""
    ZALOPAY_ENDPOINT_URL: str = ""
    ZALOPAY_CALLBACK_URL: str = ""

    MOMO_PARTNER_CODE: str = ""
    MOMO_ACCESS_KEY: str = ""
    MOMO_SECRET_KEY: str = ""
    MOMO_ENDPOINT_URL: str = ""
    MOMO_CALLBACK_URL: str = ""

    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_SERVER: str = ""

    LOCATION_PASRSE: Literal["online", "offline"] = "online"

    TOGETHER_API_KEY: str = ""
    ELASTICSEARCH_URL: str = ""

    PAYPAL_ENDPOINT_URL: str = ""
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""

    VNPAY_TMN: str = ""
    VNPAY_SECRET: str = ""
    VNPAY_RETURN_URL : str = ""
    VNPAY_RETURN_CANCEL : str = ""
    VNPAY_CREATE_PAY_URL : str = ""
    VNPAY_CREATE_PAY : str = ""
    VNPAY_PAY_TOKEN : str = ""
    
    @model_validator(mode="after")
    def validate_sentry_non_local(self) -> "Config":
        if self.ENVIRONMENT.is_deployed and not self.SENTRY_DSN:
            raise ValueError("Sentry is not set")

        return self


settings = Config()

app_configs: dict[str, Any] = {"title": "Humantree API"}
if settings.ENVIRONMENT.is_deployed:
    app_configs["root_path"] = f"/v{settings.APP_VERSION}"

if not settings.ENVIRONMENT.is_debug:
    app_configs["openapi_url"] = None  # hide docs

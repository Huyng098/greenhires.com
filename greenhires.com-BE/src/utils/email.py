from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from src.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_USERNAME,
    MAIL_PORT=465,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


async def send_email(email: str, content: str, subject: str = "Request password recovery at GreenHires website"):
    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=content,
        subtype=MessageType.html,
    )
    fm = FastMail(conf)
    await fm.send_message(message)

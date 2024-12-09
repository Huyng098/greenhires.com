from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from src.notification.model import NotificationType
from src.schema import BaseSchema


class Notification(BaseSchema):
    title: str
    content: str
    key: Optional[NotificationType] = None
    key_id: Optional[UUID] = None
    is_read: Optional[bool] = False


class NotificationCreate(BaseModel):
    title: str
    content: Optional[str] = None
    key: Optional[NotificationType] = None
    key_id: Optional[UUID] = None
    account_ids: list[UUID]


class NotificationUpdate(BaseModel):
    is_read: bool


class UnreadCount(BaseModel):
    value: int


class NotificationID(BaseModel):
    notification_id: UUID

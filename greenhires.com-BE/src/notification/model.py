from sqlalchemy import UUID, Boolean, Column
from sqlalchemy import ForeignKey, String, Text
from src.model import Base, to_pg_enum
from enum import Enum
from sqlalchemy.orm import relationship, Mapped
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.auth.model import Account


class NotificationType(str, Enum):
    SAMPLE = "sample"
    USER = "user"
    BLOG = "blog"
    COMMENT = "comment"


class AccountNotification(Base):
    is_read = Column(Boolean, default=False, nullable=False)
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    notification_id = Column(
        UUID(as_uuid=True),
        ForeignKey("notification.id", ondelete="CASCADE"),
        nullable=False,
    )


class Notification(Base):
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    key = Column(to_pg_enum(NotificationType), nullable=True)
    key_id = Column(UUID(as_uuid=True), nullable=True)

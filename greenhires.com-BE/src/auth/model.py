from sqlalchemy import Column, String, Boolean, Date
from sqlalchemy import DateTime, ForeignKey, UUID, Text, LargeBinary
from sqlalchemy.orm import relationship, Mapped
from src.model import Base, to_pg_enum
from src.payment.model import Resources
from src.resume.model import Resume
from src.user.model import Feature
from sqlalchemy.dialects.postgresql import ARRAY
from src.notification.model import AccountNotification, Notification
from src.auth.schema import AccountRoleEnum, ProviderEnum


class Secret(Base):
    password = Column(LargeBinary, nullable=True)
    last_signed_in = Column(DateTime(timezone=True), nullable=True)
    verification_token = Column(String, nullable=True)
    two_factor_secret = Column(String, nullable=True)
    two_factor_backup_codes: Mapped[list[str]] = Column(ARRAY(String), default=[])
    refresh_token = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    account_id = Column(
        UUID, ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )


class Account(Base):
    oauth2_id: Mapped[str] = Column(String(100), nullable=True, unique=True)
    firstname = Column(String(100), nullable=False)
    lastname = Column(String(100), nullable=True)
    picture = Column(String(500), nullable=True)
    cover_picture = Column(String(500), nullable=True)
    email = Column(String(100), nullable=False, unique=True)
    phone = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    gender = Column(String(1), nullable=True)
    dob = Column(Date, nullable=True)
    created_by = Column(
        UUID, ForeignKey("account.id", ondelete="SET NULL"), nullable=True
    )
    email_verified = Column(Boolean, default=False)
    two_factor_enabled = Column(Boolean, default=False)
    provider = Column(to_pg_enum(ProviderEnum), default=ProviderEnum.email)
    role = Column(to_pg_enum(AccountRoleEnum), default=AccountRoleEnum.enduser)
    secret: Mapped["Secret"] = relationship(
        "Secret", backref="account", lazy="joined", uselist=False, cascade="all, delete"
    )
    feature: Mapped["Feature"] = relationship(
        "Feature", backref="account", uselist=False, cascade="all, delete"
    )
    resumes: Mapped[list["Resume"]] = relationship(
        "Resume", backref="account", cascade="all, delete"
    )
    notifications: Mapped[list["Notification"]] = relationship(
        "Notification",
        backref="accounts",
        cascade="all, delete",
        secondary=AccountNotification.__table__,
    )
    resources: Mapped["Resources"] = relationship(
        "Resources", back_populates="account", uselist=False, cascade="all, delete"
    )

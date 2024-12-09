from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import UUID, Boolean, Column, DateTime, Integer
from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import relationship, Mapped

from src.model import Base, to_pg_enum
from sqlalchemy.dialects.postgresql import JSONB
from src.payment.schema import (
    PackageFrequency,
    PackageStatus,
    PaymentMethod,
    SubscriptionStatus,
    TransactionStatus,
)
from src.schema import Currency


class Coupon(Base):
    code = Column(String, unique=True, nullable=False)
    valid_from = Column(DateTime(timezone=True), nullable=False)
    valid_to = Column(DateTime(timezone=True), nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

class CouponUsage(Base):
    account_id = Column(UUID(as_uuid=True), ForeignKey("account.id"), nullable=False)
    coupon_id = Column(UUID(as_uuid=True), ForeignKey("coupon.id", ondelete="CASCADE"), nullable=False)
    used_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)


class Transaction(Base):
    amount = Column(Numeric, nullable=False)
    currency = Column(to_pg_enum(Currency), nullable=False)
    status = Column(
        to_pg_enum(TransactionStatus), nullable=False, default=TransactionStatus.PENDING
    )
    order_id = Column(String(length=20), nullable=False, unique=True)
    package_id = Column(
        UUID(as_uuid=True),
        ForeignKey("package.id", ondelete="SET NULL"),
        nullable=True,
        default=None,
    )
    payment_method = Column(to_pg_enum(PaymentMethod), nullable=False)
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    request_id = Column(UUID(as_uuid=True), nullable=True)
    subscription_id = Column(
        UUID(as_uuid=True),
        ForeignKey("subscription.id", ondelete="SET NULL"),
        nullable=True,
    )
    subscription = relationship("Subscription", back_populates="transactions")
    coupon_id = Column(
        UUID(as_uuid=True),
        ForeignKey("coupon.id", ondelete="CASCADE"),
        nullable=True
    )
    activated_at = Column(DateTime(timezone=True), nullable=True)


class Subscription(Base):
    package_id = Column(
        UUID(as_uuid=True), ForeignKey("package.id", ondelete="SET NULL"), nullable=True
    )
    status = Column(
        to_pg_enum(SubscriptionStatus),
        nullable=False,
        default=SubscriptionStatus.PENDING,
    )
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    expired_at = Column(DateTime(timezone=True), nullable=True)

    transactions = relationship("Transaction", back_populates="subscription")

class PaymentBinding(Base):
    method = Column(to_pg_enum(PaymentMethod), nullable=False)
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    is_binding = Column(Boolean, nullable=False, default=False)
    binding_token = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=False)
    info = Column(JSONB, nullable=True)

class Resources(Base):
    account_id: Mapped[UUID] = Column(UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), unique=True)
    downloads_left: Mapped[int] = Column(Integer, default=3)

    # Relationship with Account
    account: Mapped["Account"] = relationship("Account", back_populates="resources")

class Package(Base):
    frequency = Column(to_pg_enum(PackageFrequency), nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    VND_price = Column(Numeric, nullable=False)
    USD_price = Column(Numeric, nullable=False)
    description = Column(ARRAY(String), nullable=True)
    status = Column(
        to_pg_enum(PackageStatus), nullable=False, default=PackageStatus.ACTIVE
    )
    downloads_allowed = Column(Integer, nullable=True, default=300)
    paypal_product_id = Column(String(200), nullable=True, unique=True)
    isAutoRenew = Column(Boolean, nullable=False, default=False)

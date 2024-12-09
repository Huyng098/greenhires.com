from datetime import datetime
from enum import Enum
from typing import Literal, Optional
from uuid import UUID
from pydantic import BaseModel, field_validator
from src.schema import BaseSchema
from src.schema import Currency


class TransactionStatus(str, Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"


class PaymentMethod(str, Enum):
    COUPON = "coupon"
    PAYPAL = "paypal"
    CREDIT_CARD = "credit_card"
    BANK_TRANSFER = "bank_transfer"
    MOMO = "momo"
    ZALOPAY = "zalopay"
    VNPAY = "vnpay"


class SubscriptionStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    PAUSED = "paused"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class PackageStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class PackageFrequency(str, Enum):
    ONE_CV = "one_cv"
    REQUEST_CV = "request_cv"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    BI_MONTHLY = "bi_monthly"
    QUARTERLY = "quarterly"
    SEMI_ANNUALLY = "semi_annually"
    YEARLY = "yearly"
    TRIAL_WEEKLY_MONTHLY = "trial_weekly_monthly"


class Price(BaseModel):
    amount: float
    currency: Currency

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, value):
        if value <= 0:
            raise ValueError("Amount must be greater than 0")
        return value


class PackageUpdate(BaseModel):
    vnd_price: Optional[float] = None
    usd_price: Optional[float] = None
    status: Optional[PackageStatus] = None


class PackageCreate(BaseModel):
    frequency: PackageFrequency
    name: str
    VND_price: float
    USD_price: float
    isAutoRenew: bool = False
    downloads_allowed: Optional[int] = 300
    description: Optional[list[str]] = None

    @field_validator("VND_price", "USD_price")
    def validate_price(cls, value):
        if value <= 0:
            raise ValueError("Price must be greater than 0")
        return value


class Package(PackageCreate, BaseSchema):
    status: PackageStatus
    paypal_product_id: Optional[str] = None


class RegisterPackage(BaseModel):
    package_id: UUID


class TransactionCreate(RegisterPackage):
    payment_method: PaymentMethod


class PaymentBinding(BaseSchema):
    method: PaymentMethod
    is_binding: bool
    binding_token: Optional[str] = None
    is_active: bool
    info: Optional[dict] = None


class BindingLink(BaseModel):
    binding_link: str | None
    is_binding: bool


class Transaction(TransactionCreate, BaseSchema):
    amount: float
    currency: Currency
    package_name: Optional[str] = None
    status: TransactionStatus
    order_id: str
    package_id: UUID
    package: Optional[Package] = None
    activated_at: Optional[datetime] = None
    coupon_id: Optional[UUID] = None
    coupon_code: Optional[str] = None


    class Config:
        extra = "allow"


class SubscriptionCreate(BaseModel):
    package_id: UUID
    account_id: UUID


class CaptureOrderRequest(BaseModel):
    order_id: str

class SubscriptionUpdate(BaseModel):
    payment_method: Optional[PaymentMethod] = None
    status: Optional[SubscriptionStatus] = None


class Duration(BaseModel):
    unit: Literal["day", "week", "month", "year"]
    value: int


class Subscription(BaseSchema):
    package_id: Optional[UUID] = None
    status: SubscriptionStatus
    account_id: UUID
    expired_at: Optional[datetime] = None


class CouponCreate(BaseModel):
    code: str
    valid_from: datetime
    valid_to: datetime
    description: Optional[str] = None


class RedirectURL(BaseModel):
    redirect_url: str


class Order(BaseModel):
    orderId: str

class CouponSchema(BaseSchema):
    id: UUID
    code: str
    valid_from: datetime
    valid_to: datetime
    description: Optional[str] = None
    is_active: bool

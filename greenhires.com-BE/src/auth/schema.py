from enum import Enum
import re
from datetime import date, datetime
from typing import Literal, Optional
from uuid import UUID
from src.schema import BaseSchema
from pydantic import EmailStr, Field, BaseModel

STRONG_PASSWORD_PATTERN = re.compile(r"^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,128}$")


class AccountRoleEnum(str, Enum):
    superadmin = "superadmin"
    admin = "admin"
    consultant = "consultant"
    manager = "manager"
    enduser = "enduser"
    client = "client"


class ProviderEnum(str, Enum):
    email = "email"
    google = "google"
    facebook = "facebook"
    linkedin = "linkedin"


class BasicInformation(BaseSchema):
    email: Optional[EmailStr] = None
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    cover_picture: Optional[str] = Field(default=None, min_length=0, max_length=500)
    picture: Optional[str] = Field(default=None, min_length=0, max_length=500)
    provider: Optional[ProviderEnum] = Field(default=ProviderEnum.email)
    role: Optional[AccountRoleEnum] = Field(default=AccountRoleEnum.enduser)
    phone: Optional[str] = Field(default=None, min_length=0, max_length=100)
    address: Optional[str] = Field(default=None, min_length=0)
    gender: Optional[Literal["M", "F", "O"]] = Field(default=None)
    dob: Optional[date] = None


class AuthAccount(BasicInformation):
    oauth2_id: Optional[str] = Field(default=None, min_length=1, max_length=100)
    password: Optional[str] = Field(default=None, min_length=6, max_length=128)
    email_verified: Optional[bool] = False


class JWTData(BaseModel):
    account_id: str = Field(alias="sub")
    role: AccountRoleEnum = AccountRoleEnum.enduser


class AccountCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    firstname: str = Field(min_length=1, max_length=128)
    lastname: str = Field(min_length=1, max_length=128)
    phone: Optional[str] = None
    gender: Optional[Literal["M", "F", "O"]] = None
    dob: Optional[date] = None
    address: Optional[str] = None


class AccountCreatedAdmin(AccountCreate):
    role: AccountRoleEnum
    email_verified: Optional[bool] = True


class AccountResponse(BaseModel):
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    refresh_token: Optional[str] = None
    access_token_max_age: Optional[int] = None
    refresh_token_max_age: Optional[int] = None
    user: Optional[BasicInformation] = None


class EmailForm(BaseModel):
    email: EmailStr

class VerifyEmail(EmailForm):
    token: str

class ResetPassword(BaseModel):
    token: str = Field(min_length=1, max_length=128)
    password: str = Field(min_length=6, max_length=128)


class FeatureType(str, Enum):
    FREE = "free"
    ONLY_ONE_CV = "one_cv"
    UNLIMITED = "unlimited"


class OnlyOneDetail(BaseModel):
    resume_id: Optional[UUID] = None
    cover_letter_id: Optional[UUID] = None
    num_of_saved_cv: Optional[int] = 2


class OnlyOneCV(BaseModel):
    type: FeatureType.ONLY_ONE_CV
    account_id: UUID
    detail: OnlyOneDetail


class UnlimitedDetail(BaseModel):
    unlimited_date: Optional[datetime] = None


class UnlimitedCV(BaseModel):
    type: FeatureType.UNLIMITED
    account_id: UUID
    detail: UnlimitedDetail

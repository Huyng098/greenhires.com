from datetime import date, datetime
from enum import Enum
from typing import Literal, Optional
from uuid import UUID
from pydantic import BaseModel
from src.auth.schema import AccountRoleEnum
from src.schema import BaseSchema


class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str


class ProfileCreate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: Optional[str] = None
    picture: Optional[str] = None
    cover_picture: Optional[str] = None


class ProfileUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    picture: Optional[str] = None
    gender: Literal["M", "F", "O"] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    phone: Optional[str] = None


class RoleUpdate(BaseModel):
    role: AccountRoleEnum


class Information(ProfileCreate):
    id: UUID
    role: Optional[AccountRoleEnum] = None


class Feature(BaseSchema):
    num_of_resumes: int
    num_of_coverletters: int
    num_of_PDF_exports: int
    num_of_DOCX_exports: int
    valid_until: datetime


class CanvaImageType(str, Enum):
    svg = "svg"
    image = "image"


class CanvaImage(BaseSchema):
    url: str
    account_id: UUID
    type: CanvaImageType

from typing import Literal, Optional
from uuid import UUID
from fastapi import File, Form, UploadFile
from pydantic import BaseModel
from enum import Enum
from src.schema import BaseSchema


class CategoryType(str, Enum):
    RESUME = "resume"
    BLOG = "blog"


class CategoryCreate(BaseModel):
    name: str
    type: CategoryType


class Category(BaseSchema, CategoryCreate):
    pass


class DeleteImage(BaseModel):
    url: str

class UploadImage(BaseModel):
    image: UploadFile
    type: Literal["resume", "avatar", "sample", "general", "canva", "cover_picture"]
    resume_id: Optional[UUID] = None
    sample_id: Optional[UUID] = None

    @classmethod
    def as_form(
        cls,
        image: UploadFile = File(max_lenght=10485760),
        type: Literal[
            "resume", "avatar", "sample", "general", "canva", "cover_picture"
        ] = Form("resume"),
        resume_id: Optional[UUID] = Form(None),
        sample_id: Optional[UUID] = Form(None),
    ):
        return cls(image=image, type=type, resume_id=resume_id, sample_id=sample_id)

from typing import Optional
from uuid import UUID
from fastapi import File, Form, UploadFile
from pydantic import BaseModel
from src.schema import BaseSchema
from enum import Enum


class BackgroundType(str, Enum):
    default = "default"
    ai = "ai"


class BackgroundImageSchema(BaseModel):
    url: str
    name: Optional[str] = None
    type: BackgroundType
    category_ids: Optional[list[UUID]] = None
    creator_id: UUID


class BackgroundImgResponse(BaseSchema, BackgroundImageSchema):
    pass


class BackgroundImageCreate(BaseModel):
    images: list[UploadFile]
    type: BackgroundType = BackgroundType.default
    name: Optional[str] = None
    category_ids: list[UUID]

    @classmethod
    def as_form(cls,
                images: list[UploadFile] = File(...),
                type: BackgroundType = Form("default"),
                name: Optional[str] = Form(None),
                category_ids: list[UUID] = Form(...)
                ):
        return cls(images=images, type=type, name=name, category_ids=category_ids)


class TextKeywordsCreate(BaseModel):
    names: list[str]
    topic: str


class TextKeywords(BaseSchema):
    name: str
    topic: str
    account_id: UUID

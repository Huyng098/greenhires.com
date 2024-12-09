from enum import Enum
from fastapi import File, Form, UploadFile
from pydantic import BaseModel
from typing import Literal, Optional
from uuid import UUID
from src.schema import BaseSchema
from src.sample.schema import BuilderType, Layers, ResumeType, ResumeVisibilityEnum
from src.sample.schema import ResumeData


class ResumeCreate(BaseModel):
    title: str
    type: ResumeType
    resume_data: Optional[ResumeData] = None
    resume_canva: Optional[list[Layers]] = None
    visibility: Optional[ResumeVisibilityEnum] = ResumeVisibilityEnum.private
    builder_type: Optional[BuilderType] = BuilderType.resumeio


class ResumeCreateParsing(BaseModel):
    title: str
    type: ResumeType
    template_id: Optional[str] = None
    resume_data: Optional[ResumeData] = None
    resume_canva: Optional[list[Layers]] = None
    visibility: Optional[ResumeVisibilityEnum] = ResumeVisibilityEnum.private
    builder_type: Optional[BuilderType] = BuilderType.resumeio
    linkedin_file: UploadFile

    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        template_id: Optional[str] = Form(None),
        resume_data: Optional[ResumeData] = Form(None),
        resume_canva: Optional[list[Layers]] = Form(None),
        visibility: Optional[ResumeVisibilityEnum] = Form(ResumeVisibilityEnum.private),
        type: ResumeType = Form(...),
        builder_type: Optional[BuilderType] = Form(BuilderType.resumeio),
        linkedin_file: UploadFile = File(...),
    ):
        return cls(
            title=title,
            template_id=template_id,
            resume_data=resume_data,
            resume_canva=resume_canva,
            visibility=visibility,
            type=type,
            builder_type=builder_type,
            linkedin_file=linkedin_file,
        )


class ResumeUpdate(BaseModel):
    id: Optional[UUID] = None
    title: Optional[str] = None
    slug: Optional[str] = None
    visibility: Optional[ResumeVisibilityEnum] = ResumeVisibilityEnum.private
    locked: Optional[bool] = False
    resume_data: Optional[ResumeData] = None
    resume_canva: Optional[list[Layers]] = None
    language: Optional[str] = None


class Resume(ResumeUpdate, BaseSchema):
    account_id: Optional[UUID] = None
    builder_type: BuilderType
    type: ResumeType
    language: Literal["en", "fr", "de", "es", "pt", "ru", "ja", "ko", "zh", "vi"]


class HTMLString(BaseModel):
    html: str


class ResumeImport(BaseModel):
    title: str
    resume_id: str


class ResumeDownloadable(BaseModel):
    is_downloadable: bool

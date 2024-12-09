from uuid import UUID
from fastapi import File, Form, UploadFile
from pydantic import BaseModel
from typing import Any, Optional

from src.schema import BaseSchema, Status


class BlogCreate(BaseModel):
    banner: UploadFile
    title: str
    content: str
    category_id: UUID

    @classmethod
    def as_form(
        cls,
        banner: UploadFile = File(...),
        title: str = Form(...),
        content: str = Form(...),
        category_id: UUID = Form(...),
    ):
        return cls(banner=banner, title=title, content=content, category_id=category_id)


class Blog(BlogCreate, BaseSchema):
    author_id: UUID
    author_name: Optional[str] = None
    category_name: Optional[str] = None
    author_picture: Optional[str] = None
    banner: Optional[str] = None
    status: Optional[Status] = None
    comments: Optional[list[dict[str, Any]]] = None


class BlogUpdate(BaseModel):
    banner: Optional[UploadFile] = None
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[Status] = None
    category_id: Optional[UUID] = None

    @classmethod
    def as_form(
        cls,
        banner: Optional[UploadFile] = File(None),
        title: Optional[str] = Form(None),
        content: Optional[str] = Form(None),
        category_id: Optional[UUID] = Form(None),
        status: Optional[Status] = Form(None),
    ):
        return cls(
            banner=banner,
            title=title,
            content=content,
            category_id=category_id,
            status=status,
        )


class BlogApprovalUpdate(BaseModel):
    status: Optional[Status] = None
    comment: Optional[str] = None


class Comment(BaseSchema):
    content: str
    account_id: UUID
    blog_id: UUID
    isHidden: bool
    parent_comment_id: Optional[UUID] = None
    commenter_picture: Optional[str] = None
    commenter_name: Optional[str] = None
    num_of_children: Optional[int] = None


class CommentCreate(BaseModel):
    content: str
    blog_id: str
    parent_comment_id: Optional[str] = None


class CommentUpdate(BaseModel):
    content: Optional[str] = None
    isHidden: Optional[bool] = None

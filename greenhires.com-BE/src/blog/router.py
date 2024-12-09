from datetime import date
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException
from src.blog import service
from src.auth.jwt import JWTData, parse_jwt_account_data, parse_jwt_consultant_data
from src.blog import schema
from src.schema import PaginationData, Status
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src import schema as baseSchema

router = APIRouter()


@router.post("", response_model=schema.Blog)
async def create_blog(
    blog: schema.BlogCreate = Depends(schema.BlogCreate.as_form),
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> schema.Blog:
    await service.get_blog_by_title(db, blog.title)
    return await service.create_blog(db, blog, jwt_data.account_id)


@router.get("/public-blogs", response_model=PaginationData[schema.Blog])
async def get_all_public_blogs(
    limit: int = 25, offset: int = 0, db: AsyncSession = Depends(get_db)
) -> PaginationData[schema.Blog]:
    items, total = await service.get_blogs(db, limit, offset, Status.approved)
    return PaginationData[schema.Blog](items=items, total=total)


@router.post("/add-comment-blog", response_model=schema.Comment)
async def add_comment_blog(
    comment: schema.CommentCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Comment:
    isadmin = jwt_data.role in ["admin", "superadmin"]
    comment = await service.add_comment_blog(db, comment, jwt_data.account_id, isadmin)
    return comment


@router.get("/parent-comments", response_model=PaginationData[schema.Comment])
async def get_all_comments(
    blog_id: str,
    limit: int = 50,
    offset: int = 0,
    is_hidden: bool = None,
    db: AsyncSession = Depends(get_db),
) -> PaginationData[schema.Comment]:
    all_parent_comments, total = await service.get_all_parent_comments(
        db, blog_id, limit, offset, is_hidden
    )
    return PaginationData[schema.Comment](
        items=all_parent_comments,
        total=total,
    )


@router.get("/child-comments", response_model=list[schema.Comment])
async def get_all_child_comments(
    parent_id: str, db: AsyncSession = Depends(get_db)
) -> list[schema.Comment]:
    all_child_comments = await service.get_all_child_comments(db, parent_id)
    return all_child_comments


@router.get("/{blog_id}", response_model=schema.Blog)
async def get_blog(blog_id: str, db: AsyncSession = Depends(get_db)) -> schema.Blog:
    blog = await service.get_blog(db, blog_id)
    return blog


@router.get("", response_model=PaginationData[schema.Blog])
async def get_all_blogs(
    page: int = 0,
    limit: int = 25,
    status: Status = None,
    category_id: str = None,
    start_date: date = None,
    end_date: date = None,
    restrict: Literal["all", "my"] = "all",
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> PaginationData[schema.Blog]:
    account_id = jwt_data.account_id if restrict == "my" else None
    items, total = await service.get_blogs(
        db, limit, page * limit, status, category_id, start_date, end_date, account_id
    )
    return PaginationData[schema.Blog](items=items, total=total)


@router.put("/{blog_id}", response_model=schema.Blog)
async def update_blog(
    blog_id: str,
    updated_blog: schema.BlogUpdate = Depends(schema.BlogUpdate.as_form),
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> schema.Blog:
    if jwt_data.role == "consultant" and (
        updated_blog.status in [Status.approved, Status.rejected]
    ):
        raise HTTPException(status_code=403, detail="Not enough permission")
    return await service.update_blog(db, blog_id, updated_blog)


@router.put("/update-status/{blog_id}", response_model=schema.Blog)
async def update_blog_status(
    blog_id: str,
    data: schema.BlogApprovalUpdate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> schema.Blog:
    if jwt_data.role == "consultant" and data.status != Status.waiting:
        raise HTTPException(status_code=403, detail="Not enough permission")
    return await service.update_blog_status(db, blog_id, data, jwt_data.account_id)


@router.delete("/{blog_id}")
async def delete_blog(
    blog_id: str,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> baseSchema.Message:
    blog = await service.get_blog(db, blog_id)
    if jwt_data.role not in ["admin", "superadmin"] and blog.status not in [
        "pending",
        "rejected",
    ]:
        raise HTTPException(status_code=403, detail="Not enough permission")
    blog = await service.delete_blog(db, blog_id)
    return baseSchema.Message(message="Blog deleted")


@router.put("/comment/{id}", response_model=schema.Comment)
async def update_comment(
    id: str,
    comment: schema.CommentUpdate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Comment:
    if jwt_data.role not in ["admin", "superadmin"]:
        comment.isHidden = None
    comment = await service.update_comment(db, id, comment)
    return comment

from datetime import date
from uuid import uuid4

from fastapi import HTTPException
from src.auth.model import Account
from src.blog.model import Blog, ParentChildComment, Comment
from src.blog.schema import (
    BlogApprovalUpdate,
    BlogCreate,
    BlogUpdate,
    CommentCreate,
    CommentUpdate,
)
from sqlalchemy import insert, select, update, delete, and_
from src.general.model import Category
from src.general import service as general_service
from typing import Any
from sqlalchemy.sql import func
from src.schema import Status
from src.blog import schema
from src.notification import service as noti_service
from src.notification.model import NotificationType
from src.auth import service as auth_service
import re
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession


async def create_blog(
    db: AsyncSession,
    blog: BlogCreate,
    account_id: str,
) -> schema.Blog | None:
    slug = (re.sub(r"<[^>]*>", "", blog.title)).replace(" ", "-")
    # Upload banner
    extension = blog.banner.filename.split(".")[-1]
    blog_id = uuid4()
    path = f"blog/banner/{blog_id}.{extension}"
    banner_url = general_service.upload_file(blog.banner, path)
    statement = (
        insert(Blog)
        .values(
            {
                "id": blog_id,
                "title": blog.title,
                "slug": slug,
                "content": blog.content,
                "author_id": account_id,
                "banner": banner_url,
                "category_id": blog.category_id,
            }
        )
        .returning(Blog)
    )
    result = await db.execute(statement)
    dto = result.scalars().first()
    blog = schema.Blog.model_validate(dto)
    await db.commit()
    return blog


async def get_blog(db: AsyncSession, blog_id: str) -> schema.Blog | None:
    query = (
        select(
            Blog,
            Category.name.label("category_name"),
            func.concat(Account.firstname, " ", Account.lastname).label("author_name"),
            Account.picture.label("author_picture"),
        )
        .where(Blog.id == blog_id)
        .join(Category, Blog.category_id == Category.id, isouter=True)
        .join(Account, Blog.author_id == Account.id, isouter=True)
    )
    result = await db.execute(query)
    dto = result.first()
    if dto is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    blog = schema.Blog.model_validate(
        {
            **dto.Blog.__dict__,
            "category_name": dto.category_name,
            "author_name": dto.author_name,
            "author_picture": dto.author_picture,
        }
    )
    return blog


async def get_blog_by_title(db: AsyncSession, title: str) -> schema.Blog | None:
    stmt = select(Blog).where(Blog.title == title)
    result = await db.execute(stmt)
    dto = result.scalars().first()
    if dto is not None:
        raise HTTPException(status_code=404, detail="Blog title already exists")


async def get_blogs(
    db: AsyncSession,
    limit: int = 25,
    offset: int = 0,
    status: Status = None,
    category_id: str = None,
    start_date: date = None,
    end_date: date = None,
    account_id: str = None,
) -> list[schema.Blog] | None:
    statement = (
        select(
            Blog,
            Category.name.label("category_name"),
            func.concat(Account.firstname, " ", Account.lastname).label("author_name"),
            Account.picture.label("author_picture"),
            func.count(Blog.id).over().label("total"),
        )
        .join(Category, Blog.category_id == Category.id, isouter=True)
        .join(Account, Blog.author_id == Account.id, isouter=True)
        .limit(limit)
        .offset(offset)
        .order_by(Blog.created_at.desc())
        .where(
            and_(
                Blog.category_id == category_id if category_id else True,
                Blog.status == status if status else True,
                Blog.updated_at >= start_date if start_date else True,
                Blog.updated_at <= end_date if end_date else True,
                Blog.author_id == account_id if account_id else True,
                Blog.status != Status.pending if not account_id else True,
            )
        )
    )
    result = await db.execute(statement)
    dto = result.all()
    return [
        schema.Blog.model_validate(
            {
                **blog.Blog.__dict__,
                "category_name": blog.category_name,
                "author_name": blog.author_name,
                "author_picture": blog.author_picture,
            }
        )
        for blog in dto
    ], (dto[0].total if len(dto) > 0 else 0)


async def update_blog(
    db: AsyncSession,
    blog_id: str,
    updated_blog: BlogUpdate,
) -> schema.Blog:
    # Upload banner
    if updated_blog.banner:
        extension = updated_blog.banner.filename.split(".")[-1]
        path = f"blog/banner/{blog_id}.{extension}"
        banner_url = general_service.upload_file(updated_blog.banner, path)
        updated_blog.banner = banner_url
    stmt = (
        update(Blog)
        .where(Blog.id == blog_id)
        .values(updated_blog.model_dump(exclude_none=True))
        .returning(Blog)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    blog = schema.Blog.model_validate(dto)
    await db.commit()
    return blog


async def delete_blog(db: AsyncSession, blog_id: str) -> schema.Blog | None:
    stmt = delete(Blog).where(Blog.id == blog_id).returning(Blog)
    result = await db.execute(stmt)
    dto = result.scalars().first()
    if dto is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    blog = schema.Blog.model_validate(dto)
    await db.commit()
    return blog


async def get_all_parent_comments(
    db: AsyncSession,
    blog_id: str,
    limit: int = 10,
    offset: int = 0,
    is_hidden: bool = None,
) -> list[dict[str, Any]] | None:

    subquery = (
        select(
            ParentChildComment.parent_comment_id,
            func.count(ParentChildComment.child_comment_id).label("num_of_children"),
        )
        .group_by(ParentChildComment.parent_comment_id)
        .subquery()
    )

    stmt = (
        select(
            Comment,
            Account.picture.label("commenter_picture"),
            func.concat(Account.firstname, " ", Account.lastname).label(
                "commenter_name"
            ),
            func.count(Comment.id).over().label("total"),
            subquery.c.num_of_children,
        )
        .where(
            Comment.blog_id == blog_id,
        )
        .join(Account, Comment.account_id == Account.id)
        .join(
            ParentChildComment,
            and_(
                ParentChildComment.child_comment_id == Comment.id,
                ParentChildComment.parent_comment_id == None,
            ),
        )
        .join(subquery, subquery.c.parent_comment_id == Comment.id, isouter=True)
        .limit(limit)
        .offset(offset)
        .order_by(Comment.updated_at.desc())
    )
    if is_hidden is not None:
        stmt = stmt.filter(Comment.isHidden == is_hidden)
    result = await db.execute(stmt)
    comments_dto = result.all()
    comments = [
        {
            **comment.Comment.__dict__,
            "commenter_name": comment.commenter_name,
            "commenter_picture": comment.commenter_picture,
            "num_of_children": comment.num_of_children,
        }
        for comment in comments_dto
    ]
    return comments, (comments_dto[0].total if len(comments_dto) > 0 else 0)


async def add_comment_blog(
    db: AsyncSession, comment: CommentCreate, account_id: str, isadmin: bool
) -> schema.Comment:
    stmt = (
        insert(Comment)
        .values(
            {
                "blog_id": comment.blog_id,
                "content": comment.content,
                "account_id": account_id,
                "isHidden": False if isadmin else True,
            }
        )
        .returning(Comment)
    )
    result = await db.execute(stmt)
    db_comment = result.scalars().first()
    comment_dto = schema.Comment.model_validate(db_comment)
    stmt = insert(ParentChildComment).values(
        {
            "parent_comment_id": comment.parent_comment_id,
            "child_comment_id": db_comment.id,
        }
    )
    await db.execute(stmt)
    # Get name and picture of the commenter
    stmt = select(Account.firstname, Account.lastname, Account.picture).where(
        Account.id == account_id
    )
    result = await db.execute(stmt)
    account = result.first()
    # Add notification to all admins
    blog = await get_blog(db, comment.blog_id)
    cleaned_title = re.sub(r"<[^>]*>", "", blog.title)
    if not isadmin:
        await noti_service.send_notification_to_admin(
            db=db,
            title="New comment added",
            content=f"New comment added by {account.firstname} {account.lastname} on blog {cleaned_title}",
            key=NotificationType.COMMENT,
            key_id=comment.blog_id,
        )
    await db.commit()
    return schema.Comment.model_validate(
        {
            **comment_dto.__dict__,
            "parent_comment_id": comment.parent_comment_id,
            "commenter_name": f"{account.firstname} {account.lastname}",
            "commenter_picture": account.picture,
        }
    )


async def get_all_child_comments(
    db: AsyncSession, parent_id: str
) -> list[dict[str, Any]] | None:
    subquery = (
        select(
            ParentChildComment.parent_comment_id,
            func.count(ParentChildComment.child_comment_id).label("num_of_children"),
        )
        .group_by(ParentChildComment.parent_comment_id)
        .subquery()
    )

    stmt = (
        select(
            Comment,
            Account.picture.label("commenter_picture"),
            ParentChildComment.parent_comment_id,
            func.concat(Account.firstname, " ", Account.lastname).label(
                "commenter_name"
            ),
            subquery.c.num_of_children,
        )
        .join(
            ParentChildComment,
            and_(
                Comment.id == ParentChildComment.child_comment_id,
                ParentChildComment.parent_comment_id == parent_id,
            ),
        )
        .join(Account, Comment.account_id == Account.id)
        .join(subquery, subquery.c.parent_comment_id == Comment.id, isouter=True)
        .order_by(Comment.updated_at.desc())
    )
    result = await db.execute(stmt)
    comments = result.scalars().all()
    return comments


async def update_comment(
    db: AsyncSession, id: str, comment: CommentUpdate
) -> schema.Comment:
    stmt = (
        update(Comment)
        .where(Comment.id == id)
        .values(comment.model_dump(exclude_none=True))
        .returning(Comment)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    comment_dto = schema.Comment.model_validate(dto)
    await db.commit()
    return comment_dto


async def update_blog_status(
    db: AsyncSession, blog_id: str, data: BlogApprovalUpdate, account_id: str
) -> schema.Blog:
    approver_id = (
        account_id if data.status in [Status.rejected, Status.approved] else None
    )
    if data.comment:
        # Get name of admin who approved/rejected the blog
        admin = await auth_service.get_account_by_id(db, approver_id)
        comments = [
            {
                "content": data.comment,
                "admin_name": (
                    f"{admin.firstname} {admin.lastname}" if admin else None
                ),
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        ]
    else:
        comments = []
    stmt = (
        update(Blog)
        .where(Blog.id == blog_id)
        .values(
            **data.model_dump(exclude={"comment"}),
            approver_id=approver_id,
            comments=Blog.comments + comments if data.comment else Blog.comments,
        )
        .returning(Blog)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    blog = schema.Blog.model_validate(dto)
    await db.commit()
    return blog

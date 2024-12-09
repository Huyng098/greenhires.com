from fastapi import APIRouter, Depends
from src.blog import schema
from src.blog.model import Blog as BlogModel
from sqlalchemy import select, text
from src.schema import Status
from src.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("/blogs", response_model=list[schema.Blog])
async def search_blogs(
    query: str, limit: int = 5, offset: int = 0, db: AsyncSession = Depends(get_db)
) -> list[schema.Blog]:
    stmt = f"""
      SELECT *
        FROM blog_idx.search(
          '(title:"{query}" OR content:"{query}")',
          limit_rows => {limit},
          offset_rows => {offset}
        )
    """
    result = await db.execute(text(stmt))
    blog = result.first()
    return [schema.Blog.model_validate(blog)]


@router.get("/related-blogs/{id}", response_model=list[schema.Blog])
async def related_blogs(
    id: str, limit: int = 5, db: AsyncSession = Depends(get_db)
) -> list[schema.Blog]:
    stmt = (
        select(BlogModel)
        .where(BlogModel.id != id)
        .filter(BlogModel.status == Status.approved)
        .limit(limit)
    )
    result = await db.execute(stmt)
    blogs = result.scalars().all()
    return [schema.Blog.model_validate(blog) for blog in blogs]

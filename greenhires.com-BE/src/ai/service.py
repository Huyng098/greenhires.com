import logging
import re
from typing import Optional
from uuid import UUID

from fastapi import HTTPException
from src.ai.schema import BackgroundType, BackgroundImageCreate, TextKeywordsCreate
from src.ai.model import BackgroundCategory, BackgroundImage, TextKeywords
from sqlalchemy import and_, delete, select, func, insert
from sqlalchemy.ext.asyncio import AsyncSession
from src.general.model import Category
from src.ai import schema


async def add_background_image(db: AsyncSession, bg: BackgroundImageCreate) -> None:
    stmt = (
        insert(BackgroundImage)
        .values(bg.model_dump(exclude={"category_ids"}))
        .returning(BackgroundImage)
    )
    result = await db.execute(stmt)
    background = result.scalars().first()
    stmt = insert(BackgroundCategory).values(
        [
            {"background_id": background.id, "category_id": category_id}
            for category_id in bg.category_ids
        ]
    )
    await db.execute(stmt)
    await db.commit()


async def delete_background_image(
    db: AsyncSession, bg_id: UUID, account_id: UUID = None
) -> schema.BackgroundImgResponse:
    stmt = (
        delete(BackgroundImage)
        .where(
            and_(
                BackgroundImage.id == bg_id,
                BackgroundImage.creator_id == account_id if account_id else True,
            )
        )
        .returning(BackgroundImage)
    )
    result = await db.execute(stmt)
    bg = result.scalars().first()
    if not bg:
        raise HTTPException(status_code=404, detail="Background not found")
    background = schema.BackgroundImgResponse.model_validate(bg)
    await db.commit()
    return background


async def get_background_images(
    db: AsyncSession,
    limit: int,
    offset: int,
    type: Optional[BackgroundType] = None,
    category_id: Optional[str] = None,
    account_id: Optional[UUID] = None,
) -> tuple[list[schema.BackgroundImgResponse], int]:
    stmt = (
        select(
            BackgroundImage,
            func.array_agg(Category.id).label("category_ids"),
            func.count().over().label("total"),
        )
        .join(BackgroundImage.categories, isouter=True)
        .where(
            and_(
                BackgroundImage.type == type if type else True,
                Category.id.in_([category_id]) if category_id else True,
                BackgroundImage.creator_id == account_id if account_id else True,
            )
        )
        .group_by(BackgroundImage.id)
        .order_by(BackgroundImage.updated_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    rows = result.all()
    return [
        schema.BackgroundImgResponse.model_validate(
            {
                **row[0].__dict__,
                "category_ids": row[1],
            }
        )
        for row in rows
    ], (rows[0][2] if len(rows) > 0 else 0)


async def add_text_keywords(
    db: AsyncSession, text_keywords: TextKeywordsCreate, account_id: UUID
) -> None:
    cleaned_texts = []
    for t in text_keywords.names:
        text = t.lower().strip()
        text = re.sub(r"[^\w\s]", " ", text)
        text = re.sub(r"\s+", " ", text)
        words = text.split()
        cleaned_texts.extend(words)
    values = [
        {
            "name": text,
            "topic": text_keywords.topic,
            "account_id": account_id,
        }
        for text in cleaned_texts
    ]
    try:
        stmt = insert(TextKeywords).values(values).returning(TextKeywords)
        await db.execute(stmt)
        await db.commit()
    except:
        logging.error(f"Error adding duplicated text keywords")


async def get_text_keywords(
    db: AsyncSession,
    account_id: UUID,
    limit: int = 10,
    offset: int = 0,
    topic: Optional[str] = None,
) -> tuple[list[schema.TextKeywords], int]:
    stmt = (
        select(TextKeywords, func.count().over().label("total"))
        .where(
            and_(
                TextKeywords.topic == topic if topic else True,
                TextKeywords.account_id == account_id,
            )
        )
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    rows = result.all()
    keywords = [schema.TextKeywords.model_validate(row[0]) for row in rows]
    return keywords, rows[0][1] if len(rows) > 0 else 0

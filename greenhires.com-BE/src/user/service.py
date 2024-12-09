from typing import Any
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy import func, insert, update, select, delete
from src.auth.model import AccountRoleEnum, Secret, Account
from src.user.model import CanvaImage, Feature
from src.auth.security import check_password, hash_password
from src.auth.exceptions import InvalidCredentials
from src.auth import schema
from src.user import schema as user_schema
from sqlalchemy.ext.asyncio import AsyncSession


async def change_password(db: AsyncSession, account_id: str, new_password: str) -> None:
    """Update reset token for the given email"""
    hashed_password = hash_password(new_password)
    stmt = (
        update(Secret)
        .values(password=hashed_password)
        .where(Secret.account_id == account_id)
    )
    await db.execute(stmt)
    await db.commit()


async def verify_password(db: AsyncSession, account_id: str, old_password: str) -> str:
    """Get password for the given account"""
    select_password = select(Secret.password).where(Secret.account_id == account_id)
    result = await db.execute(select_password)
    hashed_password = result.scalars().first()
    if not check_password(old_password, hashed_password):
        raise InvalidCredentials()


async def change_info(
    db: AsyncSession, account_id: str, info: user_schema.ProfileCreate
) -> schema.BasicInformation:
    """Update personal information for the given account"""
    stmt = (
        update(Account)
        .values(info.model_dump(exclude_none=True))
        .where(Account.id == account_id)
        .returning(Account)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    user = schema.BasicInformation.model_validate(dto)
    await db.commit()
    return user


async def get_all_users(
    db: AsyncSession, limit: int = 10, offset: int = 0, role: AccountRoleEnum = None
) -> tuple[list[schema.BasicInformation], int]:
    """Get all users"""
    stmt = (
        select(
            Account,
            func.count(Account.id).over().label("total"),
        )
        .limit(limit)
        .offset(offset)
    )
    if role:
        stmt = stmt.where(Account.role == role)
    result = await db.execute(stmt)
    result = result.all()
    users = [schema.BasicInformation.model_validate(user.Account) for user in result]
    total = result[0].total if len(result) > 0 else 0
    return users, total


async def delete_account(db: AsyncSession, user_id: str) -> None:
    stmt = delete(Account).where(Account.id == user_id).returning(Account.id)
    result = await db.execute(stmt)
    account = result.scalars().first()
    if not account:
        raise HTTPException(status_code=404, detail="User not found!")
    await db.commit()


async def change_role_user(
    db: AsyncSession, account_id: str, role: AccountRoleEnum
) -> schema.BasicInformation:
    stmt = (
        update(Account)
        .values(role=role)
        .where(Account.id == account_id)
        .returning(Account)
    )
    result = await db.execute(stmt)
    account = result.scalars().first()
    if not account:
        raise HTTPException(status_code=404, detail="User not found!")
    acc = schema.BasicInformation.model_validate(account)
    await db.commit()
    return acc


async def get_features(db: AsyncSession, account_id: str) -> user_schema.Feature:
    stmt = select(Feature).where(Feature.account_id == account_id)
    result = await db.execute(stmt)
    features = result.scalars().first()
    return user_schema.Feature.model_validate(features)


async def insert_canva_image(
    db: AsyncSession, account_id: str, url: str, image_type: user_schema.CanvaImageType
) -> None:
    stmt = insert(CanvaImage).values(account_id=account_id, url=url, type=image_type)
    await db.execute(stmt)
    await db.commit()


async def get_canva_images(
    db: AsyncSession,
    account_id: UUID,
    limit: int = 10,
    offset: int = 0,
) -> list[user_schema.CanvaImage] | None:
    stmt = (
        select(CanvaImage, func.count(CanvaImage.id).over().label("total"))
        .where(CanvaImage.account_id == account_id)
        .limit(limit)
        .offset(offset)
        .order_by(CanvaImage.created_at.desc())
    )
    result = await db.execute(stmt)
    dto = result.all()
    return (
        [user_schema.CanvaImage.model_validate(image.CanvaImage) for image in dto],
        dto[0].total if len(dto) > 0 else 0,
    )

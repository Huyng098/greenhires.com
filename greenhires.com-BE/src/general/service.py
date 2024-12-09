import logging
from io import BytesIO
from fastapi import UploadFile
from sqlalchemy import insert, select
from src.external_service.upload_server import UploadServerInstance
from src.external_service.aws import S3Instance
from src.general import schema
from src.general.model import Category
from src.config import settings
from sqlalchemy.ext.asyncio import AsyncSession


async def create_category(
    db: AsyncSession, category: schema.CategoryCreate, account_id: str
) -> schema.Category:
    try:
        stmt = (
            insert(Category)
            .values(
                {
                    "name": category.name,
                    "created_by_id": account_id,
                    "type": category.type,
                }
            )
            .returning(Category)
        )
        result = await db.execute(stmt)
        result = result.scalars().first()
        category_db = schema.Category.model_validate(result)
        await db.commit()
        return category_db
    except Exception as e:
        logging.error("Error when creating category: ", e)


async def get_all_categories(
    db: AsyncSession, cate_type: schema.CategoryType
) -> list[schema.Category]:
    stmt = select(Category).where(Category.type == cate_type)
    result = await db.execute(stmt)
    categories = result.scalars().all()
    return [schema.Category.model_validate(category) for category in categories]


def upload_file(file: BytesIO, path: str) -> str:
    try:
        if settings.IS_USE_LOCAL_STATIC_FILES:
            url = UploadServerInstance.upload_object(file, path)
        else:
            url = S3Instance.upload_object(file.file, path)
        return url
    except Exception as e:
        logging.error("Error when uploading file: ", e)


def delete_file(file_url: str) -> None:
    try:
        if settings.IS_USE_LOCAL_STATIC_FILES:
            UploadServerInstance.delete_object(file_url)
        else:
            S3Instance.delete_object(file_url)
            logging.info(f"File {file_url} has been deleted")
    except Exception as e:
        logging.error("Error when deleting file: ", e)

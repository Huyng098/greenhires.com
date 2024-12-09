from src.general import service as general_service
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from src.ai.schema import (
    BackgroundImageSchema,
    BackgroundImgResponse,
    BackgroundType,
    TextKeywords,
    TextKeywordsCreate,
)
from src.ai.schema import BackgroundImageCreate
from src.schema import PaginationData
from src.ai import service
from src.auth.schema import AccountRoleEnum, JWTData
from src.auth.jwt import parse_jwt_account_data, parse_jwt_consultant_data
from src.general import service as general_service
from src.resume import service as resume_service
from uuid import uuid4
from src.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.utils import get_resume_content

router = APIRouter()


@router.post("/add-keywords")
async def add_keywords(
    text_keywords: TextKeywordsCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> None:
    await service.add_text_keywords(db, text_keywords, jwt_data.account_id)


@router.get("/get-keywords", response_model=PaginationData[TextKeywords])
async def get_keywords(
    limit: int = 10,
    offset: int = 0,
    topic: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> PaginationData[TextKeywords]:
    text_keywords, total = await service.get_text_keywords(
        db, jwt_data.account_id, limit, offset, topic
    )
    return PaginationData[TextKeywords](items=text_keywords, total=total)


@router.post("/upload-background", response_model=list[BackgroundImgResponse])
async def upload_background(
    background_image: BackgroundImageCreate = Depends(BackgroundImageCreate.as_form),
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> list[BackgroundImgResponse]:
    backgrounds: list[BackgroundImgResponse] = []
    for image in background_image.images:
        extension = image.filename.split(".")[-1]
        path = f"background-store/{uuid4()}.{extension}"
        # Upload file to S3
        url = general_service.upload_file(image, path)
        bg = BackgroundImageSchema(
            url=url,
            name=background_image.name,
            type=background_image.type,
            category_ids=background_image.category_ids,
            creator_id=jwt_data.account_id,
        )
        await service.add_background_image(db, bg)
        backgrounds.append(bg)
    return backgrounds


@router.delete(
    "/background-image/{background_id}", response_model=BackgroundImgResponse
)
async def delete_background_image(
    background_id: str,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> BackgroundImgResponse:
    account_id = jwt_data.account_id if jwt_data.role == AccountRoleEnum.consultant else None
    bg = await service.delete_background_image(db, background_id, account_id)
    general_service.delete_file(bg.url)
    return bg


@router.get("/background-image", response_model=PaginationData[BackgroundImgResponse])
async def get_background_image(
    limit: int = 10,
    offset: int = 0,
    type: Optional[BackgroundType] = None,
    category_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
) -> PaginationData[BackgroundImgResponse]:
    background_images, total = await service.get_background_images(
        db, limit, offset, type, category_id
    )
    return PaginationData[BackgroundImgResponse](items=background_images, total=total)


@router.get("/my-background", response_model=PaginationData[BackgroundImgResponse])
async def get_my_background(
    limit: int = 10,
    offset: int = 0,
    type: Optional[BackgroundType] = None,
    category_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> PaginationData[BackgroundImgResponse]:
    background_images, total = await service.get_background_images(
        db, limit, offset, type, category_id, jwt_data.account_id
    )
    return PaginationData[BackgroundImgResponse](items=background_images, total=total)

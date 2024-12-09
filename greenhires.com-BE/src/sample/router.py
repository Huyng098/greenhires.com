from src.auth.exceptions import NotEnoughPermissions
from typing import Literal, Optional
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from src.sample import service
from src.sample import schema
from src.schema import PaginationData, Url
from uuid import UUID
from datetime import date
from src.sample.iconfinder_api import GraphicService
from src.sample.unsplash_api import ImageService
from src.schema import Status
from src.auth.jwt import parse_jwt_consultant_data, parse_jwt_account_data
from src.auth.schema import JWTData, AccountRoleEnum
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src import schema as baseSchema

router = APIRouter()


@router.get("/fonts", response_model=PaginationData[schema.Font])
async def get_all_fonts(
    q: str = None,
    offset: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
) -> PaginationData[schema.Font]:
    items, total = await service.getFonts(db, q, offset, limit)
    return PaginationData[schema.Font](items=items, total=total)


@router.get("/frames", response_model=list[schema.Frame])
async def get_all_frames(
    db: AsyncSession = Depends(get_db),
) -> list[schema.Frame]:
    return await service.getFrames(db)


@router.post("", response_model=schema.Sample)
async def create_sample(
    sample: schema.SampleCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> schema.Sample:
    return await service.create_sample(db, sample, jwt_data.account_id)


@router.get("/public-samples", response_model=PaginationData[schema.Sample])
async def get_public_samples(
    limit: int = 25,
    page: int = 0,
    type: schema.SampleType = None,
    category_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
) -> PaginationData[schema.Sample]:
    items, total = await service.get_all_samples(
        db,
        limit=limit,
        offset=page * limit,
        category_id=category_id,
        type=type,
        status=Status.approved,
    )
    return PaginationData[schema.Sample](items=items, total=total)


@router.get("", response_model=PaginationData[schema.Sample])
async def get_all_samples(
    limit: int = 25,
    page: int = 0,
    status: Status = None,
    name: str = None,
    start_date: date = None,
    end_date: date = None,
    type: schema.SampleType = None,
    category_id: Optional[UUID] = None,
    restrict: Literal["all", "my"] = "all",
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> PaginationData[schema.Sample]:
    if restrict == "all" and jwt_data.role not in ["admin", "superadmin"]:
        raise NotEnoughPermissions()

    account_id = jwt_data.account_id if restrict == "my" else None
    items, total = await service.get_all_samples(
        db,
        limit,
        page * limit,
        category_id,
        status,
        name,
        start_date,
        end_date,
        type,
        account_id,
    )
    return PaginationData[schema.Sample](items=items, total=total)


@router.patch("/{sample_id}", response_model=schema.Sample)
async def update_sample(
    sample_id: str,
    data: schema.SampleUpdate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Sample:
    account_id = jwt_data.account_id
    sample = await service.update_sample(db, account_id, sample_id, data)
    return sample


@router.post("/import", response_model=schema.Sample)
async def import_sample(
    sample: schema.SampleImport,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Sample:
    account_id = jwt_data.account_id
    result = await service.import_sample(db, account_id, sample)
    return result


@router.get("/export/{sample_id}", response_model=Url)
async def export_sample(
    sample_id: UUID,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> Url:
    account_id = jwt_data.account_id
    sample = await service.get_sample_by_id(db, sample_id)
    url = await service.export_sample_to_pdf(sample, account_id)
    return Url(url=url)


@router.delete("/{id}")
async def delete_sample_by_id(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> baseSchema.Message:
    sample = await service.get_sample_by_id(db, id)
    if sample.status != "pending" and jwt_data.role == "consultant":
        raise HTTPException(
            status_code=403, detail="You do not have enough permissions"
        )
    await service.delete_sample_by_id(db, id)
    return baseSchema.Message(message="Sample deleted")


@router.get("/textstyles", response_model=list[schema.TextStyles])
async def get_text_styles(
    db: AsyncSession = Depends(get_db),
) -> list[schema.TextStyles]:
    return await service.getTextStyles(db)


@router.get("/graphics", response_model=PaginationData[schema.SVGImage])
async def get_all_graphics(
    q: str = "",
    offset: int = 0,
    limit: int = 100,
) -> PaginationData[schema.SVGImage]:
    return GraphicService.get_all(q, offset, limit)


@router.get("/graphics/download")
async def download_graphic(url: str) -> dict[str, str]:
    return GraphicService.download(url)


@router.get("/images", response_model=PaginationData[schema.UnsplashImage])
async def get_all_unsplash_images(
    q: str = None,
    page: int = 1,
    per_page: int = 10,
) -> PaginationData[schema.UnsplashImage]:
    return ImageService.get_all(q, page, per_page)


@router.put("/images/{id}")
async def download_image(id: str) -> dict[str, str]:
    return ImageService.download(id)


@router.put("/update-status/{id}", response_model=schema.Sample)
async def update_status(
    id: UUID,
    data: schema.SampleStatusUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> schema.Sample:
    if jwt_data.role == AccountRoleEnum.consultant and (
        (data.status and data.status != Status.waiting) or not data.category_ids
    ):
        raise NotEnoughPermissions()
    sample = await service.change_status(db, id, data, jwt_data.account_id)
    if data.status == Status.approved:  # update thumnails of template
        background_tasks.add_task(service.update_thumbnails, db, sample)
    return sample.model_dump(exclude={"elements"})


@router.get("/{id}", response_model=schema.Sample)
async def get_sample_by_id(
    db: AsyncSession = Depends(get_db),
    id: UUID = None,
) -> schema.Sample:
    sample = await service.get_sample_by_id(db, id)
    return sample


@router.post("/replace-variant/{sample_id}", response_model=list[schema.SampleVariant])
async def replace_sample_variant(
    sample_id: UUID,
    data: schema.SampleVariantCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_consultant_data),
) -> list[schema.SampleVariant]:
    return await service.replace_variant(db, sample_id, data)

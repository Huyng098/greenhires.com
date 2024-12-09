from datetime import date, timedelta, datetime, timezone
import logging
import asyncio
from fastapi import HTTPException
from sqlalchemy import select, func, update, insert, delete, and_
from src.auth.model import Account
from src.auth import service as auth_service
from sqlalchemy.orm import aliased
from sqlalchemy.orm import noload
from src.general.model import Category
from src.general import service
from src.external_service.aws import S3Instance
from src.sample.model import (
    Font,
    Frame,
    Sample,
    SampleCategory,
    TextStyles,
    SampleVariant,
)
from uuid import UUID, uuid4
from src.sample import schema
from src.schema import Status
from src.notification import service as noti_service
from src.notification import schema as noti_schema
from src.utils import printer
from src.notification.model import NotificationType
from sqlalchemy.ext.asyncio import AsyncSession


async def getFonts(
    db: AsyncSession, q: str = None, offset: int = 0, limit: int = 100
) -> list[schema.Font] | None:
    stmt = (
        select(Font, func.count(Font.id).over().label("total"))
        .limit(limit)
        .offset(offset)
        .order_by(Font.name)
    )
    if q:
        stmt = stmt.where(Font.name.ilike(f"%{q}%"))
    result = await db.execute(stmt)
    dto = result.all()
    return [schema.Font.model_validate(font.Font) for font in dto], (
        dto[0].total if len(dto) > 0 else 0
    )


async def getFrames(db: AsyncSession) -> list[schema.Frame] | None:
    select_query = select(Frame)
    result = await db.execute(select_query)
    return [schema.Frame.model_validate(frame) for frame in result.scalars().all()]


async def getTextStyles(db: AsyncSession) -> list[schema.TextStyles] | None:
    select_query = select(TextStyles)
    result = await db.execute(select_query)
    return [
        schema.TextStyles.model_validate(text_style)
        for text_style in result.scalars().all()
    ]


async def create_sample(
    db: AsyncSession, sample: schema.SampleCreate, account_id: str
) -> schema.Sample | None:
    sample_id = uuid4()

    for page in sample.resume_canva:
        for layer in page.layers.values():
            # if layer.type.resolvedName == "TemplateLayoutLayer":
            layer.props["sampleId"] = str(sample_id)
    sample_db = Sample(
        id = str(sample_id),
        creator_id=account_id,
        name=sample.name,
        type=sample.type,
        resume_canva=(
            [canva.model_dump(exclude_none=True) for canva in sample.resume_canva]
            if sample.resume_canva
            else []
        ),
        resume_data = (
            sample.resume_data.model_dump(exclude_none=True) if sample.resume_data else None
        ),
        variants=[],
    )
    db.add(sample_db)
    await db.commit()
    await db.refresh(sample_db)
    sample = schema.Sample.model_validate(sample_db)
    return sample


async def get_all_samples(
    db: AsyncSession,
    limit: int = 25,
    offset: int = 0,
    category_id: UUID = None,
    status: Status = None,
    name: str = None,
    start_date: date = None,
    end_date: date = None,
    type: schema.SampleType = None,
    account_id: str = None,
) -> tuple[list[schema.Sample], int]:
    creator = aliased(Account, name="creator")
    approver = aliased(Account, name="approver")

    stmt = (
        select(
            Sample,
            func.concat(creator.firstname, " ", creator.lastname).label("creator_name"),
            func.concat(approver.firstname, " ", approver.lastname).label(
                "approver_name"
            ),
            func.count(Sample.id).over().label("total"),
        )
        .join(Sample.categories, isouter=True)
        .join(creator, Sample.creator_id == creator.id, isouter=True)
        .join(approver, Sample.approver_id == approver.id, isouter=True)
        .where(
            and_(
                Category.id.in_([category_id]) if category_id else True,
                Sample.status == status if status else True,
                Sample.name.ilike(f"%{name}%") if name else True,
                Sample.updated_at >= start_date if start_date else True,
                Sample.updated_at <= end_date if end_date else True,
                Sample.type == type if type else True,
                Sample.creator_id == account_id if account_id else True,
                Sample.status != Status.pending if not account_id else True,
            )
        )
        .group_by(Sample.id, creator.id, approver.id)
        .limit(limit)
        .offset(offset)
        .order_by(Sample.updated_at.desc())
    )
    result = (await db.execute(stmt)).unique()
    dto = result.all()
    sample = [
        schema.Sample.model_validate(
            {
                **d.Sample.__dict__,
                "creator_name": d.creator_name,
                "approver_name": d.approver_name,
                "category_ids": [c.id for c in d.Sample.categories],
                "category_names": [c.name for c in d.Sample.categories],
                "variants": [
                    schema.SampleVariant.model_validate(v) for v in d.Sample.variants
                ],
            }
        )
        for d in dto
    ]
    return sample, dto[0].total if len(dto) > 0 else 0


async def update_sample(
    db: AsyncSession, account_id: str, sample_id: str, data: schema.SampleUpdate
) -> schema.Sample | None:
    stmt = (
        update(Sample)
        .where(Sample.id == sample_id and Sample.creator_id == account_id)
        .values(data.model_dump(exclude_none=True))
        .options(noload(Sample.variants))
        .returning(Sample)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    sample = schema.Sample.model_validate(dto)
    await db.commit()
    return sample


async def get_sample_by_id(db: AsyncSession, id: UUID) -> schema.Sample:
    stmt = (
        select(
            Sample,
            func.concat(Account.firstname, " ", Account.lastname).label("creator_name"),
        )
        .where(Sample.id == id)
        .join(Sample.categories, isouter=True)
        .join(Account, Sample.creator_id == Account.id, isouter=True)
        .group_by(Sample.id, Account.id)
    )
    result = await db.execute(stmt)
    dto = result.first()
    if not dto:
        raise HTTPException(status_code=404, detail="Sample not found")
    sample = schema.Sample.model_validate(
        {
            **dto.Sample.__dict__,
            "category_ids": [c.id for c in dto.Sample.categories],
            "category_names": [c.name for c in dto.Sample.categories],
            "creator_name": dto.creator_name,
            "variants": [
                schema.SampleVariant.model_validate(v) for v in dto.Sample.variants
            ],
        }
    )
    return sample


async def delete_sample_by_id(db: AsyncSession, id: UUID) -> None:
    stmt = delete(Sample).where(Sample.id == id)
    await db.execute(stmt)
    await db.commit()


async def import_sample(
    db: AsyncSession, account_id: str, sample: schema.SampleImport
) -> schema.Sample:
    stmt = select(Sample).where(
        and_(Sample.id == sample.sample_id, Sample.creator_id == account_id)
    )
    result = await db.execute(stmt)
    sample_db = result.scalars().first()
    if not sample_db:
        raise HTTPException(status_code=404, detail="Sample not found")
    sample_db = Sample(
        creator_id=account_id,
        name=sample.name,
        type=sample_db.type,
        resume_canva=sample_db.resume_canva,
        resume_data=sample_db.resume_data,
        variants=[],
        categories=[],
    )
    db.add(sample_db)
    await db.commit()
    await db.refresh(sample_db)
    sample = schema.Sample.model_validate(sample_db)
    return sample


async def replace_variant(
    db: AsyncSession, sample_id: UUID, data: schema.SampleVariantCreate
) -> list[schema.SampleVariant] | None:
    try:
        stmt = delete(SampleVariant).where(SampleVariant.sample_id == sample_id)
        await db.execute(stmt)
        stmt = (
            insert(SampleVariant)
            .values([{"sample_id": sample_id, "color": c} for c in data.colors])
            .returning(SampleVariant)
        )
        result = await db.execute(stmt)
        dto = result.scalars().all()
        variants = [schema.SampleVariant.model_validate(v) for v in dto]
        await db.commit()
        return variants
    except Exception as e:
        logging.error("Error when inserting sample variant", e)


async def change_status(
    db: AsyncSession, sample_id: UUID, data: schema.SampleStatusUpdate, admin_id: UUID
) -> schema.Sample | None:

    if data.status == Status.waiting:
        due_date = datetime.now(timezone.utc) + timedelta(days=10)
    else:
        due_date = None
    data.due_date = due_date
    if data.comment:
        # Get name of admin who approved/rejected the blog
        stmt = select(Account.firstname, Account.lastname).where(Account.id == admin_id)
        result = await db.execute(stmt)
        firstname, lastname = result.first()
        comments = [
            {
                "content": data.comment,
                "admin_name": f"{firstname} {lastname}",
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        ]
    else:
        comments = []
    stmt = select(Sample).where(Sample.id == sample_id)
    result = await db.execute(stmt)
    dto = result.scalars().first()
    dto.approver_id = (
        admin_id if data.status in [Status.approved, Status.rejected] else None
    )
    if data.status:
        dto.status = data.status
    if data.due_date:
        dto.due_date = due_date
    dto.comments = dto.comments + comments if data.comment else dto.comments
    sample = schema.Sample.model_validate(dto)
    if data.category_ids:
        # Delete current category_ids
        await db.execute(
            delete(SampleCategory).where(SampleCategory.sample_id == sample_id)
        )
        # Insert new category_ids
        await db.execute(
            insert(SampleCategory).values(
                [
                    {"sample_id": sample_id, "category_id": category}
                    for category in data.category_ids
                ]
            )
        )
    if data.status == Status.approved or data.status == Status.rejected:
        # Get name of the approver
        approver = await auth_service.get_account_by_id(db, admin_id)
        # Notify creator
        await noti_service.create_notification(
            db=db,
            noti=noti_schema.NotificationCreate(
                title=f"{sample.type.value.upper()}",
                content=f"{sample.type.value.upper()} {sample.name} has been {data.status.value} by {approver.firstname} {approver.lastname}",
                account_ids=[sample.creator_id],
                key=NotificationType.SAMPLE,
                key_id=sample_id,
            ),
        )
    await db.commit()
    return sample


async def update_thumbnails(db: AsyncSession, sample: schema.Sample) -> None:
    # Generate previews concurrently
    if not sample.variants:
        sample.variants = [
            schema.SampleVariantCreate(color="default"),
        ]
    thumbnail_futures = [
        printer.generatePreview(sample.resume_canva, True, variant.color)
        for variant in sample.variants
    ]
    thumbnails = await asyncio.gather(*thumbnail_futures)
    # Prepare thumbnail buffers
    sample_buffers = [
        {"color": variant.color, "buffers": buffers}
        for variant, buffers in zip(sample.variants, thumbnails)
    ]
    for thumbnail in sample_buffers:
        variant_urls = []
        for i, buffer in enumerate(thumbnail["buffers"]):
            filepath = f"{sample.creator_id}/thumbnails/{sample.type.value}/{sample.id}/variant-{thumbnail['color'][1:]}/page-{i + 1}.jpg"
            url = service.upload_file(buffer, filepath)
            variant_urls.append(url)
        await db.execute(
            insert(SampleVariant).values(
                imgs=variant_urls, color=thumbnail["color"], sample_id=sample.id
            )
        )
    await db.commit()


async def export_sample_to_pdf(sample: schema.Sample, account_id: str) -> str:
    pdf = await printer.generatePDFFormat(sample.resume_canva, sample.resume_data)
    filepath = f"{account_id}/samples/{sample.type.value}/{sample.id}.pdf"
    url = service.upload_file(pdf, filepath)
    return url

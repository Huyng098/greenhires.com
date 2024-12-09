from typing import Any
from uuid import UUID, uuid4
from fastapi import HTTPException
from src.auth.model import Account
from src.general import service
from src.resume import schema
from sqlalchemy import and_, func, insert, select, delete, update
from src.resume.model import Resume
from src.external_service.aws import S3Instance
from src.sample.model import Sample
from src.utils import printer
from src.resume.dependency import check_reach_limit
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import defer


async def add_new_resume(
    db: AsyncSession, data: schema.ResumeCreate, account_id: str
) -> schema.Resume:
    resume_id = uuid4()
    for page in data.resume_canva:
        for layer in page.layers.values():
            if layer.type.resolvedName == "ResumeLayer":
                layer.props["resumeId"] = str(resume_id)
    insert_resume = (
        insert(Resume)
        .values(
            {
                "id": resume_id,
                "title": data.title,
                "slug": data.title.replace(" ", "-").lower(),
                "builder_type": data.builder_type,
                "type": data.type,
                "resume_canva": [
                    layer.model_dump(exclude_none=True) for layer in data.resume_canva
                ],
                "resume_data": data.resume_data.model_dump(exclude_none=True),
                "account_id": account_id,
            }
        )
        .returning(Resume)
    )
    result = await db.execute(insert_resume)
    dto = result.scalars().first()
    resume = schema.Resume.model_validate(dto)
    await db.commit()
    return resume


async def import_resume(
    db: AsyncSession, account_id: str, data: schema.ResumeImport
) -> schema.Resume:
    stmt = select(Resume).where(
        and_(Resume.id == data.resume_id, Resume.account_id == account_id)
    )
    result = await db.execute(stmt)
    old_resume = result.scalars().first()
    if old_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    # await check_reach_limit(db, account_id, old_resume.type)
    stmt = (
        insert(Resume)
        .values(
            {
                "title": data.title,
                "slug": data.title.replace(" ", "-").lower(),
                "account_id": account_id,
                "type": old_resume.type,
                "resume_canva": old_resume.resume_canva,
                "resume_data": old_resume.resume_data,
                "builder_type": old_resume.builder_type,
            }
        )
        .returning(Resume)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    resume = schema.Resume.model_validate(dto)
    await db.commit()
    return resume


async def get_resume_by_id(
    db: AsyncSession, account_id: str, resume_id: str
) -> schema.Resume | None:
    stmt = select(Resume).where(
        and_(Resume.account_id == account_id, Resume.id == resume_id)
    )
    result = await db.execute(stmt)
    resume = result.scalars().first()
    if resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    return schema.Resume.model_validate(resume)


async def get_all_resume_by_account_id(
    db: AsyncSession, account_id: str, type: schema.ResumeType
) -> list[dict[str, Any]] | None:
    stmt = (
        select(Resume)
        .where(and_(Resume.account_id == account_id, Resume.type == type))
        .order_by(Resume.updated_at.desc())
    )
    result = await db.execute(stmt)
    resumes = result.scalars().all()
    return [
        schema.Resume.model_validate(resume).model_dump(exclude_none=True)
        for resume in resumes
    ]


async def get_num_of_resumes(
    db: AsyncSession, account_id: str, type: schema.ResumeType
) -> int:
    stmt = select(func.count(Resume.id).label("count")).where(
        and_(Resume.account_id == account_id, Resume.type == type)
    )
    result = await db.execute(stmt)
    return result.scalars().first()


async def delete_resume(
    db: AsyncSession, account_id: str, resume_id: str
) -> schema.Resume | None:
    stmt = (
        delete(Resume)
        .where(and_(Resume.id == resume_id, Resume.account_id == account_id))
        .returning(Resume)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    if dto is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    resume = schema.Resume.model_validate(dto)
    await db.commit()
    return resume


async def update_resume(
    db: AsyncSession,
    account_id: str,
    resume_id: str,
    updated_resume: schema.ResumeUpdate,
) -> schema.Resume | None:
    resume = await get_resume_by_id(db, account_id, resume_id)
    if resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    elif resume.locked:
        raise HTTPException(status_code=403, detail="Resume is locked")
    else:
        if updated_resume.title:
            updated_resume.slug = updated_resume.title.replace(" ", "-").lower()
        stmt = (
            update(Resume)
            .where(and_(Resume.id == resume_id, Resume.account_id == account_id))
            .values(updated_resume.model_dump(exclude_none=True))
            .options(defer(Resume.resume_data), defer(Resume.resume_canva))
            .returning(Resume)
        )
        result = await db.execute(stmt)
        # dto = result.scalars().first()
        # resume = schema.Resume(**dto.__dict__)
        await db.commit()
        # await db.refresh(resume)
    return resume

async def update_canva(
    db: AsyncSession,
    account_id: UUID,
    resume_id: UUID,
    sample_id: UUID,
) -> schema.Resume | None:
    resume = await get_resume_by_id(db, account_id, resume_id)
    if resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    elif resume.locked:
        raise HTTPException(status_code=403, detail="Resume is locked")
    else:
        stmt = select(Sample.resume_canva).where(Sample.id == sample_id)
        result = await db.execute(stmt)
        sample_canva = result.scalars().first()
        if sample_canva is None:
            raise HTTPException(status_code=404, detail="Sample not found")
        stmt = (
            update(Resume)
            .where(and_(Resume.id == resume_id, Resume.account_id == account_id))
            .values(
                {
                    "resume_canva": [
                        resume_canva for resume_canva in sample_canva
                    ] if sample_canva else []
                }
            )
            .returning(Resume)
        )
        result = await db.execute(stmt)
        updated_resume = result.scalars().first()
        await db.commit()

        await db.refresh(updated_resume)
        return schema.Resume.from_orm(updated_resume)

async def get_public_resume(
    db: AsyncSession, username: str, slug: str
) -> schema.Resume | None:
    try:
        firstname, lastname = username.split("-")
    except ValueError:
        raise HTTPException(status_code=404, detail="User not found")
    select_query = (
        select(Resume)
        .join(Account)
        .where(
            and_(
                Resume.visibility == "public",
                Account.firstname == firstname,
                Account.lastname == lastname,
                Resume.slug == slug,
            )
        )
    )
    result = await db.execute(select_query)
    dto = result.scalars().first()
    return schema.Resume.model_validate(dto)


async def get_resume_pdf(resume: schema.Resume) -> str:
    # url = await check_privilege(resume.id, resume.account_id)
    # if url:
    #    return url
    # else:
    # stmt = select(Account.unlimited_date).where(
    #    Account.id == resume.account_id)
    # valid_date = await fetch_one(stmt)["unlimited_date"]
    # if valid_date > datetime.now():
    pdf_bytesio = await printer.generatePDFFormat(
        layers=resume.resume_canva, resume_data=resume.resume_data
    )
    # Save file resume to s3
    filepath = f"{resume.account_id}/resumes/{resume.id}.pdf"
    resume_url = service.upload_file(pdf_bytesio, filepath)
    return resume_url
    # else:
    #    raise HTTPException(
    #        status_code=406, detail="EXPRIRED_SUBSCRIPTION")


async def get_resume_preview(resume: schema.Resume) -> str:
    images = await printer.generatePreview(resume.resume_canva)
    # Save file resume to s3
    filepath = f"{resume.account_id}/previews/{resume.id}.jpg"
    preview_url = S3Instance.upload_object(images[0], filepath)
    return preview_url

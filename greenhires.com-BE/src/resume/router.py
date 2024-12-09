import os
import select
from src.constants import DEFAULT_LAYERS
from typing import Literal
from uuid import uuid4
from fastapi_limiter.depends import RateLimiter
from src.ai.parser import AIParser
import aiofiles
from fastapi import APIRouter, Depends, HTTPException
from src.auth import service as auth_service
from src.external_service.redis import RedisInstance
from src.payment.model import Resources
from src.resume import service
from src.sample.schema import ExportType
from src.utils import printer
from src.utils.utils import mapping_resume_data
from src.general import service as general_service
from src.auth.jwt import parse_jwt_account_data
from src.auth.schema import JWTData
from src.resume import schema
from src.schema import Url
from src.resume.dependency import check_export_limit, reduce_pdf_export_limit
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db

router = APIRouter()


@router.post("", response_model=schema.Resume)
async def create_resume(
    data: schema.ResumeCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Resume:
    account_id = jwt_data.account_id
    # await check_reach_limit(db, account_id, data.type)
    account = await auth_service.get_account_by_id(db, account_id)
    # data.resume_data.basics.email = account.email
    # data.resume_data.basics.phone = account.phone
    resume = await service.add_new_resume(db, data, account_id)
    # Delete cached resumes
    await RedisInstance.delete_by_key(f"account:{account_id}:resumes:{data.type}")
    return resume


@router.post(
    "/create-from-linkedin",
    response_model=schema.Resume,
    dependencies=[
        Depends(RateLimiter(times=100, minutes=5)),
        Depends(RateLimiter(times=100, minutes=15)),
    ],
)
async def create_resume_from_linkedin(
    data: schema.ResumeCreateParsing = Depends(schema.ResumeCreateParsing.as_form),
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Resume:
    # await check_reach_limit(db, jwt_data.account_id, data.type)
    extension = data.linkedin_file.filename.split(".")[-1]
    filepath = f"static/{uuid4()}.{extension}"
    async with aiofiles.open(filepath, "wb") as f:
        await f.write(data.linkedin_file.file.read())
    text = AIParser.text_from_pdf(filepath)
    os.remove(filepath)
    parsed_resume = AIParser.parse_resume(text)
    data.resume_data = mapping_resume_data(parsed_resume)
    # Check if resumeio builder
    if data.builder_type == "resumeio":
        data.resume_data.metadata.template = data.template_id
        data.resume_canva = []
    account_id = jwt_data.account_id
    resume = await service.add_new_resume(db, data, account_id)
    # Delete cached resumes
    await RedisInstance.delete_by_key(f"account:{account_id}:resumes:{data.type}")
    return resume


@router.post("/import", response_model=schema.Resume)
async def import_resume(
    data: schema.ResumeImport,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Resume:
    account_id = jwt_data.account_id
    resume = await service.import_resume(db, account_id, data)
    await RedisInstance.delete_by_key(f"account:{account_id}:resumes:{resume.type}")
    return resume


@router.delete("/{resume_id}", response_model=schema.Resume)
async def delete_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Resume:
    # Remove pdf and preview images from storage
    resume_pdf = f"account:${jwt_data.account_id}:storage:resumes:{resume_id}"
    resume_preview = f"account:${jwt_data.account_id}:storage:previews:{resume_id}"
    resume = await service.delete_resume(db, jwt_data.account_id, resume_id)
    cached_resumes = f"account:{jwt_data.account_id}:resumes:{resume.type}"
    general_service.delete_file(resume_pdf)
    general_service.delete_file(resume_preview)
    await asyncio.gather(
        RedisInstance.delete_by_key(resume_pdf),
        RedisInstance.delete_by_key(resume_preview),
        RedisInstance.delete_by_key(cached_resumes),
    )
    return resume.model_dump(exclude={"resume_data", "resume_canva"})


@router.get("/export/{resume_id}", response_model=Url)
async def export_resume(
    resume_id: str,
    format: ExportType = ExportType.PDF,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> Url:
    account_id = jwt_data.account_id
    # Get the resume
    resume = await service.get_resume_by_id(db, account_id, resume_id)

    # Get the user's resources
    await check_export_limit(db, account_id, format)

    # Proceed with generating the resume
    match format:
        case ExportType.PDF:
            resume_url = await service.get_resume_pdf(resume)
            await reduce_pdf_export_limit(db, account_id)

        case ExportType.TXT:
            resume_url = printer.generateTXTFormat(resume)

    await db.commit()

    return Url(url=resume_url)


@router.get("/public/{username}/{slug}", response_model=schema.Resume)
async def view_public_resume(
    username: str,
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> schema.Resume:
    resume = await service.get_public_resume(db, username, slug)
    return resume


@router.get("/preview/{resume_id}", response_model=Url)
async def print_resume_preview(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> Url:
    account_id = jwt_data.account_id
    resume = await service.get_resume_by_id(db, account_id, resume_id)
    resume_url = await RedisInstance.getCachedOrSet(
        key=f"account:{account_id}:storage:previews:{resume_id}",
        callback=lambda: service.get_resume_preview(resume),
        cached_type="string",
    )
    return Url(url=resume_url)


@router.get("/{resume_id}", response_model=schema.Resume)
async def get_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Resume:
    account_id = jwt_data.account_id
    resume = await service.get_resume_by_id(db, account_id, resume_id)
    return resume


@router.get("", response_model=list[schema.Resume])
async def get_all_resumes(
    type: schema.ResumeType,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> list[schema.Resume]:
    account_id = jwt_data.account_id
    resumes = await RedisInstance.getCachedOrSet(
        key=f"account:{account_id}:resumes:{type}",
        callback=lambda: service.get_all_resume_by_account_id(db, account_id, type),
        cached_type="json",
    )
    return resumes


@router.patch("/{resume_id}", response_model=schema.Resume)
async def update_resume(
    resume_id: str,
    data: schema.ResumeUpdate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Resume:
    account_id = jwt_data.account_id
    resume = await service.update_resume(db, account_id, resume_id, data)
    await RedisInstance.delete_by_key(f"account:{account_id}:resumes:{resume.type}")
    return resume.model_dump(exclude={"resume_data"})

@router.patch("/{resume_id}/canva/{sample_id}", response_model=schema.Resume)
async def update_resume_canva(
    resume_id: str,
    sample_id: str,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.Resume:
    account_id = jwt_data.account_id
    resume = await service.update_canva(db, account_id, resume_id, sample_id)
    await RedisInstance.delete_by_key(f"account:{account_id}:resumes:{resume.type}")
    return resume

from fastapi import HTTPException
from src.resume.schema import ResumeType
from src.user import service as user_service
from src.resume import service
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from src.sample.schema import ExportType
from src.user.model import Feature

async def check_reach_limit(
    db: AsyncSession, account_id: str, type: ResumeType
) -> None:
    features = await user_service.get_features(db, account_id)
    num_of_cvs = await service.get_num_of_resumes(db, account_id, type)
    if type == ResumeType.resume:
        if num_of_cvs >= features.num_of_resumes:
            raise HTTPException(
                status_code=409,
                detail="You have reached the limit of resumes, please upgrade your plan",
            )
    elif type == ResumeType.coverletter:
        if num_of_cvs >= features.num_of_coverletters:
            raise HTTPException(
                status_code=409,
                detail="You have reached the limit of cover letters, please upgrade your plan",
            )

async def check_export_limit(
    db: AsyncSession, account_id: str, type: ExportType) -> None:
    features = await user_service.get_features(db, account_id)
    if type == ExportType.PDF:
        if features.num_of_PDF_exports == 0:
            raise HTTPException(
                status_code=409,
                detail=f'You have reached the limit of {type.name} export, please upgrade your plan',
            )

async def reduce_pdf_export_limit(db: AsyncSession, account_id: str):
    stmt = (
        update(Feature)
        .where(Feature.account_id == account_id)
        .values(num_of_PDF_exports=Feature.num_of_PDF_exports - 1)
        .returning(Feature.num_of_PDF_exports)
    )
    return await db.execute(stmt)

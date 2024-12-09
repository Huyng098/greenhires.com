from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from src.job import schema
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.job import service
from src.auth.jwt import JWTData, parse_jwt_account_data, parse_jwt_admin_data
from src.schema import PaginationData

router = APIRouter()


@router.post("/add-job-function", response_model=schema.JobFunction)
async def add_job_function(
    job_function: schema.JobFunctionCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
) -> schema.JobFunction:
    if await service.get_job_function_by_name(db, job_function.name):
        raise HTTPException(status_code=400, detail="Job function already exists")
    return await service.add_job_function(db, job_function)


@router.delete("/delete-job-function/{id}", response_model=schema.JobFunction)
async def delete_job_function(
    id: str,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
) -> schema.JobFunction:
    return await service.delete_job_function(db, id)


@router.post("/add-skill", response_model=schema.Skill)
async def add_skill(
    skill: schema.SkillCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
) -> schema.Skill:
    if await service.get_skill_by_name(db, skill.name):
        raise HTTPException(status_code=400, detail="Skill already exists")
    return await service.add_skill(db, skill)


@router.delete("/delete-skill/{id}", response_model=schema.Skill)
async def delete_skill(
    id: str,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
) -> schema.Skill:
    return await service.delete_skill(db, id)


@router.post("/add-job", response_model=schema.Job)
async def add_job(
    job: schema.JobCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
) -> schema.Job:
    return await service.add_job(db, jwt_data.account_id, job)


@router.get("/get-jobs", response_model=PaginationData[schema.Job])
async def get_jobs(
    limit: int = 10,
    offset: int = 0,
    jwt_data: JWTData = Depends(parse_jwt_account_data),
    db: AsyncSession = Depends(get_db),
) -> PaginationData[schema.Job]:
    jobs, total = await service.get_jobs(db, jwt_data.account_id, limit, offset)
    if not jobs:
        raise HTTPException(status_code=404, detail="No jobs found")
    return PaginationData(items=jobs, total=total)


@router.get("/{id}", response_model=schema.Job)
async def get_job(
    id: str,
    jwt_data: JWTData = Depends(parse_jwt_account_data),
    db: AsyncSession = Depends(get_db),
) -> schema.Job:
    return await service.get_job_by_id(db, id, jwt_data.account_id)


@router.put("/{job_id}", response_model=schema.Job)
async def update_job(
    job_id: str,
    background_tasks: BackgroundTasks,
    job: schema.JobUpdate,
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
    db: AsyncSession = Depends(get_db),
) -> schema.Job:
    updated_job, old_skills = await service.update_job(
        db, jwt_data.account_id, job_id, job
    )
    background_tasks.add_task(service.delete_unused_skills, db, old_skills)
    return updated_job


@router.delete("/{id}", response_model=schema.Job)
async def delete_job(
    id: str,
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
    db: AsyncSession = Depends(get_db),
) -> schema.Job:
    return await service.delete_job(db, id, jwt_data.account_id)

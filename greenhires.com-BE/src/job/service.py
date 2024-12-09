from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.job import schema
from sqlalchemy.orm import joinedload, noload
from src.job.model import JobFunction, Salary, Skill, Job
from sqlalchemy import and_, delete, func, insert, select


async def get_job_function_by_name(
    db: AsyncSession, name: str
) -> schema.JobFunction | None:
    stmt = select(JobFunction.name).where(JobFunction.name == name)
    result = await db.execute(stmt)
    job_function_name = result.scalars().first()
    if job_function_name:
        return schema.JobFunction(name=job_function_name)
    return None


async def get_skill_by_name(db: AsyncSession, name: str) -> schema.Skill | None:
    stmt = select(Skill.name).where(Skill.name == name)
    result = await db.execute(stmt)
    skill_name = result.scalars().first()
    if skill_name:
        return schema.Skill(name=skill_name)
    return None


async def add_job_function(
    db: AsyncSession, job_function: schema.JobFunctionCreate
) -> schema.JobFunction:
    stmt = insert(JobFunction).values(name=job_function.name).returning(JobFunction)
    result = await db.execute(stmt)
    dto = result.scalars().first()
    jobfunc = schema.JobFunction(**dto.__dict__)
    await db.commit()
    return jobfunc


async def delete_job_function(db: AsyncSession, id: str) -> schema.JobFunction:
    stmt = delete(JobFunction).where(JobFunction.id == id).returning(JobFunction)
    result = await db.execute(stmt)
    dto = result.scalars().first()
    if not dto:
        raise HTTPException(status_code=404, detail="Job function not found")
    jobfunc = schema.JobFunction(**dto.__dict__)
    await db.commit()
    return jobfunc


async def add_skill(db: AsyncSession, skill: schema.SkillCreate) -> schema.Skill:
    stmt = insert(Skill).values(name=skill.name).returning(Skill)
    result = await db.execute(stmt)
    dto = result.scalars().first()
    skill = schema.Skill(**dto.__dict__)
    await db.commit()
    return skill


async def delete_skill(db: AsyncSession, id: str) -> schema.Skill:
    stmt = delete(Skill).where(Skill.id == id).returning(Skill)
    result = await db.execute(stmt)
    dto = result.scalars().first()
    if not dto:
        raise HTTPException(status_code=404, detail="Skill not found")
    skill = schema.Skill(**dto.__dict__)
    await db.commit()
    return skill


async def add_job(
    db: AsyncSession,
    account_id: str,
    job: schema.JobCreate,
) -> schema.Job:
    job_db = Job(
        **job.model_dump(
            exclude_none=True,
            exclude={
                "salary",
                "skills",
            },
        ),
        salary=Salary(
            **job.salary.model_dump(exclude_none=True),
        ),
        created_by_id=account_id,
    )
    stmt = select(Skill).where(Skill.name.in_(job.skills))
    existing_skills = await db.execute(stmt)
    existing_skills = existing_skills.scalars().all()
    new_skills = [
        Skill(name=name, created_by_id=account_id)
        for name in (set(job.skills) - {skill.name for skill in existing_skills})
    ]
    job_db.skills = existing_skills + new_skills
    db.add(job_db)
    await db.commit()
    await db.refresh(job_db)
    return schema.Job.model_validate(job_db)


async def delete_unused_skills(db: AsyncSession, old_skills: list[str]) -> None:
    stmt = (
        select(Skill)
        .where(and_(Skill.name.in_(old_skills), Skill.created_by_id is not None))
        .options(joinedload(Skill.jobs))
    )
    result = await db.execute(stmt)
    skills = result.scalars().unique().all()
    for skill in skills:
        if not skill.jobs:
            await db.delete(skill)
    await db.commit()


async def update_job(
    db: AsyncSession,
    account_id: str,
    job_id: str,
    job_data: schema.JobUpdate,
) -> tuple[schema.Job, list[str]]:
    stmt = select(Job).where(and_(Job.id == job_id, Job.created_by_id == account_id))
    result = await db.execute(stmt)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    for key, value in job_data.model_dump(
        exclude_none=True,
        exclude={"skills", "salary"},
    ).items():
        setattr(job, key, value)
    if job_data.salary:
        for key, value in job_data.salary.model_dump(exclude_none=True).items():
            setattr(job.salary, key, value)
    old_skills = {skill.name for skill in job.skills}
    if job_data.skills:
        existing_skills = await db.execute(
            select(Skill).where(Skill.name.in_(job_data.skills))
        )
        existing_skills = existing_skills.scalars().all()
        new_skills = [
            Skill(name=name, created_by_id=account_id)
            for name in (
                set(job_data.skills) - {skill.name for skill in existing_skills}
            )
        ]
        job.skills = existing_skills + new_skills

    await db.commit()
    await db.refresh(job)
    return schema.Job.model_validate(job), old_skills


async def get_jobs(
    db: AsyncSession, account_id: str = None, limit: int = 20, offset: int = 0
) -> tuple[list[schema.Job], int]:
    stmt = (
        select(
            Job,
            func.count(Job.id).over().label("total"),
        )
        .limit(limit)
        .offset(offset)
    )
    if account_id:
        stmt = stmt.where(Job.created_by_id == account_id)
    result = await db.execute(stmt)
    jobs = result.unique().all()
    return [schema.Job.model_validate(job.Job) for job in jobs], jobs[0].total


async def get_job_by_id(
    db: AsyncSession, job_id: str, account_id: str = None
) -> schema.Job:
    stmt = select(Job).where(Job.id == job_id)
    if account_id:
        stmt = stmt.where(Job.created_by_id == account_id)
    result = await db.execute(stmt)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return schema.Job.model_validate(job)


async def delete_job(
    db: AsyncSession, job_id: str, account_id: str = None
) -> schema.Job:
    stmt = (
        delete(Job)
        .where(
            and_(
                Job.id == job_id,
                Job.created_by_id == account_id if account_id else True,
            )
        )
        .options(noload(Job.skills), noload(Job.salary))
        .returning(Job)
    )
    result = await db.execute(stmt)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job_dto = schema.Job.model_validate(job)
    await db.commit()
    return job_dto

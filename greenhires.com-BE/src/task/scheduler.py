from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.pool import ProcessPoolExecutor
from src.config import settings
from pytz import utc
from apscheduler.executors.asyncio import AsyncIOExecutor

jobstores = {
    'default': SQLAlchemyJobStore(url=str(settings.DATABASE_URL))
}
executors = {
    'default': AsyncIOExecutor(),
    'processpool': ProcessPoolExecutor(5)
}
job_defaults = {
    'coalesce': False,
    'max_instances': 3
}
scheduler = AsyncIOScheduler(
    jobstores=jobstores,
    executors=executors,
    job_defaults=job_defaults,
    timezone=utc
)

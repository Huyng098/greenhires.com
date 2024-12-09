from contextlib import asynccontextmanager
import sentry_sdk
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from src.database import check_database_connection, get_db
from src.auth.router import router as auth_router
from src.user.router import router as user_router
from src.resume.router import router as resume_router
from src.general.router import router as general_router
from src.sample.router import router as sample_router
from src.job.router import router as job_router
from src.blog.router import router as blog_router
from src.search.router import router as search_router
from src.ai.router import router as ai_router
from src.payment.router import router as payment_router
from src.notification.router import router as notification_router
from src.config import app_configs, settings
from fastapi_limiter import FastAPILimiter
from fastapi.staticfiles import StaticFiles
from src.search.config import init_index
from src.utils.health_check import http_limit_callback
from src.external_service.redis import RedisInstance
from src.task.scheduler import scheduler
from src.task.tasks import *


@asynccontextmanager
async def lifespan(app: FastAPI):
    # first wait for DB to be connectable
    await check_database_connection()
    await FastAPILimiter.init(RedisInstance.client, http_callback=http_limit_callback)
    await init_index(get_db())
    scheduler.start()
    yield
    await RedisInstance.close()
    await FastAPILimiter.close()
    scheduler.shutdown()


app = FastAPI(**app_configs, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGINS_REGEX,
    allow_credentials=True,
    allow_methods=("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"),
    allow_headers=settings.CORS_HEADERS,
)

if settings.ENVIRONMENT.is_deployed:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
    )


@app.get("/", include_in_schema=False)
async def healthcheck() -> dict[str, str]:
    return {"message": "Welcome to the Humantree API"}

app.mount("/aws", StaticFiles(directory="aws"), name="aws")

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(user_router, prefix="/users", tags=["User"])
app.include_router(resume_router, prefix="/resume", tags=["Resume"])
app.include_router(general_router, prefix="/general", tags=["General"])
app.include_router(sample_router, prefix="/sample", tags=["Sample"])
app.include_router(blog_router, prefix="/blog", tags=["Blog"])
app.include_router(notification_router, prefix="/notification", tags=["Notification"])
app.include_router(ai_router, prefix="/ai", tags=["AI"])
app.include_router(payment_router, prefix="/payment", tags=["Payment"])
app.include_router(search_router, prefix="/search", tags=["Search"])
app.include_router(job_router, prefix="/job", tags=["Job"])


def generate_job_ERD():
    from src.auth.model import Account
    from src.utils.visualize_orm import (
        generate_data_model_diagram,
        add_web_font_and_interactivity,
    )
    from src.job.model import (
        Job,
        JobFunction,
        JobSkill,
        Salary,
        Skill,
        JobApplicant,
        CV,
    )

    models = [Account, Job, JobFunction, JobSkill, Salary, Skill, JobApplicant, CV]
    output_file_name = "job_ERD"
    # Generate the diagram and add interactivity
    generate_data_model_diagram(models, output_file_name)
    add_web_font_and_interactivity("job_ERD.svg", "interactive-job-ERD.svg")


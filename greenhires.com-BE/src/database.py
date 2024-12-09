import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from src.config import settings
from sqlalchemy.sql import text
from sqlalchemy.ext.asyncio import async_sessionmaker
from typing import AsyncGenerator


DATABASE_URL = str(settings.DATABASE_URL).replace("postgresql", "postgresql+asyncpg")

engine = create_async_engine(
    url=DATABASE_URL,
    pool_pre_ping=True,
    pool_size=4,  # Number of connections to keep open in the pool
    max_overflow=4,  # Number of connections that can be opened beyond the pool_size
    pool_recycle=3600,  # Recycle connections after 1 hour
    # Raise an exception after 2 minutes if no connection is available from the pool)
    pool_timeout=120,
)

SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    session = SessionLocal()
    try:
        yield session
    except Exception as se:
        await session.rollback()
        raise se
    finally:
        await session.close()


async def check_database_connection(
    max_attempts: int = 30, sleep_interval: int = 1
) -> None:
    for attempt in range(1, max_attempts + 1):
        try:
            async with engine.begin() as db:
                await db.execute(text("SELECT 1"))
                logging.info(f"Connected to the database on attempt {attempt}.")
                return
        except Exception as e:
            logging.error(
                f"Attempt {attempt}: Database is not yet available. Error: {e}"
            )
            if attempt == max_attempts:
                raise ValueError(
                    f"Couldn't connect to database after {max_attempts} attempts."
                ) from e
            await asyncio.sleep(sleep_interval)

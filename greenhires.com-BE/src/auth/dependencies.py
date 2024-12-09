from fastapi import Depends
from src.auth import service
from src.auth.exceptions import EmailTaken
from src.auth.schema import AccountCreate, AccountCreatedAdmin
from src.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession


async def valid_account_create(
    account: AccountCreate,
    db: AsyncSession = Depends(get_db),
) -> AccountCreate:
    if await service.get_account_by_email(db, account.email):
        raise EmailTaken()
    return account


async def valid_add_account(
    account: AccountCreatedAdmin,
    db: AsyncSession = Depends(get_db),
) -> AccountCreate:
    if await service.get_account_by_email(db, account.email):
        raise EmailTaken()
    return account

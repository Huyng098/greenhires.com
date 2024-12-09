import logging
from src.notification import schema
from typing import Any, AsyncGenerator, Literal
from sqlalchemy import and_, insert, select, update
from src.notification.model import Notification, AccountNotification
from sqlalchemy import func, desc
from src.external_service.redis import RedisInstance
from src.config import settings
import orjson
from src.utils.utils import defaultDumpJson, is_account_recipient
from src.auth.model import Account, AccountRoleEnum
from sqlalchemy.ext.asyncio import AsyncSession


async def create_notification(
    db: AsyncSession, noti: schema.NotificationCreate
) -> None:
    insert_query = (
        insert(Notification)
        .values(
            title=noti.title, key=noti.key, key_id=noti.key_id, content=noti.content
        )
        .returning(Notification)
    )
    result = await db.execute(insert_query)
    notification = result.scalars().first()
    noti_dto = schema.Notification.model_validate(notification)
    stmt = insert(AccountNotification).values(
        [
            {"notification_id": notification.id, "account_id": account_id}
            for account_id in noti.account_ids
        ]
    )
    await db.execute(stmt)
    await db.commit()
    await publish_to_channel(noti=noti_dto.__dict__, account_ids=noti.account_ids)


async def mark_all_notifications_as_read(db: AsyncSession, account_id: int) -> bool:
    try:
        statement = (
            update(AccountNotification)
            .where(AccountNotification.account_id == account_id)
            .values(is_read=True)
        )
        await db.execute(statement)
        return True
    except:
        return False


async def get_notifications(
    db: AsyncSession,
    account_id: str,
    offset: int = 0,
    limit: int = 5,
    status: Literal["read", "unread"] = None,
) -> list[schema.Notification] | None:
    statement = select(
        Notification,
        AccountNotification.is_read,
        func.count(Notification.id).over().label("total"),
    ).join(
        AccountNotification,
        (Notification.id == AccountNotification.notification_id)
        & (AccountNotification.account_id == account_id),
    )
    if status:
        statement = statement.filter(AccountNotification.is_read == (status == "read"))
    statement = (
        statement.offset(offset).limit(limit).order_by(desc(Notification.created_at))
    )
    result = await db.execute(statement)
    dto = result.all()
    return [schema.Notification.model_validate(noti.Notification) for noti in dto], (
        dto[0].total if len(dto) > 0 else 0
    )


async def mark_status_by_id(
    db: AsyncSession, notification_id: str, is_read: bool, account_id: str
) -> str:
    statement = (
        update(AccountNotification)
        .where(
            and_(
                AccountNotification.account_id == account_id,
                AccountNotification.notification_id == notification_id,
            )
        )
        .values(is_read=is_read)
        .returning(AccountNotification.notification_id)
    )
    result = await db.execute(statement)
    notification_id = result.scalars().first()
    return notification_id


async def publish_to_channel(noti: dict[str, Any], account_ids: list[str]) -> None:
    message = {"recipient_ids": account_ids, "notification": noti}
    await RedisInstance.publish(
        settings.PUSH_NOTIFICATION_CHANNEL,
        orjson.dumps(message, default=defaultDumpJson),
    )


async def listen_to_channel(account_id: str) -> AsyncGenerator[dict[str, Any], None]:
    pubsub = await RedisInstance.subscribe(settings.PUSH_NOTIFICATION_CHANNEL)
    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                message_data = orjson.loads(message["data"])
                if is_account_recipient(account_id, message_data):
                    yield {"data": message_data["notification"]}
    finally:
        logging.info("Unsubscribing from channel")
        await pubsub.unsubscribe(settings.PUSH_NOTIFICATION_CHANNEL)


async def get_unread_count(db: AsyncSession, account_id: str) -> int:
    stmt = select(func.count(AccountNotification.id)).where(
        and_(
            AccountNotification.account_id == account_id,
            AccountNotification.is_read == False,
        )
    )
    result = await db.execute(stmt)
    return result.scalars().first()


async def send_notification_to_admin(
    db: AsyncSession,
    title: str,
    content: str,
    key: str,
    key_id: str,
    filtered_admin_id: str = None,
) -> None:
    stmt = (
        select(Account.id)
        .where(Account.role.in_([AccountRoleEnum.admin, AccountRoleEnum.superadmin]))
        .filter(Account.id != filtered_admin_id if filtered_admin_id else True)
    )
    result = await db.execute(stmt)
    ids = result.scalars().all()
    await create_notification(
        db=db,
        noti=schema.NotificationCreate(
            title=title,
            content=content,
            key=key,
            key_id=key_id,
            account_ids=ids,
        ),
    )

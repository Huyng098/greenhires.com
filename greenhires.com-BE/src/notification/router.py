from typing import Literal
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from src.auth.jwt import parse_jwt_account_data
from src.auth.schema import JWTData
from src.schema import PaginationData
from src.notification import schema
from sse_starlette.sse import EventSourceResponse
from src.notification import service
from src.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from src import schema as baseSchema

router = APIRouter()


@router.get("", response_model=PaginationData[schema.Notification])
async def get_notifications_by_status(
    offset: int = 0,
    limit: int = 5,
    status: Literal["read", "unread"] = None,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> PaginationData[schema.Notification]:
    items, total = await service.get_notifications(
        db, jwt_data.account_id, offset, limit, status
    )
    return PaginationData[schema.Notification](items=items, total=total)


@router.put("/mark-all-as-read")
async def mark_all_as_read(
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> baseSchema.Message:
    try:
        await service.mark_all_notifications_as_read(db, jwt_data.account_id)
        return baseSchema.Message(message="All notifications have been marked as read")
    except:
        raise HTTPException(status_code=500, detail="Error when mark as read")


@router.put("/mark-status/{id}")
async def mark_as_read(
    id: str,
    data: schema.NotificationUpdate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.NotificationID:
    notification_id = await service.mark_status_by_id(
        db, id, data.is_read, jwt_data.account_id
    )
    return schema.NotificationID(notification_id=str(notification_id))


@router.get("/notify", response_class=StreamingResponse)
async def notification(jwt_data: JWTData = Depends(parse_jwt_account_data)):
    return EventSourceResponse(service.listen_to_channel(jwt_data.account_id))


@router.get("/unread-counts", response_model=schema.UnreadCount)
async def get_number_of_unread(
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> schema.UnreadCount:
    quantity = await service.get_unread_count(db, jwt_data.account_id)
    return schema.UnreadCount(value=quantity)

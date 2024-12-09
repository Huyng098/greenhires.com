from sqlalchemy import select, and_, update, insert
from typing import Optional
from uuid import UUID
from datetime import datetime, timedelta

from src.payment.model import Coupon, CouponUsage, Subscription
from src.payment.schema import CouponCreate
from sqlalchemy.ext.asyncio import AsyncSession

# Function to get a coupon by its code
async def get_coupon_by_code(db: AsyncSession, coupon_code: str) -> Optional[Coupon]:
    stmt = select(Coupon).where(
        and_(
            Coupon.code == coupon_code,
            Coupon.valid_from <= datetime.now(),
            Coupon.valid_to >= datetime.now(),
        )
    )
    result = await db.execute(stmt)
    coupon = result.scalar_one_or_none()
    return coupon

# Function to check if a coupon has already been used by a user
async def has_used_coupon(db: AsyncSession, account_id: UUID, coupon_id: UUID) -> bool:
    stmt = select(CouponUsage).where(
        and_(
            CouponUsage.account_id == account_id,
            CouponUsage.coupon_id == coupon_id
        )
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none() is not None

# Function to mark a coupon as used by a specific user
async def mark_coupon_as_used(db: AsyncSession, account_id: UUID, coupon_id: UUID):
    print("account_id, coupon_id", account_id, coupon_id)
    stmt = insert(CouponUsage).values(
        account_id=account_id,
        coupon_id=coupon_id,
        used_at=datetime.now()
    )
    await db.execute(stmt)


# Function to create a new coupon (if needed)
async def create_coupon(db: AsyncSession, coupon: CouponCreate) -> Coupon:
    new_coupon = Coupon(
        code=coupon.code,
        valid_from=coupon.valid_from,
        valid_to=coupon.valid_to,
        description=coupon.description,
    )
    db.add(new_coupon)
    await db.commit()
    await db.refresh(new_coupon)
    return new_coupon

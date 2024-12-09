from http.client import HTTPException
import logging
from typing import Any, Optional
from uuid import UUID
from sqlalchemy import and_, insert, select, update
from src.database import get_db
from src.payment.model import Package, PaymentBinding, Subscription
from src.payment import schema
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from src.task.scheduler import scheduler
from src.auth.model import Account
from fastapi import HTTPException, Depends


async def create_subscription(
    db: AsyncSession,
    subscription: schema.SubscriptionCreate,
) -> Subscription:
    stmt = (
        insert(Subscription)
        .values(
            **subscription.model_dump(exclude_unset=True)
        )
        .returning(Subscription)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    subscription = schema.Subscription.model_validate(dto)
    await db.commit()
    return subscription


async def activate_subscription(
    db: AsyncSession, subscription_id: str, binding_payment_id: str = None
) -> None:
    stmt = (
        update(Subscription)
        .where(Subscription.id == subscription_id)
        .values(
            status=schema.SubscriptionStatus.ACTIVE,
            binding_payment_id=binding_payment_id,
        )
    )
    await db.execute(stmt)
    await db.commit()

async def get_subscription_by_account_id(
    db: AsyncSession,
    account_id: str,
) -> Subscription | None:
    stmt = select(Subscription).where(Subscription.account_id == account_id)
    result = await db.execute(stmt)
    subscription = result.scalars().first()
    return subscription

async def get_subscription(
    db: AsyncSession, account_id: str
) -> Optional[schema.Subscription]:
    stmt = (
        select(
            Subscription,
            PaymentBinding.info.label("info"),
            Account.email.label("email"),
            PaymentBinding.method.label("payment_method"),
            Package.name.label("package_name"),
            Package.frequency.label("frequency"),
            Package.USD_price.label("usd_price"),
            Package.VND_price.label("vnd_price"),
        )
        .where(
            and_(
                Subscription.account_id == account_id,
            )
        )
        .join(Account, Subscription.account_id == Account.id)
        .join(Package, Subscription.package_id == Package.id)
        .order_by(Subscription.created_at.desc())
        .limit(1)
    )
    result = await db.execute(stmt)
    row = result.fetchone()

    if not row:
        return None

    # Construct the SubscriptionSchema from the joined data
    subscription = Subscription(
        package_id=row.Subscription.package_id,
        status=row.Subscription.status,
        expired_at=row.Subscription.expired_at,
    )

    return subscription

def reformat_subscription(subscription: schema.Subscription, transactions: list[schema.Transaction]) -> dict[str, Any]:
    if not subscription:
        return {}

    # Create a copy of the subscription as a dictionary
    subscription_dict = subscription.__dict__.copy()
    now = datetime.now(timezone.utc)

    # Define a function to calculate transaction validity period based on its frequency
    def get_validity_period(frequency: str) -> int:
        frequency_mapping = {
            schema.PackageFrequency.DAILY.value: 1,
            schema.PackageFrequency.WEEKLY.value: 7,
            schema.PackageFrequency.MONTHLY.value: 30,
            schema.PackageFrequency.BI_MONTHLY.value: 60,
            schema.PackageFrequency.QUARTERLY.value: 90,
            schema.PackageFrequency.SEMI_ANNUALLY.value: 180,
            schema.PackageFrequency.YEARLY.value: 365,
            schema.PackageFrequency.TRIAL_WEEKLY_MONTHLY.value: 7  # Assuming trial period is weekly
        }
        return frequency_mapping.get(frequency.lower(), 0)

    # Find the most recent active transaction and calculate total duration value
    active_transaction = None
    duration_value = 0

    for txn in transactions:
        if txn.status.lower() == "success" and txn.activated_at:
            validity_days = get_validity_period(txn.package.frequency)
            expiry_date = txn.activated_at + timedelta(days=validity_days)
            if expiry_date > now:
                duration_value += validity_days
                if not active_transaction or txn.activated_at > active_transaction.activated_at:
                    active_transaction = txn

    # Initialize fields to be updated from the active transaction
    updated_fields = {
        "plan_id": subscription_dict.get("plan_id"),
        "payment_method": subscription_dict.get("payment_method"),
        "frequency": subscription_dict.get("frequency"),
        "USD_price": subscription_dict.get("USD_price"),
        "VND_price": subscription_dict.get("VND_price"),
        "package_name": subscription_dict.get("name"),
        "price": None
    }

    # Update fields if an active transaction is found
    if active_transaction and active_transaction.package:
        package = active_transaction.package
        updated_fields.update({
            "plan_id": active_transaction.order_id,
            "payment_method": active_transaction.payment_method,
            "frequency": package.frequency,
            "USD_price": package.USD_price,
            "VND_price": package.VND_price,
            "package_name": package.name,
            "price": {
                "currency": 'VND',
                "amount": package.VND_price,
            }
        })

    # Calculate the number of days remaining until the subscription expires
    expired_at = subscription_dict.get("expired_at")
    days_left = max((expired_at - now).days if expired_at else 0, 0)

    # Calculate duration and days remaining percentage
    duration = {"unit": "day", "value": duration_value}
    print(duration_value)
    days_remaining_percentage = days_left / duration_value if duration_value > 0 else 0

    # Construct response dictionary
    response = {
        "id": subscription_dict.get("id"),
        "account_id": subscription_dict.get("account_id"),
        "created_at": subscription_dict.get("created_at"),
        "updated_at": subscription_dict.get("updated_at"),
        "package_id": subscription_dict.get("package_id"),
        "plan_id": updated_fields["plan_id"],
        "payment_method": updated_fields["payment_method"],
        "frequency": updated_fields["frequency"],
        "USD_price": updated_fields["USD_price"],
        "VND_price": updated_fields["VND_price"],
        "status": subscription_dict.get("status"),
        "nextPaymentDate": expired_at,
        "days_left": days_left,
        "duration": duration,
        "days_remaining_percentage": days_remaining_percentage,
        "info": subscription_dict.get("info"),
        "price": updated_fields["price"],
        "currency": updated_fields["price"]["currency"] if updated_fields["price"] else None,
        "name": updated_fields["package_name"],
        "package_name": updated_fields["package_name"],
    }

    return response


async def update_subscription(
    db: AsyncSession, id: str, sub: schema.SubscriptionUpdate, account_id: str
) -> schema.Subscription | None:
    stmt = (
        update(Subscription)
        .where(and_(Subscription.id == id, Subscription.account_id == account_id))
        .values(sub.model_dump(exclude_none=True))
        .returning(Subscription)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    subscription = schema.Subscription.model_validate(dto)
    # Currently we only handle cancel subscription => cancel schedule job
    if sub.status == schema.SubscriptionStatus.CANCELLED:
        if scheduler.get_job(f"{id}{subscription.nextPaymentDate}"):
            scheduler.remove_job(f"{id}{subscription.nextPaymentDate}")

    return subscription

async def handle_callback_paypal(
        order_id: str,
        binding_func: callable,
        get_package_func: callable,
        payment_func: callable,
        feature_func: callable,
        db: AsyncSession = Depends(get_db)
    ) -> dict:
        async with db.begin():
            try:
                res = await binding_func(
                    db, schema.PaymentMethod.PAYPAL, order_id, schema.TransactionStatus.SUCCESS, activated_at=datetime.now(timezone.utc)
                )
                if not res["valid"]:
                    raise HTTPException(status_code=400, detail="Invalid order id")
                if res["already_updated"]:
                    raise HTTPException(status_code=400, detail="Transaction already updated")
                transaction = res.get("transaction")
                if transaction is None:
                    raise HTTPException(status_code=400, detail="Transaction not found")
                package = await get_package_func(db, package_id=transaction.package_id)
                subscription = await payment_func(db, account_id=transaction.account_id, package=package)
                await feature_func(db, account_id=transaction.account_id)
                # Commit changes
                await db.commit()
                return subscription
            except Exception as e:
                await db.rollback()
                raise e

from datetime import datetime, timedelta, timezone
import logging
from typing import Any, Optional
from uuid import UUID
from fastapi import HTTPException, Request, Depends

from src.payment.model import PaymentBinding, Resources, Subscription, Transaction
from sqlalchemy import and_, select, update
from src.payment.schema import (
    Package,
    PackageFrequency,
    PaymentMethod,
    SubscriptionCreate,
    Subscription as SubscriptionSchema,
    SubscriptionStatus,
    TransactionStatus,
)
from src.payment.service.feature import update_feature_limits
from src.schema import Currency
from src.payment.schema import TransactionCreate
from .package import (
    get_package,
    add_package,
    get_packages,
    get_package_frequency,
    update_package,
)
from .subscription import (
    create_subscription,
    activate_subscription,
    get_subscription_by_account_id,
    handle_callback_paypal,
    update_subscription,
)
from .transaction import (
    create_transaction,
    update_success_transaction,
    get_transactions,
    update_success_transaction_func,
)
from .binding import get_binding_payment, update_binding_payment, check_binding_status
from fastapi import HTTPException, Request, Depends
from src.payment.gateway import ZaloPayGateway
from src.payment.gateway import PayPalGateway
from src.payment.gateway import VnpayGateway
from src.config import settings
from src.auth.service import get_account_by_id
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db


async def register_package(
    db: AsyncSession,
    package_id: str,
    account_id: str,
    payment_method: PaymentMethod,
) -> tuple[Package, SubscriptionSchema | None, str | None]:

    package = await get_package(db, package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    # Create subscription
    if payment_method == PaymentMethod.PAYPAL:
        plan_id = await PayPalGateway.create_plan_subscription(db, package)

    subscription = await get_subscription_by_account_id(db, account_id)
    subscription = await create_subscription(
        db=db,
        subscription=SubscriptionCreate(
            package_id=package.id,
            account_id=account_id,
        ),
    ) if subscription is None else subscription

    return package, subscription, plan_id


async def handle_payment_success(
    db: AsyncSession,
    account_id: UUID,
    orderId: str,
    payment_method: PaymentMethod,
) -> None:
    binding_payment = None
    if payment_method == PaymentMethod.ZALOPAY:
        binding_payment = await get_binding_payment(
            db, account_id, PaymentMethod.ZALOPAY
        )
        subscription_id = await update_success_transaction(
            db, PaymentMethod.ZALOPAY, account_id, orderId
        )
    elif payment_method == PaymentMethod.PAYPAL:
        binding_payment = await update_binding_payment(
            db=db,
            method=PaymentMethod.PAYPAL,
            account_id=account_id,
        )
        subscription_id = await update_success_transaction(
            db=db, method=PaymentMethod.PAYPAL, account_id=account_id, order_id=orderId
        )
    elif payment_method == PaymentMethod.VNPAY:
        transaction_id = await update_success_transaction(
            db=db, method=PaymentMethod.VNPAY, account_id=account_id, order_id=orderId
        )
        # Check if subscription is available or not
        # Add create subscription if subscription not available
        # If not update the status and next payment day
        subscription = await get_subscription_by_account_id(db, account_id)
        subscription_id = await create_subscription(
            db, subscription=SubscriptionCreate(
                package_id,
                account_id,
                plan_id,
                frequency=PackageFrequency.MONTHLY,
                ),
        ) if subscription else subscription.id

    if subscription_id:
        await activate_subscription(
            db, subscription_id, binding_payment.id if binding_payment else None
        )


async def update_success_payment(
    db: AsyncSession,
    account_id: UUID,
    package: Package
) -> Optional[SubscriptionSchema]:
    try:
        # Fetch the subscription by account_id
        subscription = await get_subscription_by_account_id(db, account_id)

        # If a subscription exists, update its details
        if subscription:
            # Determine the starting point for expired_at calculation
            current_utc = datetime.now(timezone.utc)
            if subscription.expired_at and subscription.expired_at > current_utc:
                current_expiry = subscription.expired_at
            else:
                current_expiry = current_utc

            # Calculate the new expired_at date based on the package frequency
            if package.frequency == PackageFrequency.ONE_CV:
                expired_at = current_expiry + timedelta(days=1)
            elif package.frequency == PackageFrequency.REQUEST_CV:
                expired_at = current_expiry + timedelta(days=7)
            elif package.frequency == PackageFrequency.DAILY:
                expired_at = current_expiry + timedelta(days=1)
            elif package.frequency == PackageFrequency.WEEKLY:
                expired_at = current_expiry + timedelta(weeks=1)
            elif package.frequency == PackageFrequency.MONTHLY:
                expired_at = current_expiry + timedelta(days=30)
            elif package.frequency == PackageFrequency.BI_MONTHLY:
                expired_at = current_expiry + timedelta(days=60)
            elif package.frequency == PackageFrequency.QUARTERLY:
                expired_at = current_expiry + timedelta(days=90)
            elif package.frequency == PackageFrequency.SEMI_ANNUALLY:
                expired_at = current_expiry + timedelta(days=180)
            elif package.frequency == PackageFrequency.YEARLY:
                expired_at = current_expiry + timedelta(days=365)
            elif package.frequency == PackageFrequency.TRIAL_WEEKLY_MONTHLY:
                expired_at = current_expiry + timedelta(days=7)

            # Update subscription status and expired_at
            stmt = (
                update(Subscription)
                .where(Subscription.id == subscription.id)
                .values(
                    expired_at=expired_at,
                    status=SubscriptionStatus.ACTIVE,
                )
            )
            await db.execute(stmt)

            # Refresh the updated subscription
            subscription_stmt = select(Subscription).where(Subscription.id == subscription.id)
            result = await db.execute(subscription_stmt)
            updated_subscription = result.scalar_one_or_none()

            # Return the updated subscription as a Pydantic schema
            return SubscriptionSchema.from_orm(updated_subscription) if updated_subscription else None

    except Exception as e:
        logging.error(f"Error in update_success_payment: {str(e)}")
        return None

    return None



async def get_order_by_plan_id(db: AsyncSession, plan_id: str) -> str:
    stmt = (
        select(Subscription.id, Transaction.id)
        .where(Subscription.plan_id == plan_id)
        .join(
            Transaction,
            and_(
                Subscription.id == Transaction.subscription_id,
                Transaction.status == TransactionStatus.PENDING,
                Subscription.status == SubscriptionStatus.PENDING,
            ),
        )
    )
    result = await db.execute(stmt)
    data = result.first()
    if data:
        return data[1]
    raise HTTPException(status_code=404, detail="Order not found")


async def handle_callback(
    request: Request, method: PaymentMethod, db: AsyncSession = Depends(get_db), order_id: Optional[str] = None
):
    try:
        if method == PaymentMethod.ZALOPAY:
            await ZaloPayGateway.handle_callback(
                request, update_binding_payment, handle_payment_success, db
            )
        elif method == PaymentMethod.MOMO:
            pass
        elif method == PaymentMethod.CREDIT_CARD:
            pass
        elif method == PaymentMethod.PAYPAL:
            return await handle_callback_paypal(
                order_id, update_success_transaction_func, get_package, update_success_payment, update_feature_limits, db
            )
        elif method == PaymentMethod.VNPAY:
            return await VnpayGateway.handle_callback(
                request, update_success_transaction_func, get_package, update_success_payment, update_feature_limits ,db
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid payment method")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
        


async def update_resource(db: AsyncSession, account_id: UUID, package: Package, downloads_allowed: int):
    try:
        # Query the user's current resources
        stmt = select(Resources).filter_by(account_id=account_id)
        result = await db.execute(stmt)
        resources = result.scalars().first()

        if resources:
            # Update resources (increment or set based on package limits)
            resources.downloads_left += downloads_allowed if downloads_allowed > 0 else package.downloads_allowed
        else:
            # Create a new resource entry for the account
            resources = Resources(
                account_id=account_id,
                downloads_left=downloads_allowed if downloads_allowed > 0 else 3,
            )

        await db.commit()

    except Exception as e:
        # Handle other exceptions, such as database errors
        raise HTTPException(status_code=500, detail=f"An error occurred while updating resources: {str(e)}")

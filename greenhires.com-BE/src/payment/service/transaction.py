from datetime import datetime
from sqlalchemy import and_, insert, select, update
from src.payment.model import Coupon, Package, Transaction
from uuid import UUID
from src.schema import Currency
from src.utils.utils import generate_random_alphanum
from src.payment import schema
from sqlalchemy.ext.asyncio import AsyncSession


async def create_transaction(
    db: AsyncSession,
    payment_method: schema.PaymentMethod,
    amount: float,
    currency: Currency,
    account_id: str,
    package_id: str,
    subscription_id: str,
    coupon_id: str,
) -> Transaction:
    stmt = (
        insert(Transaction)
        .values(
            amount=amount,
            currency=currency,
            order_id=generate_random_alphanum(16),
            status=schema.TransactionStatus.SUCCESS if amount == 0 else schema.TransactionStatus.PENDING,
            payment_method=payment_method,
            account_id=account_id,
            package_id=package_id,
            subscription_id=subscription_id,
            activated_at=datetime.utcnow() if amount == 0 else None,
            coupon_id=coupon_id,
        )
        .returning(Transaction)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    transaction = schema.Transaction.model_validate(dto)
    await db.commit()
    return transaction

async def update_transaction_order_id(
    db: AsyncSession, order_id: str, transaction_id: str
) -> Transaction | None:
    stmt = (
        update(Transaction)
        .where(Transaction.id == transaction_id)
        .values(order_id=order_id)
        .returning(Transaction)
    )
    result = await db.execute(stmt)
    await db.commit()
    sub = result.scalars().first()
    return sub if sub else None

async def update_success_transaction(
    db: AsyncSession, method: schema.PaymentMethod, account_id: str, order_id: str
) -> Transaction | None:
    stmt = (
        update(Transaction)
        .where(
            and_(
                Transaction.account_id == account_id,
                Transaction.order_id == order_id,
                Transaction.payment_method == method,
            )
        )
        .values(
            status=schema.TransactionStatus.SUCCESS,
        )
        .returning(Transaction)
    )
    result = await db.execute(stmt)
    await db.commit()
    sub = result.scalars().first()
    return sub if sub else None

async def update_success_transaction_func(
    db: AsyncSession,
    method: schema.PaymentMethod,
    order_id: str,
    status: schema.TransactionStatus,
    activated_at: datetime,
) -> dict:
    try:
        # Fetch the transaction with the given order_id and payment method
        stmt = select(Transaction).where(
            Transaction.order_id == order_id,
            Transaction.payment_method == method
        )
        result = await db.execute(stmt)
        transaction = result.scalar_one_or_none()

        # If no transaction is found, return invalid response
        if not transaction:
            return {"valid": False}

        # If transaction status is already updated (not pending), return status
        if transaction.status != schema.TransactionStatus.PENDING:
            return {"valid": True, "already_updated": True, "transaction": transaction}

        # Update transaction status
        update_stmt = (
            update(Transaction)
            .where(Transaction.id == transaction.id)
            .values(status=status, activated_at=activated_at if status == schema.TransactionStatus.SUCCESS else None)
        )
        await db.execute(update_stmt)

        return {"valid": True, "already_updated": False, "transaction": transaction}

    except Exception as e:
        return {"valid": False}


async def get_transactions(
    db: AsyncSession, account_id: str, offset: int = 0, limit: int = 10
) -> list[schema.Transaction] | None:
    stmt = (
        select(Transaction, Package, Coupon)
        .where(
            and_(
                Transaction.account_id == account_id,
                Transaction.status == schema.TransactionStatus.SUCCESS,
            )
        )
        .outerjoin(Transaction, Transaction.package_id == Package.id)
        .outerjoin(Coupon, Transaction.coupon_id == Coupon.id)
        .order_by(Transaction.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    result = await db.execute(stmt)
    rows = result.fetchall()
    transactions = []
    for transaction, package, coupon in rows:
        trans_data = schema.Transaction.model_validate(transaction)
        trans_data.package_name = package.name
        trans_data.package = schema.Package.model_validate(package)
        if transaction.coupon_id:
            trans_data.coupon_code = coupon.code
        transactions.append(trans_data)

    return transactions

async def get_account_id_by_order_id(
    db: AsyncSession, order_id: str, payment_method: schema.PaymentMethod
) -> tuple[UUID, schema.TransactionStatus]:
    """Get account ID by order ID and payment method."""
    query = select(Transaction).where(
        and_(
            Transaction.order_id == order_id,
            Transaction.payment_method == payment_method,
        )
    )
    result = await db.execute(query)
    transaction = result.scalars().first()
    if not transaction:
        return None, None
    return transaction.account_id, transaction.status

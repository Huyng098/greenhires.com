from typing import Any

from fastapi import HTTPException
from src.payment.model import PaymentBinding
from sqlalchemy import and_, select, insert, update
from src.payment import schema
from src.utils.utils import generate_otp_secret
from src.payment.gateway import ZaloPayGateway
from sqlalchemy.ext.asyncio import AsyncSession


async def get_binding_payment(
    db: AsyncSession, account_id: str, method: schema.PaymentMethod
) -> schema.PaymentBinding | None:
    stmt = select(PaymentBinding).where(
        and_(PaymentBinding.account_id == account_id, PaymentBinding.method == method)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    return schema.PaymentBinding.model_validate(dto) if dto else None


async def update_binding_payment(
    db: AsyncSession,
    method: schema.PaymentMethod,
    account_id: str,
    status: Any = None,
    pay_token: str = None,
    info: dict[str, Any] = None,
) -> schema.PaymentBinding:
    if method == schema.PaymentMethod.ZALOPAY:
        if status == 1:  # Success
            stmt = (
                insert(PaymentBinding)
                .values(
                    method=method,
                    account_id=account_id,
                    is_binding=True,
                    is_active=True,
                    binding_token=pay_token,
                    info=info,
                )
                .returning(PaymentBinding)
            )
        elif status == 3:  # cancel
            stmt = (
                update(PaymentBinding)
                .where(
                    and_(
                        PaymentBinding.account_id == account_id,
                        PaymentBinding.method == method,
                    )
                )
                .values(
                    is_binding=False, is_active=False, binding_token=None, info=None
                )
                .returning(PaymentBinding)
            )
        elif status == 4:  # disable
            stmt = (
                update(PaymentBinding)
                .where(
                    and_(
                        PaymentBinding.account_id == account_id,
                        PaymentBinding.method == method,
                    )
                )
                .values(is_binding=False, is_active=False)
                .returning(PaymentBinding)
            )

    elif method == schema.PaymentMethod.PAYPAL:
        stmt = (
            insert(PaymentBinding)
            .values(
                method=method,
                account_id=account_id,
                is_binding=True,
                is_active=True,
                binding_token=pay_token,
                info=info,
            )
            .returning(PaymentBinding)
        )
    elif method == schema.PaymentMethod.VNPAY:
        if status == '00':  # Success
            stmt = (
                insert(PaymentBinding)
                .values(
                    method=method,
                    account_id=account_id,
                    is_binding=True,
                    is_active=True,
                    binding_token=pay_token,
                    info=info,
                )
                .returning(PaymentBinding)
            )
        else:
            stmt = (
                update(PaymentBinding)
                .where(
                    and_(
                        PaymentBinding.account_id == account_id,
                        PaymentBinding.method == method,
                    )
                )
                .values(
                    is_binding=False, is_active=False, binding_token=None, info=None
                )
                .returning(PaymentBinding)
            )
        result = await db.execute(stmt)
        dto = result.scalars().first()
        if not dto:
            raise HTTPException(status_code=404, detail="Payment binding not found!")
        payment_binding = schema.PaymentBinding.model_validate(dto)
        await db.commit()
        return payment_binding
    result = await db.execute(stmt)
    dto = result.scalars().first()
    if not dto:
        raise HTTPException(status_code=404, detail="Payment binding not found!")
    payment_binding = schema.PaymentBinding.model_validate(dto)
    await db.commit()
    return payment_binding


async def check_binding_status(
    db: AsyncSession, account_id: str, payment_method: schema.PaymentMethod
) -> schema.BindingLink | None:
    stmt = select(PaymentBinding).where(
        and_(
            PaymentBinding.account_id == account_id,
            PaymentBinding.method == payment_method,
        )
    )
    result = await db.execute(stmt)
    payment_binding = result.scalars().first()
    if payment_method == schema.PaymentMethod.ZALOPAY:
        if (
            payment_binding is None
            or not payment_binding.is_binding
            or payment_binding.binding_token is None
            or not payment_binding.is_active
        ):
            bindingId = generate_otp_secret(8)
            binding_link = ZaloPayGateway.process_binding(account_id, bindingId=bindingId)
            return schema.BindingLink(binding_link=binding_link, is_binding=False)
        else:
            return schema.BindingLink(
                binding_link=None, is_binding=payment_binding.is_binding
            )
    else:
        raise HTTPException(status_code=400, detail=f"{payment_method.name} not supported getting binding status")

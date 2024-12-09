from typing import Any, Optional
from uuid import UUID
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from src.auth.jwt import parse_jwt_account_data, parse_jwt_admin_data, parse_jwt_superadmin_data
from src.auth.schema import JWTData
from src.payment import service
from src.config import settings
from src.payment.model import PaymentMethod
from src.payment.schema import (
    BindingLink,
    CaptureOrderRequest,
    CouponCreate,
    CouponSchema,
    Order,
    Package,
    PackageCreate,
    PackageFrequency,
    PackageUpdate,
    Price,
    RedirectURL,
    RegisterPackage,
    SubscriptionCreate,
    SubscriptionStatus,
    Transaction,
)
from src.payment.schema import TransactionCreate, Subscription, SubscriptionUpdate
from src.payment.service.coupon import create_coupon, get_coupon_by_code, has_used_coupon, mark_coupon_as_used
from src.payment.service.feature import update_feature_limits
from src.payment.service.package import get_package
from src.payment.service.subscription import create_subscription, get_subscription_by_account_id, get_subscription, reformat_subscription
from src.payment.service.transaction import update_transaction_order_id
from src.schema import Currency, Message, PaginationData
from src.utils.email import send_email
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.payment.gateway.paypal import PayPalGateway 
from src.payment.gateway.vnpay import VnpayGateway 
from src.payment.gateway.paypal import PayPalGateway
from src.payment.gateway.zalopay import ZaloPayGateway
from src.payment.service import (
    create_transaction,
    get_binding_payment,
    handle_payment_success,
    update_resource,
    update_success_payment,
)

router = APIRouter()


@router.post("", response_model=RedirectURL)
async def register_package(
    trans: TransactionCreate,
    coupon_code: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> RedirectURL:
    # Check if the account already has a subscription
    subscription = await get_subscription_by_account_id(db, jwt_data.account_id)

    # Retrieve the package information
    package = await get_package(db, trans.package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")

    # Create a subscription if none exists for the account
    if not subscription:
        subscription = await create_subscription(
            db=db,
            subscription=SubscriptionCreate(
                package_id=package.id,
                account_id=jwt_data.account_id,
            ),
        )

    # Handle coupon code if provided
    if coupon_code:
        coupon = await get_coupon_by_code(db, coupon_code)
        if not coupon or not coupon.is_active:
            raise HTTPException(status_code=400, detail="Invalid or inactive coupon code")

        # Check if the user has already used this coupon code
        if await has_used_coupon(db, jwt_data.account_id, coupon.id):
            raise HTTPException(status_code=400, detail="You have already used this coupon code")

        # Set the transaction amount to zero since the coupon is valid
        amount = 0
        currency = Currency.VND
    else:
        # Use the regular package price if no coupon code is provided
        amount = package.VND_price
        currency = Currency.VND


    # Create a new transaction for the payment
    transaction = await create_transaction(
        db=db,
        payment_method=trans.payment_method if amount > 0 else PaymentMethod.COUPON,
        amount=amount,
        currency=currency,
        account_id=jwt_data.account_id,
        package_id=package.id,
        subscription_id=subscription.id if subscription else None,
        coupon_id=coupon.id if coupon_code else None,
    )

    # If the coupon was used, directly activate the subscription
    if amount == 0:
        try:
            await update_success_payment(db=db, account_id=jwt_data.account_id, package=package)
            await update_feature_limits(db=db, account_id=jwt_data.account_id, is_coupon_used=True)
            # await mark_coupon_as_used(db=db, account_id=jwt_data.account_id, coupon_id=coupon.id)
            await db.commit()

            return RedirectURL(redirect_url="/dashboard/billing")
        
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))


    # Handle payment processing if payment is needed
    if trans.payment_method == PaymentMethod.PAYPAL:
        # Process with PayPal
        paypal_gateway = PayPalGateway()
        response = await paypal_gateway.one_time_checkout(
            package=package
        )
        redirect_url = response["redirect_url"]
        order_id = response["order_id"]
        await update_transaction_order_id(db=db, order_id=order_id, transaction_id=transaction.id)
        return RedirectURL(redirect_url=redirect_url)

    elif trans.payment_method == PaymentMethod.VNPAY:
        # Process with VNPay
        vnpay_gateway = VnpayGateway()
        redirect_url = await vnpay_gateway.create_standard_payment(
            order_id=transaction.order_id,
            package=package
        )
        return RedirectURL(redirect_url=redirect_url)

    else:
        raise HTTPException(status_code=400, detail=f"{trans.payment_method.name} not supported yet")


@router.post("/package", response_model=Package)
async def add_package(
    package: PackageCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_superadmin_data),
) -> Package:
    return await service.add_package(db, package)


@router.get("/packages", response_model=list[Package])
async def get_packages(
    db: AsyncSession = Depends(get_db),
) -> list[Package]:
    return await service.get_packages(db)


@router.put("/{package_id}", response_model=Price)
async def update_package(
    package_id: str,
    package: PackageUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_superadmin_data),
) -> Price:
    package_dto = await service.update_package(db, package_id, package)
    if package_dto.isAutoRenew:
        all_subs = await service.get_subscription_by_account_id(db)
        for sub in all_subs:
            if sub["package_id"] == package_id:
                # Notify user about price change through email
                background_tasks.add_task(
                    send_email,
                    sub["email"],
                    """
                    <h1>Price change notification</h1>
                    <p>Dear user,</p>
                    <p>We would like to inform you that the price of the package you are currently using has changed.</p>""",
                )


@router.get("/package", response_model=Package)
async def get_package_by_frequency(
    frequency: PackageFrequency,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> Package:
    package = await service.get_package_frequency(db, frequency)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return package


@router.get("/current-subscription")
async def get_current_subscription(
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> dict[str, Any]:
    # Fetch the subscription for the account
    subscription = await get_subscription_by_account_id(db, jwt_data.account_id)
    if not subscription or subscription.status != SubscriptionStatus.ACTIVE:
        raise HTTPException(status_code=404, detail="Active subscription not found")

    current_subscription = Subscription.from_orm(subscription)
    transactions = await service.get_transactions(db, jwt_data.account_id)
    return reformat_subscription(current_subscription, transactions)


@router.put("/update-subscription/{id}")
async def update_subscription(
    id: str,
    sub: SubscriptionUpdate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> Subscription:
    if (
        jwt_data.role not in ["superadmin", "admin"]
        and sub.status
        and sub.status != "cancelled"
    ):
        raise HTTPException(status_code=403, detail="Permission denied")
    sub = await service.update_subscription(db, id, sub, jwt_data.account_id)
    return sub


@router.get("/billing-history", response_model=PaginationData[Transaction])
async def get_billing_history(
    offset: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> PaginationData[Transaction]:
    trans = await service.get_transactions(db, jwt_data.account_id, offset, limit)
    if not trans:
        return PaginationData(items=[], total=0)
    return PaginationData(items=trans, total=len(trans))


@router.get("/check-binding")
async def check_binding(
    payment_method: PaymentMethod,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> BindingLink:
    return await service.check_binding_status(db, jwt_data.account_id, payment_method)


@router.post("/zalopay/callback")
async def zalopay_callback(request: Request, db: AsyncSession = Depends(get_db)):
    await service.handle_callback(request, PaymentMethod.ZALOPAY, db)


@router.post("/paypal/callback")
async def paypal_callback(request: Request, db: AsyncSession = Depends(get_db)):
    await service.handle_callback(request, PaymentMethod.PAYPAL, db)


@router.post("/paypal-order", response_model=Order)
async def create_paypal_order(
    package: RegisterPackage,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> Order:
    """Creates a PayPal order for the given package"""
    # Check if the account already has a subscription
    subscription = await get_subscription_by_account_id(db, jwt_data.account_id)

    # Retrieve the package information
    package = await get_package(db, package.package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")

    # Create a subscription if none exists for the account
    if not subscription:
        subscription = await create_subscription(
            db=db,
            subscription=SubscriptionCreate(
                package_id=package.id,
                account_id=jwt_data.account_id,
            ),
        )

    if not package:
        raise HTTPException(status_code=404, detail="Package not found")

    # Create a PayPal order
    paypal_gateway = PayPalGateway()
    order = await paypal_gateway.create_order(package)

    # Create transaction in the database
    transaction = await create_transaction(
        db=db,
        payment_method=PaymentMethod.PAYPAL,
        amount=package.USD_price,
        currency=Currency.USD,
        account_id=jwt_data.account_id,
        package_id=package.id,
        subscription_id=None,
        coupon_id=None
    )

    # Update the transaction with the PayPal order ID
    await update_transaction_order_id(db, order["order_id"], transaction_id=transaction.id)

    # Return the order ID and redirect URL for approval
    return Order(orderId=order["order_id"], redirect_url=order["redirect_url"])

@router.post("/paypal-order/{order_id}/capture", response_model=Message)
async def capture_paypal_order(
    order_id:str,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Message:
    try:
        status = await PayPalGateway.capture_order(order_id)
        if status != "COMPLETED":
            raise HTTPException(status_code=500, detail="Failed to pay with PayPal")

        # Pass the request object to handle_callback with the appropriate payment method
        subscription = await service.handle_callback(request, PaymentMethod.PAYPAL, db, order_id)
        return Message(message="Payment successful")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PayPal capture failed: {str(e)}")

@router.get('/vnpay/callback')
async def vnpay_callback(request: Request,db: AsyncSession = Depends(get_db)):
    return await service.handle_callback(request, PaymentMethod.VNPAY, db=db)


@router.post("/coupon")
async def create_new_coupon(
    coupon: CouponCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
) -> CouponSchema:
    # Create a new coupon
    new_coupon = await create_coupon(db, coupon)
    return CouponSchema.from_orm(new_coupon)

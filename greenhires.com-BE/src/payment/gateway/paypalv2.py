import logging
from fastapi import HTTPException
from src.payment.schema import Package, PackageFrequency
from src.utils.payment import package_to_paypal_plan
from src.payment import service
from sqlalchemy.ext.asyncio import AsyncSession
from src.config import settings
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment
from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest
from paypalcheckoutsdk.products import ProductsCreateRequest
from paypalcheckoutsdk.subscriptions import SubscriptionsCreateRequest, PlansCreateRequest

# Configure PayPal SDK Client
environment = SandboxEnvironment(client_id=settings.PAYPAL_CLIENT_ID, client_secret=settings.PAYPAL_CLIENT_SECRET)
paypal_client = PayPalHttpClient(environment)

class PayPalGateway:
    @staticmethod
    async def create_product(package: Package) -> str:
        request = ProductsCreateRequest()
        request.request_body({
            "name": package.name,
            "description": " ,".join(package.description),
            "type": "SERVICE",
            "category": "SOFTWARE"
        })

        try:
            response = paypal_client.execute(request)
            if response.status_code != 201:
                logging.error(response.result)
                raise HTTPException(status_code=500, detail="Failed to create PayPal product")
            return response.result.idx
        except Exception as error:
            logging.error(f"Failed to create PayPal product: {error}")
            raise HTTPException(status_code=500, detail="Failed to create PayPal product")

    @staticmethod
    async def create_plan_subscription(db: AsyncSession, package: Package) -> str:
        if package.frequency == PackageFrequency.TRIAL_WEEKLY_MONTHLY:
            trial_price = package.USD_price
            monthly_package = await service.get_package_frequency(db, PackageFrequency.MONTHLY)
            fixed_price = monthly_package.USD_price
        else:
            trial_price = fixed_price = package.USD_price
        
        billing_cycles = package_to_paypal_plan(package.frequency, trial_price, fixed_price)

        plan_payload = {
            "product_id": package.paypal_product_id,
            "name": package.name,
            "description": " ,".join(package.description),
            "billing_cycles": billing_cycles,
            "payment_preferences": {
                "auto_bill_outstanding": True,
                "payment_failure_threshold": 3,
            }
        }

        plan_request = PlansCreateRequest()
        plan_request.request_body(plan_payload)

        try:
            response = paypal_client.execute(plan_request)
            plan_id = response.result.id

            subscription_payload = {
                "plan_id": plan_id
            }
            subscription_request = SubscriptionsCreateRequest()
            subscription_request.request_body(subscription_payload)

            response = paypal_client.execute(subscription_request)
            return response.result.id
        except Exception as error:
            logging.error(f"Failed to create PayPal plan or subscription: {error}")
            raise HTTPException(status_code=500, detail="Failed to create PayPal plan or subscription")

    @staticmethod
    def create_order(package: Package) -> str:
        request = OrdersCreateRequest()
        request.prefer("return=representation")
        request.request_body({
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": package.USD_price,
                    }
                }
            ]
        })

        try:
            response = paypal_client.execute(request)
            if response.status_code != 201:
                logging.error(response.result)
                raise HTTPException(status_code=500, detail="Failed to create PayPal order")
            return response.result.id
        except Exception as error:
            logging.error(f"Failed to create PayPal order: {error}")
            raise HTTPException(status_code=500, detail="Failed to create PayPal order")

    @staticmethod
    def capture_order(order_id: str) -> str:
        request = OrdersCaptureRequest(order_id)

        try:
            response = paypal_client.execute(request)
            if response.status_code != 201:
                logging.error(response.result)
                raise HTTPException(status_code=500, detail="Failed to capture PayPal order")
            return response.result.status
        except Exception as error:
            logging.error(f"Failed to capture PayPal order: {error}")
            raise HTTPException(status_code=500, detail="Failed to capture PayPal order")

paypal_gateway = PayPalGateway()

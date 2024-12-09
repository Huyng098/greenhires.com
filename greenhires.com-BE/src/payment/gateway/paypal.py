import logging
import base64
import httpx
from fastapi import HTTPException
from src.config import settings
from src.payment.schema import Package

# Define the headers used for PayPal requests
BASE_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Prefer": "return=representation",
}

class PayPalGateway:
    @staticmethod
    async def generate_access_token() -> str:
        """Generates an access token for PayPal API requests"""
        try:
            auth = base64.b64encode(
                f"{settings.PAYPAL_CLIENT_ID}:{settings.PAYPAL_CLIENT_SECRET}".encode()
            ).decode()
            headers = {
                "Authorization": f"Basic {auth}",
                "Content-Type": "application/x-www-form-urlencoded"
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.PAYPAL_ENDPOINT_URL}/v1/oauth2/token",
                    data="grant_type=client_credentials",
                    headers=headers,
                )

            if response.status_code != 200:
                logging.error(f"Failed to generate Access Token: {response.json()}")
                raise HTTPException(status_code=500, detail="Failed to generate PayPal access token")

            data = response.json()
            return data["access_token"]
        except Exception as error:
            logging.error(f"Failed to generate Access Token: {error}")
            raise HTTPException(status_code=500, detail="Failed to generate PayPal access token")

    @staticmethod
    async def create_order(package: Package) -> dict:
        """Creates a PayPal order"""
        payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": package.USD_price,
                    }
                }
            ],
            "application_context": {
                "return_url": "http://localhost:8000/execute-payment",
                "cancel_url": "http://localhost:8000/cancel-payment",
                "brand_name": "My Store",
                "landing_page": "BILLING",
                "user_action": "PAY_NOW"
            }
        }
        try:
            access_token = await PayPalGateway.generate_access_token()
            headers = {**BASE_HEADERS, "Authorization": f"Bearer {access_token}"}

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.PAYPAL_ENDPOINT_URL}/v2/checkout/orders",
                    headers=headers,
                    json=payload,
                )
            if response.status_code != 201:
                logging.error(f"Failed to create PayPal order: {response.json()}")
                raise HTTPException(status_code=500, detail="Failed to create PayPal order")

            data = response.json()
            # Extract the approval URL to redirect the user to PayPal for payment
            approval_url = next(link['href'] for link in data['links'] if link['rel'] == 'approve')

            return {"order_id": data["id"], "redirect_url": approval_url}
        except Exception as error:
            logging.error(f"Failed to create PayPal order: {error}")
            raise HTTPException(status_code=500, detail="Failed to create PayPal order")

    @staticmethod
    async def capture_order(order_id: str) -> str:
        """Captures an existing PayPal order"""
        try:
            access_token = await PayPalGateway.generate_access_token()
            headers = {**BASE_HEADERS, "Authorization": f"Bearer {access_token}"}

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.PAYPAL_ENDPOINT_URL}/v2/checkout/orders/{order_id}/capture",
                    headers=headers,
                )

            if response.status_code != 201:
                logging.error(f"Failed to capture PayPal order: {response.json()}")
                # raise HTTPException(status_code=500, detail="Failed to capture PayPal order")

            return response.json()["status"]
        except Exception as error:
            logging.error(f"Failed to capture PayPal order: {error}")
            raise HTTPException(status_code=500, detail="Failed to capture PayPal order")

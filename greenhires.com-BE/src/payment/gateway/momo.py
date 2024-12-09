from typing import Any
from src.schema import Currency
from src.config import settings
import requests
import hmac
import hashlib


class MomoGateway:
    def process_payment(
        self,
        requestId: str = None,
        userId: str = None,
        *,
        orderId: str,
        package: dict[str, Any],
    ) -> str:
        # Must convert to VND
        if package["currency"] != Currency.VND:
            raise ValueError("Momo only supports VND currency")
        payload = {
            "partnerCode": settings.MOMO_PARTNER_CODE,
            "requestId": str(requestId),
            "amount": int(package["amount"]),
            "orderId": orderId,
            "orderInfo": f"Pay for greenhires package",
            "ipnUrl": settings.MOMO_CALLBACK_URL,
            "redirectUrl": f"{settings.PUBLIC_CLIENT_URL}/payment/success",
            "partnerClientId": orderId,
            "requestType": "linkWallet",
            "subscriptionInfo": {
                "partnerSubsId": str(package["id"]),
                "name": package["name"],
                "subsOwner": str(userId),
                "type": "VARIABLE",
                "recurringAmount": int(package["price"]),
                "frequency": package["frequency"].value.upper(),
            },
            "lang": "vi",
            "extraData": "",
        }
        sorted_payload = f"accessKey={settings.MOMO_ACCESS_KEY}&" + "&".join(
            [
                f"{key}={payload[key]}"
                for key in [
                    "amount",
                    "extraData",
                    "ipnUrl",
                    "orderId",
                    "orderInfo",
                    "partnerClientId",
                    "partnerCode",
                    "redirectUrl",
                    "requestId",
                    "requestType",
                ]
            ]
        )
        payload["signature"] = hmac.new(
            settings.MOMO_SECRET_KEY.encode(), sorted_payload.encode(), hashlib.sha256
        ).hexdigest()

        response = requests.post(
            f"{settings.MOMO_ENDPOINT_URL}/v2/gateway/api/create", json=payload
        )
        return response.json()["payUrl"]


momo_gateway = MomoGateway()

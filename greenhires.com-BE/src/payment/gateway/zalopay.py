from datetime import datetime
import hashlib
import hmac
from fastapi import HTTPException, Request
import orjson
from src.config import settings
import requests
from time import time
import json
from src.utils.utils import generate_payload
from src.payment.schema import PaymentMethod
from src.external_service.redis import RedisInstance
from sqlalchemy.ext.asyncio import AsyncSession


class ZaloPayGateway:
    @staticmethod
    def process_binding(userId: str = None, *, bindingId: str) -> str:
        payload = {
            "app_id": int(settings.ZALOPAY_APP_ID),
            "app_trans_id": "{:%y%m%d}_{}".format(datetime.today(), bindingId),
            "req_date": int(round(time()) * 1000),
            "binding_type": "WALLET",
            "callback_url": settings.ZALOPAY_CALLBACK_URL,
            "redirect_url": f"{settings.PUBLIC_CLIENT_URL}/pricing-plans",
            "identifier": str(userId),
            "max_amount": 5000000,
            "binding_data": json.dumps({}),
        }
        payload = generate_payload(
            settings.ZALOPAY_KEY_1,
            payload,
            [
                "app_id",
                "app_trans_id",
                "binding_data",
                "binding_type",
                "identifier",
                "max_amount",
                "req_date",
            ],
        )
        response = requests.post(
            url=f"{settings.ZALOPAY_ENDPOINT_URL}/v2/agreement/bind", json=payload
        )

        if response.status_code != 200:
            raise ValueError("Failed to create ZaloPay payment")

        json_response = response.json()
        if json_response["return_code"] != 1:
            raise ValueError(json_response["return_message"])

        return json_response["binding_qr_link"]

    @staticmethod
    async def process_payment(
        userId: str, *, orderId: str, amount: float, binding_token: str
    ) -> str:

        is_enough = ZaloPayGateway.is_enough_balance(userId, amount, binding_token)
        if not is_enough:
            raise HTTPException(
                status_code=400, detail="Zalopay is not enough money to pay"
            )
        else:  # Create order to zalopay
            order = ZaloPayGateway.create_order(userId, orderId, amount)
            if order["return_code"] != 1:
                raise HTTPException(
                    status_code=500, detail="Failed to payment with zalopay"
                )
            else:
                payload = {
                    "app_id": int(settings.ZALOPAY_APP_ID),
                    "identifier": str(userId),
                    "zp_trans_token": order["zp_trans_token"],
                    "pay_token": binding_token,
                    "req_date": int(round(time()) * 1000),
                }
                payload = generate_payload(
                    settings.ZALOPAY_KEY_1,
                    payload,
                    ["app_id", "identifier", "zp_trans_token", "pay_token", "req_date"],
                )
                response = requests.post(
                    url=f"{settings.ZALOPAY_ENDPOINT_URL}/v2/agreement/pay",
                    json=payload,
                )
                response_data = response.json()
                if response_data["return_code"] == 1:
                    channel = f"account:${userId}:zalopay-callback:orderId:{orderId}"
                    # Listen to callback from zalopay from redis pubsub
                    pubsub = await RedisInstance.subscribe(channel)
                    try:
                        async for message in pubsub.listen():
                            if message is not None and message["type"] == "message":
                                data = orjson.loads(message["data"])
                                if data["status"] == "success":
                                    return (
                                        f"{settings.PUBLIC_CLIENT_URL}/payment-success"
                                    )
                                else:
                                    raise HTTPException(
                                        status_code=500,
                                        detail="Failed to payment with zalopay",
                                    )
                    finally:
                        await pubsub.unsubscribe(channel)
                elif response_data["return_code"] == 3:
                    return f"{settings.PUBLIC_CLIENT_URL}/payment-success"
                else:
                    raise HTTPException(
                        status_code=500, detail="Failed to payment with zalopay"
                    )

    @staticmethod
    def create_order(userId: str, orderId: str, amount: float) -> dict[str, str]:
        order = {
            "app_id": int(settings.ZALOPAY_APP_ID),
            "app_trans_id": "{:%y%m%d}_{}".format(datetime.today(), orderId),
            "app_user": str(userId),
            "app_time": int(round(time() * 1000)),
            "embed_data": json.dumps(
                {
                    "redirecturl": f"{settings.PUBLIC_CLIENT_URL}/payment-success",
                }
            ),
            "item": json.dumps([{}]),
            "amount": int(amount),
            "description": "Humantree - Payment for the order #" + str(orderId),
            "bank_code": "zalopayapp",
            "callback_url": settings.ZALOPAY_CALLBACK_URL,
        }
        order = generate_payload(
            settings.ZALOPAY_KEY_1,
            order,
            [
                "app_id",
                "app_trans_id",
                "app_user",
                "amount",
                "app_time",
                "embed_data",
                "item",
            ],
        )
        response = requests.post(
            url=f"{settings.ZALOPAY_ENDPOINT_URL}/v2/create", json=order
        )
        data = response.json()
        return data

    @staticmethod
    def is_enough_balance(userId: str, amount: float, bingding_token: str) -> bool:
        payload = {
            "app_id": int(settings.ZALOPAY_APP_ID),
            "identifier": str(userId),
            "pay_token": bingding_token,
            "req_date": int(time() * 1000),
            "amount": int(amount),
        }
        payload = generate_payload(
            settings.ZALOPAY_KEY_1,
            payload,
            ["app_id", "pay_token", "identifier", "amount", "req_date"],
        )
        response = requests.post(
            url=f"{settings.ZALOPAY_ENDPOINT_URL}/v2/agreement/balance", json=payload
        )
        data = response.json()
        if data["return_code"] == 1 and data["data"][0]["payable"]:
            return True
        return False

    @staticmethod
    def get_info(pay_token: str) -> str:
        payload = {
            "app_id": int(settings.ZALOPAY_APP_ID),
            "access_token": pay_token,
            "req_date": int(time() * 1000),
        }
        payload = generate_payload(
            settings.ZALOPAY_KEY_1, payload, ["app_id", "access_token", "req_date"]
        )
        response = requests.post(
            url=f"{settings.ZALOPAY_ENDPOINT_URL}/v2/agreement/query_user", json=payload
        )
        data = response.json()
        if data["return_code"] != 1:
            raise HTTPException(
                status_code=500, detail="Failed to get user info from zalopay"
            )

        phone = "".join(char for char in data["phone"] if char.isdigit())
        return phone

    @staticmethod
    async def handle_callback(
        request: Request,
        binding_func: callable,
        payment_func: callable,
        db: AsyncSession,
    ) -> None:
        try:
            result = {}
            try:
                json_data = await request.json()
                cb_data: str = json_data["data"]
                # Check if callback from zalo pay is valid
                mac = hmac.new(
                    settings.ZALOPAY_KEY_2.encode(), cb_data.encode(), hashlib.sha256
                ).hexdigest()
                if mac != json_data["mac"]:
                    result["return_code"] = -1
                    result["return_message"] = "mac not equal"
                else:
                    result["return_code"] = 1
                    result["return_message"] = "success"
                    cb_data = json.loads(cb_data)
                    # Check if callback is for binding
                    if json_data["type"] == 2:
                        # Handle binding payment
                        pay_token = cb_data["pay_token"]
                        account_id = cb_data["merchant_user_id"]
                        status = cb_data["status"]
                        last4_phone = ZaloPayGateway.get_info(pay_token)
                        await binding_func(
                            PaymentMethod.ZALOPAY,
                            account_id,
                            status,
                            pay_token,
                            {"brand": "zalopay", "last4": last4_phone},
                        )
                    elif json_data["type"] == 1:
                        # Handle normal payment
                        account_id = cb_data["app_user"]
                        orderId = cb_data["app_trans_id"].split("_")[1]
                        # Update transaction status
                        await payment_func(PaymentMethod.ZALOPAY, account_id, orderId)
                        # Add payment success to redis_channel
                        channel = (
                            f"account:${account_id}:zalopay-callback:orderId:{orderId}"
                        )
                        await RedisInstance.publish(channel, {"status": "success"})
            except Exception as e:
                result["return_code"] = 0
                result["return_message"] = str(e)
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

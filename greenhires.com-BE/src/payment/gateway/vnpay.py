import logging
from fastapi import HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src.payment.service import transaction
from src.payment.schema import Package, PaymentMethod, TransactionStatus
from src.config import settings
from src.database import get_db
from datetime import datetime, timedelta
import urllib.parse
import hmac
import hashlib
from typing import Dict
import pytz

class VnpayGateway:
    def __init__(self):
        self.requestData = {}

    def add_request_data(self, key, value):
        self.requestData[key] = value

    def get_payment_url(self, vnpay_payment_url, secret_key):
        inputData = sorted(self.requestData.items())
        queryString = ''
        seq = 0
        for key, val in inputData:
            if seq == 1:
                queryString = queryString + "&" + key + '=' + urllib.parse.quote_plus(str(val))
            else:
                seq = 1
                queryString = key + '=' + urllib.parse.quote_plus(str(val))

        hashValue = self.__hmacsha512(secret_key, queryString)
        return vnpay_payment_url + "?" + queryString + '&vnp_SecureHash=' + hashValue

    def __hmacsha512(self,key, data):
        byteKey = key.encode('utf-8')
        byteData = data.encode('utf-8')
        return hmac.new(byteKey, byteData, hashlib.sha512).hexdigest()
    
    def get_vietnam_time(self, delay_time_in_seconds: int = 0):
        vietnam_tz = pytz.timezone('Asia/Ho_Chi_Minh')

        # Get the current time in Vietnam timezone
        vietnam_time = datetime.now(vietnam_tz)
        if (delay_time_in_seconds > 0):
            vietnam_time = vietnam_time + timedelta(seconds=delay_time_in_seconds)

        # Format the datetime object
        return vietnam_time.strftime('%Y%m%d%H%M%S')
    
    async def create_and_use_payment_token(self, userId: str, orderId: str, amount: float, currency: str = 'VND') -> str:
        req = {
            'vnp_version': '2.1.0',
            'vnp_command': 'pay_and_create',
            'vnp_tmn_code': settings.VNPAY_TMN,
            'vnp_app_user_id': userId,
            'vnp_card_type': '01',
            'vnp_txn_ref': orderId,
            'vnp_amount': str(int(amount * 100)),  # Convert amount to smallest currency unit (e.g., cents)
            'vnp_curr_code': currency,
            'vnp_txn_desc': f'Payment for order #{orderId}',
            'vnp_return_url': settings.VNPAY_RETURN_URL,
            'vnp_cancel_url': settings.VNPAY_RETURN_CANCEL,
            'vnp_ip_addr': '127.0.0.1',  # You should capture the actual client IP
            'vnp_create_date': self.get_vietnam_time(),
            'vnp_store_token': '1'
        }
        self.requestData = req
        payment_url = self.get_payment_url(settings.VNPAY_CREATE_PAY_URL, settings.VNPAY_SECRET)
        logging.info('Payment URL: %s', payment_url)
        return payment_url
    
    async def create_standard_payment(self, order_id: str, package: Package) -> str:
        req = {
            "vnp_Version": "2.1.0",
            "vnp_Command": "pay",
            "vnp_TmnCode": settings.VNPAY_TMN,
            "vnp_Amount": int(package.VND_price * 100),  # Amount should be multiplied by 100
            "vnp_CurrCode": "VND",  # Only VND is supported
            "vnp_TxnRef": order_id,
            "vnp_OrderInfo": "order from Humantree",
            "vnp_OrderType": "250000",
            "vnp_Locale": "en",
            "vnp_CreateDate": self.get_vietnam_time(),
            "vnp_ExpireDate": self.get_vietnam_time(15 * 60),
            "vnp_IpAddr": "127.0.0.1",  # Replace with the actual IP address
            "vnp_ReturnUrl": settings.VNPAY_RETURN_URL,
        }
        print(settings.VNPAY_TMN)
        print(settings.VNPAY_SECRET)
        self.requestData = req
        payment_url = self.get_payment_url(settings.VNPAY_CREATE_PAY_URL,settings.VNPAY_SECRET)
        logging.info('Payment URL: %s', payment_url)
        return payment_url

    async def use_stored_payment_token(self,token: str, userId: str, orderId: str, amount: float, currency: str = 'VND') -> str:
        req = {
            'vnp_version': '2.1.0',
            'vnp_command': 'pay_token',
            'vnp_tmn_code': settings.VNPAY_TMN,
            'vnp_txn_ref': orderId,
            'vnp_app_user_id': userId,
            'vnp_token': token,
            'vnp_amount': str(int(amount * 100)),  # Convert amount to smallest currency unit (e.g., cents)
            'vnp_curr_code': currency,
            'vnp_txn_desc': f'Payment for order #{orderId}',
            'vnp_create_date': self.get_vietnam_time(),
            'vnp_ip_addr': '127.0.0.1',  # You should capture the actual client IP
            'vnp_locale': 'vn',
            'vnp_return_url': settings.VNPAY_RETURN_URL
        }

        self.requestData = req
        payment_url = self.get_payment_url(settings.VNPAY_CREATE_PAY,settings.VNPAY_SECRET)
        logging.info('Payment URL: %s', payment_url)
        return payment_url

    async def handle_callback(
        request: Request,
        binding_func: callable,
        get_package_func: callable,
        payment_func: callable,
        feature_func: callable,
        db: AsyncSession = Depends(get_db)
    ) -> dict:
        async with db.begin():
            try:
                input_data = dict(request.query_params)
                vnp_secure_hash = input_data.pop('vnp_SecureHash', None)

                if not input_data:
                    return {"RspCode": '99', "Message": 'Invalid request'}

                if not vnp_secure_hash:
                    logging.info("Invalid callback: missing secure hash")
                    return {"RspCode": '97', "Message": 'Invalid Signature'}

                # Extract necessary information from the input data
                order_id = input_data.get('vnp_TxnRef')
                amount = input_data.get('vnp_Amount')
                vnp_response_code = input_data.get('vnp_ResponseCode')
                vnp_pay_date = input_data.get('vnp_PayDate')
                input_data["brand"] = "vnpay"
                if vnp_response_code == '00':

                    # Use binding_func to handle transaction update and checks
                    transaction_data = await binding_func(
                        db=db,
                        method=PaymentMethod.VNPAY,
                        order_id=order_id,
                        status=TransactionStatus.SUCCESS if vnp_response_code == '00' else TransactionStatus.FAILED,
                        activated_at=datetime.strptime(vnp_pay_date, "%Y%m%d%H%M%S") if vnp_pay_date else None,
                    )

                    # Check if transaction is valid and status was updated
                    if not transaction_data.get("valid"):
                        return {"RspCode": '99', "Message": 'Invalid request'}
                    
                    if transaction_data.get("already_updated"):
                        return {"RspCode": '02', "Message": 'Order Already Updated'}

                    # Handle subscription update and package function
                    package = await get_package_func(
                        db=db,
                        package_id=transaction_data.get("transaction").package_id
                    )
                    await payment_func(
                        db=db,
                        account_id=transaction_data.get("transaction").account_id,
                        package=package,
                    )

                    # if (transaction_data.get("coupon_id")):
                    await feature_func(
                        db=db,
                        account_id=transaction_data.get("transaction").account_id,
                        is_coupon_used=transaction_data.get("coupon_id"),
                    )

                    # Commit changes
                    await db.commit()

                    return {"RspCode": '00', "Message": 'Confirm Success'}

                else:
                    # Payment failure, already updated by binding_func
                    logging.info("Payment Error!")
                    await db.rollback()
                    return {"RspCode": '10', "Message": 'Payment Error'}

            except Exception as e:
                await db.rollback()
                logging.error(f"Error in handle_callback: {str(e)}")
                return {"RspCode": '99', "Message": 'Unknown error'}


vnpay_gateway = VnpayGateway()


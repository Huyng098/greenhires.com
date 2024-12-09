from src.payment.schema import (
    Currency,
    Duration,
    PackageFrequency,
    PaymentMethod,
    Package,
)
from typing import Any, Tuple
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from src.schema import Currency


def get_days_by_frequency(
    next_payment_date: datetime, frequency: PackageFrequency
) -> int:
    print(frequency)
    if frequency == PackageFrequency.ONE_CV or frequency == PackageFrequency.REQUEST_CV:
        return 0
    elif frequency == PackageFrequency.DAILY:
        return 1
    elif frequency in [PackageFrequency.WEEKLY, PackageFrequency.TRIAL_WEEKLY_MONTHLY]:
        start_date = next_payment_date - relativedelta(weeks=1)
    elif frequency == PackageFrequency.MONTHLY:
        start_date = next_payment_date - relativedelta(months=1)
    elif frequency == PackageFrequency.BI_MONTHLY:
        start_date = next_payment_date - relativedelta(months=2)
    elif frequency == PackageFrequency.QUARTERLY:
        start_date = next_payment_date - relativedelta(months=3)
    elif frequency == PackageFrequency.SEMI_ANNUALLY:
        start_date = next_payment_date - relativedelta(months=6)
    elif frequency == PackageFrequency.YEARLY:
        start_date = next_payment_date - relativedelta(years=1)
    else:
        raise ValueError("Invalid frequency")
    return (next_payment_date - start_date).days


def get_next_day(current_day: datetime, frequency: PackageFrequency) -> datetime:
    if frequency == PackageFrequency.ONE_CV or frequency == PackageFrequency.REQUEST_CV:
        return 0
    elif frequency == PackageFrequency.DAILY:
        return current_day + timedelta(days=1)
    elif frequency in [PackageFrequency.WEEKLY, PackageFrequency.TRIAL_WEEKLY_MONTHLY]:
        return current_day + timedelta(weeks=1)
    elif frequency == PackageFrequency.MONTHLY:
        return current_day + relativedelta(months=1)
    elif frequency == PackageFrequency.BI_MONTHLY:
        return current_day + relativedelta(months=2)
    elif frequency == PackageFrequency.QUARTERLY:
        return current_day + relativedelta(months=3)
    elif frequency == PackageFrequency.SEMI_ANNUALLY:
        return current_day + relativedelta(months=6)
    elif frequency == PackageFrequency.YEARLY:
        return current_day + relativedelta(years=1)


def package_to_paypal_plan(
    frequency: PackageFrequency, trial_price: float, fixed_price: float
) -> list[dict[str, Any]]:
    def create_cycle(
        interval: int,
        interval_count=1,
        total_cycles=0,
        tenure_type: str = "REGULAR",
        sequence: int = 1,
        price=fixed_price,
    ) -> dict:
        return {
            "frequency": {"interval_unit": interval, "interval_count": interval_count},
            "tenure_type": tenure_type,
            "sequence": sequence,
            "total_cycles": total_cycles,
            "pricing_scheme": {"fixed_price": {"value": price, "currency_code": "USD"}},
        }

    if frequency == PackageFrequency.DAILY:
        return [create_cycle("DAY", 1, 0)]
    elif frequency in [PackageFrequency.WEEKLY]:
        return [create_cycle("WEEK")]
    elif frequency == PackageFrequency.MONTHLY:
        return [create_cycle("MONTH")]
    elif frequency == PackageFrequency.BI_MONTHLY:
        return [create_cycle("MONTH", 2)]
    elif frequency == PackageFrequency.QUARTERLY:
        return [create_cycle("MONTH", 3)]
    elif frequency == PackageFrequency.SEMI_ANNUALLY:
        return [create_cycle("MONTH", 6)]
    elif frequency == PackageFrequency.YEARLY:
        return [create_cycle("YEAR")]
    elif frequency == PackageFrequency.TRIAL_WEEKLY_MONTHLY:
        first_cycle = create_cycle("DAY", 7, 1, "TRIAL", 1, trial_price)
        second_cycle = create_cycle("MONTH", 1, 0, "REGULAR", 2)
        return [first_cycle, second_cycle]
    else:
        raise ValueError("Invalid frequency")


def get_amount_currency(
    package: Package,  # Ensure this matches the correct type
    payment_method: PaymentMethod
) -> Tuple[float, str]:  # Updated to use Tuple
    print(package)
    amount = None
    currency = None
    
    for price in package.prices:  # Access prices as an attribute of Package
        if payment_method in [PaymentMethod.MOMO, PaymentMethod.ZALOPAY, PaymentMethod.VNPAY]:
            if price.currency == Currency.VND:
                amount = price.amount
                currency = price.currency.value  # Use .value to get the string representation
                break
        else:
            if price.currency == Currency.USD:
                amount = price.amount
                currency = price.currency.value  # Use .value to get the string representation
                break
                
    if amount is None or currency is None:
        raise ValueError("Appropriate price not found for the given payment method")
        
    return amount, currency

def get_duration(frequency: PackageFrequency) -> Duration:
    if frequency == PackageFrequency.ONE_CV:
        return {"unit": "day", "value": 1}
    elif frequency == PackageFrequency.REQUEST_CV:
        return {"unit": "day", "value": 0}
    elif frequency == PackageFrequency.DAILY:
        return {"unit": "day", "value": 1}
    elif frequency == PackageFrequency.WEEKLY:
        return {"unit": "week", "value": 1}
    elif frequency == PackageFrequency.MONTHLY:
        return {"unit": "month", "value": 1}
    elif frequency == PackageFrequency.BI_MONTHLY:
        return {"unit": "month", "value": 2}
    elif frequency == PackageFrequency.QUARTERLY:
        return {"unit": "month", "value": 3}
    elif frequency == PackageFrequency.SEMI_ANNUALLY:
        return {"unit": "month", "value": 6}
    elif frequency == PackageFrequency.YEARLY:
        return {"unit": "year", "value": 1}
    elif frequency == PackageFrequency.TRIAL_WEEKLY_MONTHLY:
        return {"unit": "day", "value": 7}

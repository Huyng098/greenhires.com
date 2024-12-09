from src.payment import service as payment_service
from datetime import datetime, timezone
import logging
from src.utils.email import send_email
from src.task.scheduler import scheduler
from src.payment.schema import Subscription


'''async def auto_payment(sub_id: str) -> None:
    sub_pack = await payment_service.get_subscription_by_id(sub_id)
    await payment_service.pay_for_subscription(
        Subscription(**sub_pack, exclude_unset=True), sub_pack)


@scheduler.scheduled_job(trigger="cron", hour=0, minute=0, second=0, id="send_alert_subscribers")
async def send_alert_subscribers() -> str:
    subscriptions = await payment_service.get_all_active_subscriptions()
    success_mail = []
    for sub in subscriptions:
        next_payment_date: datetime = sub['nextPaymentDate']
        # Notify subscribers 3 day before the next payment date
        if (next_payment_date - datetime.now(timezone.utc)).days < 3:
            logging.info(f"Sending email to {sub['email']}")
            await send_email(
                email=sub['email'],
                content=f"Your subscription is about to expire and we will automatically renew it on {sub['nextPaymentDate'].strftime('%d/%m/%Y')}."
            )
            success_mail.append(sub['email'])
            # Schedule the auto-recurring payment
            sched_id = f"{sub['id']}{sub['nextPaymentDate']}"
            if scheduler.get_job(sched_id) is None:
                scheduler.add_job(func=auto_payment, trigger="date",
                                  args=[sub['id']],
                                  run_date=sub['nextPaymentDate'], id=sched_id)

    return f"Sent alert payment subscribers successfully to {' ,'.join(success_mail)}."
'''

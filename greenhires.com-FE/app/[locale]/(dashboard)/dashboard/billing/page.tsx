import BillingHistory from "@/modules/Dashboard/Billing/BillingHistory/BillingHistory";
import CurrentPlan from "@/modules/Dashboard/Billing/CurrentPlan";
import {
  getBillingHistory,
  getCurrentSubscription,
} from "@/services/payment/api";

export default async function BillingPage() {
  const data = await getBillingHistory();
  const current_subscript = await getCurrentSubscription();
  return (
    <>
      <div className="p-8  w-full flex flex-col gap-8 items-center bg-hoduc-bg-dashboard">
        <CurrentPlan current_subscript={current_subscript} />
        <BillingHistory transactions={data.items} />
      </div>
    </>
  );
}

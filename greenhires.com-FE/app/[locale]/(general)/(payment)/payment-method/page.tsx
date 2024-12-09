import { PaymentSubscriptionPlan } from "@/modules/Payment/Package/Package";
import { getPackageByFrequency } from "@/services/payment/api";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  if (!searchParams?.plan) {
    return redirect("/pricing-plans");
  }
  const data = await getPackageByFrequency(searchParams?.plan);
  if ("error_code" in data) {
    if (data.error_code === 401) return redirect("/auth/signin");
    else return redirect("/pricing-plans");
  } else {
    return (
        <PaymentSubscriptionPlan data={data} />
    );
  }
}

import PriceService from "@/modules/Payment/Package/priceService";
import { getAllPackages, getCurrentSubscription } from "@/services/payment/api";

export default async function Plans() {

  const packages = await getAllPackages();
  const current_subscript = await getCurrentSubscription();
  return (
    <div className="pb-[120px] pt-[180px]">
      <div className="grid grid-cols-3 gap-14 container">
        {packages?.map((item, idx) => (
          <PriceService
            key={idx}
            item={item}
            current_subscript={current_subscript}
          />
        ))}
      </div>
    </div>
  );
}

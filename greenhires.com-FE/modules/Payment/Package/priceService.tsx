"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { packageDto, SubscriptionDto } from "@/interfaces/payment/payment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  item: packageDto;
  current_subscript: SubscriptionDto;
}

export const PriceService = ({ item, current_subscript }: Props) => {
  const router = useRouter();
  const handleStartSubscription = (item: packageDto) => {
    if (item.id === current_subscript.package_id) {
      toast.error("You are already subscribed to this plan");
    } else {
      router.push(`/payment-method?plan=${item.frequency}`);
    }
  };
  return (
    <div
      className="aspect-[1268/821]  rounded-lg"
      style={{ backgroundImage: "url('/images/payment/package_bg.svg')" }}
    >
      <div className="p-4">
        <p className="font-bold text-lg text-center">{item.name}</p>
        <p className="text-center font-semibold text-primary-main text-[60px]">{`$${
          item.USD_price
        }`}</p>
        <Separator className="h-[3px] mb-5 bg-[#ccdedf]" />
        <div className="flex items-center justify-center flex-col mx-2 gap-6 min-h-[320px]">
          {item.description.map((description, idx) => (
            <p key={idx} className="text-center font-[600]">
              {description}
            </p>
          ))}
        </div>
        <Separator className="h-[3px] my-5  bg-[#ccdedf]" />
        <div className="flex flex-row mt-3 justify-center ">
          <Button
            onClick={() => handleStartSubscription(item)}
            variant={"outline"}
            className="hover:bg-primary-main hover:text-white p-5 rounded-lg text-primary-main mb-5"
          >
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceService;

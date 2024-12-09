"use client";
import { Separator } from "@/components/ui/separator";
import { packageDto } from "@/interfaces/payment/payment";
import PaymentMethodItem from "@/modules/Payment/PaymentMethodItem";
import { Check } from "@phosphor-icons/react";

interface Props {
  data: packageDto;
}

export const PaymentSubscriptionPlan = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-5 justify-center items-center text-primary-main mb-10 pt-[180px] min-h-full">
      <p className="font-bold text-3xl text-primary-main">Payment</p>
      <div className="w-full flex rounded-lg gap-5">
        <div className="bg-[#F8FDFD] py-5 px-10 w-1/2 ">
          <p className="text-xl font-bold mb-6">Payment Method</p>
          <div className="flex flex-col gap-10">
            <PaymentMethodItem pkg={data} />
          </div>
        </div>
        <div className="flex flex-col py-5 px-10 gap-2 w-1/2">
          <p className="text-xl font-bold">Plan Summary</p>
          <Separator className="my-1 py-[1px]" />
          <p className="font-semibold text-lg text-black">{data.name}</p>
          <Separator className="my-1 py-[1px]" />
          <div>
            {data.description.map((description, idx) => (
              <div className="flex items-center gap-2" key={idx}>
                <Check size={20} color="green" weight="light" />
                {description}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-md text-black">Fee</p>
            <p className="font-semibold text-md text-[#ACACAC]">
              ${data.USD_price}
            </p>
          </div>
          <Separator className="my-1 py-[1px]" />
          <div className="flex justify-between">
            <p className="font-bold text-xl text-black">Total</p>
            <p className="font-bold text-xl text-black">${data.USD_price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


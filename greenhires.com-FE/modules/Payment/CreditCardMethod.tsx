"use client";
import { useCreatePayment } from "@/services/payment/query";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

interface Props {
  id: string;
}

export default function CreditCardMethod({ id }: Props) {
  const { createPayment } = useCreatePayment();
  return (
    <>
      <div
        onClick={() =>
          createPayment({ package_id: id, payment_method: "credit_card" })
        }
        className="flex justify-between p-4 border border-solid border-hoduc-bg-gray_darker bg-white rounded-lg hover:cursor-pointer hover:shadow-xl"
      >
        <div className="flex gap-4">
          <Image
            src={`/images/payment/creditcard.svg`}
            alt={"Credit Card"}
            width={40}
            height={40}
          />
          <div>
            <p className="font-bold ">{"Credit Card"}</p>
            <p className="text-sm">{"Credit Card"}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <>
            <Image
              src={"/images/payment/visa.svg"}
              alt={"VISA"}
              width={40}
              height={40}
            />
            <Image
              src={"/images/payment/master_card.svg"}
              alt={"VISA"}
              width={40}
              height={40}
            />
            <Image
              src={"/images/payment/jcb.svg"}
              alt={"VISA"}
              width={40}
              height={40}
            />
          </>
          <CaretRight size={32} className="text-secondary-main" />
        </div>
      </div>
    </>
  );
}

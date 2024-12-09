"use client";

import { packageDto } from "@/interfaces/payment/payment";
import {
  captureOrderPayPal,
  checkBinding,
  paymentPackage,
} from "@/services/payment/api";
import {
  useCreateOrderPayPal,
  useCreatePayment,
} from "@/services/payment/query";
import { CircularProgress } from "@mui/material";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { BindingTokenScreen } from "./BindingTokenScreen";

const PAYPAL_CLIENT_ID =
  "AVRck1j7KrYi6fg5yb9RSt2h9RiwxwbyeBRYAuc6a1S4C7LwRaaUlcvsnb0C6g9PfrEConthMxHd7A5r";

const paymentMethods = [
  { key: "momo", image: "/images/payment/momo1.svg", size: 40 },
  { key: "zalopay", image: "/images/payment/zalopay-seeklogo.svg", size: 80 },
];

interface Props {
  pkg: packageDto;
}
export default function PaymentMethodItem({ pkg }: Props) {
  const { createPayment, isPending } = useCreatePayment();
  const { initOrderPayPal, isPayingPayPal } = useCreateOrderPayPal();
  const router = useRouter();
  const [openZaloPayBinding, setOpenZaloPayBinding] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const handleCreatePayment = async (paymentMethod: string) => {
    if (paymentMethod === "zalopay") {
      const zalopayBinding = await checkBinding(paymentMethod);
      zalopayBinding.is_binding
        ? setOpenZaloPayBinding(true)
        : router.replace(zalopayBinding.binding_link);
    } else {
      await createPayment({
        package_id: pkg.id,
        payment_method: paymentMethod,
      });
    }
  };

  const handlePaymentTokenZaloPay = async () => {
    await createPayment({ package_id: pkg.id, payment_method: "zalopay" });
    setOpenZaloPayBinding(false);
  };

  const handlePayPalOrder = async () => {
    const order = await initOrderPayPal({ package_id: pkg.id });
    if ("error_code" in order) throw new Error(order.detail);
    return order.orderId;
  };

  const handlePayPalApproveOrder = async (data: { orderID: string }) => {
    const order = await captureOrderPayPal(data.orderID);
    if ("error_code" in order) throw new Error(order.detail);
    router.push("/payment-success");
  };

  const renderPayPalButton = () => {
    const router = useRouter();

    return (
      <PayPalScriptProvider
        options={{
          clientId: PAYPAL_CLIENT_ID,
        }}
      >
        <PayPalButtons
          disabled={isPayingPayPal}
          style={{
            disableMaxWidth: true,
            shape: "rect",
            layout: "horizontal",
            color: "gold",
            label: "paypal",
            tagline: false,
          }}
          createOrder={async () => {
            const orderId = await handlePayPalOrder();
            return orderId;
          }}
          onApprove={async (data, actions) => {
            try {
              if (data.orderID) {
                await handlePayPalApproveOrder(data);
                router.push("/payment-success");
              }
            } catch (error) {
              console.error("Failed to approve PayPal order:", error);
            }
          }}
        >
          {isPending ? (
            <CircularProgress
              size={22}
              sx={{
                "&.MuiCircularProgress-colorPrimary": {
                  color: "white!important",
                },
              }}
            />
          ) : (
            <Image
              src="/images/payment/paypal.svg"
              alt="paypal"
              width={30}
              height={30}
            />
          )}
        </PayPalButtons>
      </PayPalScriptProvider>
    );
  };

  const handleVNPayMethod = async () => {
    try {
      const paymentResp = await paymentPackage({
        package_id: pkg.id,
        payment_method: "vnpay",
      });

      if ("error_code" in paymentResp) throw new Error(paymentResp?.detail);

      router.push(paymentResp.redirect_url);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Payment failed, please try again later");
      }
    }
  };

  // New function to handle coupon code payment
  const handleCouponPayment = async () => {
    try {
      const paymentResp = await paymentPackage({
        package_id: pkg.id,
        payment_method: "coupon",
        coupon_code: couponCode, // Include the coupon code in the request
      });

      if ("error_code" in paymentResp) throw new Error(paymentResp?.detail);

      router.push(paymentResp.redirect_url);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Coupon code payment failed, please try again later");
      }
    }
  };

  return (
    <>
      {paymentMethods.map((method) => (
        <button
          key={method.key}
          onClick={() =>
            method.key === "paypal" ? null : handleCreatePayment(method.key)
          }
          className={classNames(
            "flex justify-center p-4 border border-solid rounded-lg bg-white hover:opacity-90"
          )}
        >
          <Image
            src={method.image}
            alt={method.key}
            width={method.size}
            height={method.size}
          />
        </button>
      ))}
      <div className="z-0">{renderPayPalButton()}</div>
      <button
        onClick={handleVNPayMethod}
        className={classNames(
          "flex justify-center p-4 border border-solid rounded-lg bg-white hover:opacity-90"
        )}
      >
        <Image
          src={"/images/payment/vnpay.svg"}
          alt="vnpay"
          width={80}
          height={80}
        />
      </button>

      {pkg.name?.includes("Trial") && (
        <div className="flex flex-col gap-2 my-4">
          <label
            htmlFor="couponCode"
            className="font-semibold text-md text-black"
          >
            Coupon Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="couponCode"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Enter coupon code"
            />
            <button
              onClick={handleCouponPayment}
              className="bg-primary-main text-white font-semibold px-4 py-2 rounded"
            >
              Apply Coupon
            </button>
          </div>
        </div>
      )}
      <BindingTokenScreen
        isPending={isPending}
        open={openZaloPayBinding}
        setOpen={setOpenZaloPayBinding}
        handlePaymentToken={handlePaymentTokenZaloPay}
      />
    </>
  );
}

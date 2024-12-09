"use server";

import { PAYMENT } from "@/constants/apis";
import { ErrorResponse } from "@/interfaces/base";
import { PaginatedResponse } from "@/interfaces/general/pagination";
import {
  PaymentPackagePayload,
  SubscriptionDto,
  TransactionDto,
  packageDto,
} from "@/interfaces/payment/payment";
import { http } from "@/utils/http";
import qs from "query-string";

export const getAllPackages = async (): Promise<packageDto[]> => {
  return await http.get(
    `${PAYMENT.ALL_PACKAGE}`,
    { next: { tags: ["packages"] } },
    true
  );
};

export const getPackageByFrequency = async (
  frequency: string
): Promise<packageDto> => {
  return await http.get(
    `${PAYMENT.GET_BY_FREQUENCY(frequency)}`,
    { next: { tags: [`package_frequency: ${frequency}`] } },
    true
  );
};

export const checkBinding = async (
  payment_method: string
): Promise<{
  is_binding: boolean;
  binding_link: string;
}> => {
  return await http.get(
    `${PAYMENT.CHECK_BINDING}?payment_method=${payment_method}`,
    { next: { tags: ["check_binding"] } },
    true
  );
};

export const createPayment = async ({
  package_id,
  payment_method,
}: {
  package_id: string;
  payment_method: string;
}): Promise<{ redirect_url: string } | ErrorResponse> => {
  return await http.post(
    `${PAYMENT.PAYMENT}`,
    { package_id, payment_method },
    undefined,
    true
  );
};

export const getBillingHistory = async (): Promise<
  PaginatedResponse<TransactionDto>
> => {
  return await http.get(
    `${PAYMENT.HISTORY}`,
    { next: { tags: ["billing-history"] } },
    true
  );
};

export const getCurrentSubscription = async (): Promise<SubscriptionDto> => {
  return await http.get(
    `${PAYMENT.CURRENT_SUBSCRIPTION}`,
    { next: { tags: ["subscriptions_mine"] } },
    true
  );
};

export const cancelSubscription = async (
  id: string
): Promise<SubscriptionDto | ErrorResponse> => {
  return await http.put(
    `${PAYMENT.UPDATE_SUBSCRIPTION(id)}`,
    { status: "cancelled" },
    undefined,
    true
  );
};

export const createOrderPayPal = async ({
  package_id,
}: {
  package_id: string;
}): Promise<{ orderId: string } | ErrorResponse> => {
  return await http.post(
    `${PAYMENT.PAYPAL_ORDER}`,
    { package_id },
    undefined,
    true
  );
};

export const captureOrderPayPal = async (
  orderId: string
): Promise<ErrorResponse | { message: string }> => {
  return await http.post(
    `${PAYMENT.PAYPAL_ORDER}/${orderId}/capture`,
    undefined,
    undefined,
    true
  );
};

export const activatePayPalSubscription = async (
  plan_id: string
): Promise<{ message: string } | ErrorResponse> => {
  return await http.post(
    `${PAYMENT.PAYPAL_PLAN}/${plan_id}/activate`,
    undefined,
    undefined,
    true
  );
};

export const paymentPackage = async ({ coupon_code, ...payload}: PaymentPackagePayload): Promise<{ redirect_url: string } | ErrorResponse> => {
  const query_str = qs.stringify({coupon_code}, { skipNull: true, skipEmptyString: true });
  return http.post(
    `${PAYMENT.PAYMENT}?${query_str}`,
    payload,
    undefined,
    true
  );
}
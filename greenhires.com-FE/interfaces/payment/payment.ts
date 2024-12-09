import { z } from "zod";

export const packageSchema = z.object({
  USD_price: z.number(),
  VND_price: z.number(),
  frequency: z.string(),
  name: z.string(),
  description: z.array(z.string()),
  id: z.string(),
  isAutoRenew: z.boolean(),
});

export type packageDto = z.infer<typeof packageSchema>;

export interface SubscriptionDto {
  id: string;
  created_at: Date;
  updated_at: Date;
  package_id: string;
  payment_method: string;
  duration: {
    value: number;
    unit: string;
  };
  days_left: number;
  status: string;
  info: {
    brand?: string;
    last4: string;
    exp_year?: number;
    exp_month?: number;
    funding?: string;
  };
  nextPaymentDate: Date;
  account_id: string;
  price: {
    amount: number;
    currency: string;
  };
  days_remaining_percentage: number;
  name: string;
}

export interface TransactionDto {
  id: string;
  created_at: Date;
  updated_at: Date;
  package_id: string;
  package_name: string;
  payment_method: string;
  amount: number;
  currency: string;
  status: string;
  orderID: string;
}

export interface PaymentPackagePayload {
  package_id: string
  payment_method: string
  coupon_code?: string
}
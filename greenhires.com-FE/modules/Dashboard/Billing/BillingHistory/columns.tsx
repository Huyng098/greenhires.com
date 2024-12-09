"use client";

import { TransactionDto } from "@/interfaces/payment/payment";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const columns: ColumnDef<TransactionDto>[] = [
  {
    accessorKey: "order_id",
    header: "Order ID",
  },
  {
    accessorKey: "package_name",
    header: "Package Name",
  },
  {
    accessorKey: "coupon_code",
    header: "Coupon Code",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      let amount = row.getValue("amount") as string;
      return <div className="font-medium">{`$${amount}`}</div>;
    },
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => {
      let currency = row.getValue("currency") as string;
      return <div className="font-medium">{currency}</div>;
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => {
      let payment_method = row.getValue("payment_method") as string;
      return <div className="font-medium">{payment_method.toUpperCase()}</div>;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Date of Payment",
    cell: ({ row }) => {
      let updated_at = row.getValue("updated_at") as Date;
      return (
        <div className="font-medium">
          {dayjs(updated_at).format("DD/MM/YYYY")}
        </div>
      );
    },
  },
];

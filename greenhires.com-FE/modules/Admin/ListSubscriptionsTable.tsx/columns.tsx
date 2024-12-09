"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Subscription = {
  name: string,
  user_id: string,
  user_name: string,
  amount: number,
  date_start: Date,
  date_end: Date
};

export const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "name",
    header: "Subscriptions name",
  },
  {
    accessorKey: "user_id",
    header: "User ID",
  },
  {
    accessorKey: "user_name",
    header: "User Name",
  },
  {
    accessorKey: "amount",
    header: "Amount ",
    cell: ({ row }) => {
      let amount = row.getValue("amount") as string;

      return <div className="font-medium">{`$${amount}`}</div>;
    },
  },
  {
    accessorKey: "date_start",
    header: "Name",
    cell: ({ row }) => {
      let day = row.getValue("date_start") as string;
      if (day) {
        day = dayjs(day as string).format("MMMM D, YYYY");
      }
      return <div className="font-medium">{day}</div>;
    },
  },
  {
    accessorKey: "date_end",
    header: "Name",
    cell: ({ row }) => {
      let day = row.getValue("date_end") as string;
      if (day) {
        day = dayjs(day as string).format("MMMM D, YYYY");
      }
      return <div className="font-medium">{day}</div>;
    },
  },
];

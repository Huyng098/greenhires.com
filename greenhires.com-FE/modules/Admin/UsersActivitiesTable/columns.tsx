"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Acitivity = {
  date: Date;
  member: string;
  role: "Admin" | "Consultant" | "Manager";
  action: string;
  description: string;
};

export const columns: ColumnDef<Acitivity>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      let day = row.getValue("date") as string;
      if (day) {
        day = dayjs(day as string).format("DD/MM/YYYY");
      }
      return <div className="font-medium">{day}</div>;
    },
  },
  {
    accessorKey: "member",
    header: "Member",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
        let action = row.getValue("action") as string;
        return <div className="font-medium py-2 rounded-lg bg-[#f0f0f0] text-[#848484] text-center">{action}</div>;
      },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];

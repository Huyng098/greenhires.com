"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import ChooseRoleButton from "./ChooseRoleButton";
import ActionButton from "./ActionButton";
import { UserDto } from "@/interfaces/user";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Template = {
  name: string;
  user_id: string;
  email: string;
  role: "Consultant" | "Admin"
};

export const columns: ColumnDef<UserDto>[] = [
  {
    accessorKey: "lastname",
    header: () => <></>,
    cell: ({ row }) => {
      return <></>
    },
  },
  {
    accessorKey: "firstname",
    header: "Name",
    cell: ({ row }) => {
      let firstName = row.getValue("firstname") as string;
      let lastname = row.getValue("lastname") as string;
      return <div>{firstName + " " + lastname}</div>
    },
  },
  {
    accessorKey: "id",
    header: "User ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      let role = row.getValue("role") as string;
      let id = row.getValue("id") as string;
      return <ChooseRoleButton role={role} id={id}/>;
    },
  },
  {
    
    header: "Action",
    cell: ({ row }) => {
      let id = row.getValue("id") as string;
      return <ActionButton id={id}/>;
    },
  },
];

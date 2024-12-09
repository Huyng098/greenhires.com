"use client";

import { Status } from "@/interfaces/base";
import { SampleDto } from "@/interfaces/sample/sample";
import { FramePreview } from "@/lib/design-screen/screen/FramePreview";
import { SerializedPage } from "@lidojs/design-core";
import { ColumnDef, RowData } from "@tanstack/react-table";
import dayjs from "dayjs";
import ActionButton from "./ActionButton";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    role?: string;
    typeButton?: string;
  }
}

const status_color = {
  approved: {
    bg_color: "#d0f4ff",
    text_color: "#093e8c",
  },
  waiting: {
    bg_color: "#fbf5c4",
    text_color: "#8b5401",
  },
  rejected: {
    bg_color: "#ffe3e3",
    text_color: "#8c0909",
  },
  pending: {
    bg_color: "#e8e8e8",
    text_color: "#555555",
  },
};

export const columns: ColumnDef<SampleDto>[] = [
  {
    accessorKey: "elements",
    header: () => <></>,
    cell: () => <></>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="max-w-[200px]">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Image",
    cell: ({ row }) => {
      let elements = row.getValue("elements") as SerializedPage[];
      return <FramePreview data={elements} width={794} height={1123} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      let status = row.getValue("status") as string;
      let color = status_color[status as keyof typeof status_color]?.bg_color; // Add index signature
      const text_color =
        status_color[status as keyof typeof status_color]?.text_color;
      return (
        <div
          style={{
            backgroundColor: color,
            color: text_color,
          }}
          className={`font-semibold text-center rounded-lg py-2 `}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "category_name",
    header: "Category",
  },
  {
    accessorKey: "creator_name",
    header: "Author",
  },
  {
    accessorKey: "approver_name",
    header: "Approver",
  },
  {
    accessorKey: "due_date",
    header: "Due date",
    cell: ({ row }) => {
      let day = row.getValue("due_date") as string;
      if (day) {
        day = dayjs(day as string).format("MMM D, YYYY");
      }
      return <div className="font-medium">{day}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "Action",
    cell: ({ row, table }) => {
      const role = table.options.meta?.role;
      const typeButton = table.options.meta?.typeButton;
      let status = row.getValue("status") as Status;
      let id = row.getValue("id") as string;
      return (
        <ActionButton
          id={id}
          role={role}
          typeButton={typeButton}
          status={status}
        />
      );
    },
  },
];

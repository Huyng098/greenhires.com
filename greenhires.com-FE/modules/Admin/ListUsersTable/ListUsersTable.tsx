"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useGetAllUsers } from "@/services/user";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaretLeft, CaretRight, UserPlus } from "@phosphor-icons/react";

export default function ListUsersTable() {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams();

  const offset = Number(searchParams.get("offset")) ?? 0;
  const limit = 10;
  const role = searchParams.get("role") ?? "";

  function convertObjectToQueryParams(obj: object) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, encodeURIComponent(item));
        }
      } else {
        params.set(key, encodeURIComponent(value));
      }
    }
    return params.toString();
  }
  const updatePath = (condition: any) => {
    const parameters = convertObjectToQueryParams(condition);
    router.push(`${pathname}?${parameters}`);
  };

  const { data, isPending, error } = useGetAllUsers(offset, limit, role);
  if (isPending) return <>Loading...</>;
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex justify-between w-full">
          <Select
            defaultValue={role}
            onValueChange={(value) =>
              updatePath({
                offset: 0,
                role: value === "All" ? "" : value,
              })
            }
          >
            <SelectTrigger className="w-[180px] focus-visible:ring-0 focus-visible:ring-offset-0  bg-white">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="superadmin">SuperAdmin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="consultant">Consultant</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="enduser">End user</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => router.push("/admin/users/create")}
            className="flex gap-4 bg-secondary-main hover:bg-secondary-main/85"
          >
            {" "}
            <UserPlus size={32} /> Add Users
          </Button>
        </div>
      </div>
      {data && <DataTable columns={columns} data={data?.items} />}
      <div className="flex justify-end items-center gap-5 my-5">
        <p>{`Page ${(offset / 10 + 1)} of ${Math.ceil((data?.total ?? 0) / 10)}`}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            updatePath({
              offset: offset - 10,
              role,
            });
          }}
          disabled={offset === 0}
        >
          <CaretLeft size={20} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            updatePath({
              offset: offset + 10,
              role,
            });
          }}
          disabled={(offset + 10) >= (data?.total ?? 0)}
        >
          <CaretRight size={20} />
        </Button>
      </div>
    </div>
  );
}

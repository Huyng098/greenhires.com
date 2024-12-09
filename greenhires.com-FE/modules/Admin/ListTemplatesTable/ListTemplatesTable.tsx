"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/interfaces/general/category";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { Loading } from "@/components/Common/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllSample } from "@/services/sample/query";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SAMPLE_TYPES } from "@/constants/dashboard";
interface Props {
  categories: Category[];
  role?: string;
  restrict?: string;
  typeButton?: string;
}

export default function ListTemplateTable({
  categories,
  role,
  restrict,
  typeButton,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: addDays(new Date(), 1),
  });

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

  const status = searchParams.get("status") ?? "";
  const category_id = searchParams.get("category_id") ?? "";
  const page = Number(searchParams.get("page")) ?? 0;
  const type = searchParams.get("type") ?? "template";
  const limit = 10;
  const updatePath = (condition: any) => {
    const parameters = convertObjectToQueryParams(condition);
    router.push(`${pathname}?${parameters}`);
  };

  const { data, isPending, error } = useGetAllSample(
    page,
    limit,
    status,
    date?.from,
    date?.to,
    category_id,
    restrict as "all" | "my" | undefined,
    type as SAMPLE_TYPES
  );
  if (isPending) return <Loading color="#2F566B" />;
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex gap-5">
          <div className={"grid gap-2"}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal bg-white",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  classNames={{ day_selected: "bg-primary-main text-white" }}
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(date) => setDate(date)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Select
            defaultValue={status}
            onValueChange={(value) =>
              updatePath({
                page: 0,
                category_id,
                status: value === "All" ? "" : value,
                type,
              })
            }
          >
            <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0 flex gap-2 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={category_id}
            onValueChange={(value) =>
              updatePath({
                page: 0,
                category_id: value === "All" ? "" : value,
                status,
                type,
              })
            }
          >
            <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0  bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {categories.map((category) => (
                <SelectItem value={category.id} key={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            defaultValue={type}
            onValueChange={(value) =>
              updatePath({
                page: 0,
                category_id,
                status,
                type: value === "All" ? "" : value,
              })
            }
          >
            <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0 flex gap-2 bg-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="template">Template</SelectItem>
              <SelectItem value="template-layout">Template Layout</SelectItem>
              <SelectItem value="layout">Layout</SelectItem>
              <SelectItem value="cover-letter">Cover letter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {data && (
        <DataTable
          columns={columns}
          data={data?.items}
          role={role}
          typeButton={typeButton}
        />
      )}
      <div className="mt-2 flex w-full justify-end items-center gap-5">
        <p>{`Page ${page + 1} of ${Math.ceil((data?.total ?? 0) / 10) || 1}`}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            updatePath({
              page: page - 1,
              category_id,
              status,
              type,
            });
          }}
          disabled={page === 0}
        >
          <CaretLeft size={20} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            updatePath({
              page: page + 1,
              category_id,
              status,
              type,
            });
          }}
          disabled={(page + 1) * 10 > (data?.total ?? 0)}
        >
          <CaretRight size={20} />
        </Button>
      </div>
    </div>
  );
}

"use client";
import { Badge } from "@mui/material";

import { Loading } from "@/components/Common/Loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
  useUnreadQuantity,
} from "@/services/notification/query";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  Checks,
  Circle,
} from "@phosphor-icons/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiBellSimpleLight } from "react-icons/pi";
dayjs.extend(relativeTime);
export const ResumeNotification = () => {
  const limit = 5;
  const { unread } = useUnreadQuantity();
  const [offset, setOffset] = useState(0);
  const { initialNotis, isPending } = useNotifications(limit, offset);
  const { markRead } = useMarkAsRead(limit, offset);
  const { markAllAsRead } = useMarkAllAsRead();

  const startMarkAllAsRead = async () => {
    if (unread?.value === 0) return;
    markAllAsRead();
  };
  const markNotiAsRead = async (idx: number) => {
    if (initialNotis?.items[idx].is_read) return;
    markRead({ id: initialNotis?.items[idx].id!, is_read: true });
  };
  const router = useRouter();

  const handleViewDetail = (idx: number) => {
    if (!initialNotis?.items[idx].is_read) {
      markNotiAsRead(idx);
    }
    if (initialNotis?.items[idx].key == "comment") {
      router.push(`/blogs/detail-blog/${initialNotis?.items[idx].key_id}`);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="standard"
          badgeContent={unread?.value || 2}
          invisible={false}
          sx={{
            mr: "10px",
            cursor: "pointer",
            "& .MuiBadge-badge": {
              backgroundColor: "#E5BC6D",
              color: "white",
              right: "4px",
              top: "3px",
              width: "16px",
              height: "16px",
              minWidth: "16px",
              fontSize: "0.65rem",
            },
          }}
        >
          <PiBellSimpleLight size={26} color="#00B1B8" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[9999] rounded-md p-3 min-w-[350px]">
        <div>
          <div
            onClick={startMarkAllAsRead}
            className="flex gap-2 cursor-pointer text-[#418CDF] text-sm"
          >
            <Checks size={20} weight="light" />
            <p>Mark all as read</p>
          </div>

          {isPending ? (
            <Loading color="#2F566B" />
          ) : (
            <div>
              <div>
                {initialNotis?.items?.map((noti, idx) => (
                  <div
                    key={noti.id}
                    className="border-t hover:bg-slate-100 p-2 flex items-center justify-between gap-8"
                  >
                    <div className="max-w-[350px]">
                      <p className="text-xs">{noti.content}</p>
                      <p className="text-[#2F566B] text-xs ml-2">
                        {dayjs(noti.created_at).fromNow()}
                        <span
                          onClick={() => handleViewDetail(idx)}
                          className="ml-3 text-secondary-main cursor-pointer"
                        >
                          View detail
                        </span>
                      </p>
                    </div>
                    {!noti.is_read && (
                      <Circle size={10} color="#418CDF" weight="fill" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-5 w-full justify-end">
                <button
                  className="hover:enabled:text-secondary-main"
                  disabled={offset === 0}
                  onClick={() => setOffset(offset - limit)}
                >
                  <CaretDoubleLeft size={15} weight="thin" />
                </button>
                <button
                  className="hover:enabled:text-secondary-main"
                  disabled={offset + limit >= initialNotis!.total}
                  onClick={() => setOffset(offset + 5)}
                >
                  <CaretDoubleRight size={15} weight="thin" />
                </button>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

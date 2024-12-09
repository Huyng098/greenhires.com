"use server";
import { NOTIFICATION } from "@/constants/apis";
import { INotification } from "@/interfaces/general/noti";
import { PaginatedResponse } from "@/interfaces/general/pagination";
import { http } from "@/utils/http";
import qs from "query-string";

export const getAllNotifications = async (
  limit: number = 5,
  offset: number = 0,
  status: "read" | "unread" = "unread"
): Promise<PaginatedResponse<INotification>> => {
  const query_str = qs.stringify(
    { limit, offset, status },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(`${NOTIFICATION.ALL}?${query_str}`, undefined, true);
};

export const markAsRead = async (data: {
  id: string;
  is_read: boolean;
}): Promise<{ notification_id: string }> => {
  return await http.put(
    `${NOTIFICATION.READ}/${data.id}`,
    { is_read: data.is_read },
    undefined,
    true
  );
};

export const markAllAsRead = async () => {
  return await http.put(
    `${NOTIFICATION.MARK_ALL_AS_READ}`,
    undefined,
    undefined,
    true
  );
};

export const getUnreadQuantity = async (): Promise<{ value: number }> => {
  return await http.get(`${NOTIFICATION.UNREAD_QUANTITY}`, undefined, true);
};

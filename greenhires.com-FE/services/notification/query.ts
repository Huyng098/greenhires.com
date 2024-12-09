import { NOTIFICATION_KEY, UNREAD_QUANTITY_KEY } from "@/constants/query_key";
import { INotification } from "@/interfaces/general/noti";
import { PaginatedResponse } from "@/interfaces/general/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllNotifications,
  getUnreadQuantity,
  markAllAsRead,
  markAsRead,
} from "./api";

export const useUnreadQuantity = () => {
  const { data: unread, isPending } = useQuery({
    queryKey: UNREAD_QUANTITY_KEY,
    queryFn: async () => {
      return await getUnreadQuantity();
    },
  });
  return { unread, isPending };
};

export const useNotifications = (limit: number = 10, offset: number = 0) => {
  const { data: initialNotis, isPending } = useQuery({
    queryKey: [NOTIFICATION_KEY, limit, offset],
    queryFn: async () => {
      return await getAllNotifications(limit, offset);
    },
  });
  return { initialNotis, isPending };
};

export const useMarkAsRead = (limit: number, offset: number) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: markAsRead,
    onSuccess: (data) => {
      if ("error_code" in data) {
        return;
      }
      queryClient.setQueryData<PaginatedResponse<INotification>>(
        [NOTIFICATION_KEY, limit, offset],
        (cache) => {
          if (!cache) return;
          return {
            ...cache,
            items: cache.items.map((item) => {
              if (item.id === data.notification_id) {
                return { ...item, is_read: true };
              }
              return item;
            }),
          };
        }
      );
      queryClient.setQueryData<{ value: number }>(
        UNREAD_QUANTITY_KEY,
        (cache) => {
          if (!cache) return;
          return { value: cache.value - 1 };
        }
      );
    },
  });
  return { markRead: mutate, isPending, error };
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: (data) => {
      if ("error_code" in data) {
        return;
      }
      queryClient.setQueryData<{ value: number }>(UNREAD_QUANTITY_KEY, {
        value: 0,
      });
      queryClient.setQueriesData<PaginatedResponse<INotification>>(
        {
          queryKey: [NOTIFICATION_KEY],
          exact: false,
        },
        (cache) => {
          if (!cache) return;
          return {
            ...cache,
            items: cache.items.map((item) => {
              return { ...item, is_read: true };
            }),
          };
        }
      );
    },
  });
  return { markAllAsRead: mutate, isPending, error };
};

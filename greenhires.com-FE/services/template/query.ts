import {
  LAYOUT_KEY,
  MY_BACKGROUND_KEY,
  PUBLIC_BACKGROUND_KEY,
  TEMPLATE_KEY,
} from "@/constants/query_key";
import { useQuery } from "@tanstack/react-query";
import {
  getAllPublicBackgrounds,
  getMyBackgrounds,
  getSampleById,
} from "./api";

export const useSample = (sample_id: string, type: string) => {
  let queryKey;
  if (type === "Layout") {
    queryKey = [...LAYOUT_KEY, sample_id];
  } else {
    queryKey = [...TEMPLATE_KEY, sample_id];
  }

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return await getSampleById(sample_id);
    },
    enabled: !!sample_id,
  });
  return { data };
};

export const useMyBackgrounds = (
  page: number = 0,
  limit: number = 25,
  category_id?: string
) => {
  const { isError, error, data, isFetching, isPlaceholderData } = useQuery({
    queryKey: [MY_BACKGROUND_KEY, category_id, limit, page],
    queryFn: async () => {
      return await getMyBackgrounds(page * limit, limit, category_id);
    },
  });
  return { isError, error, data, isFetching, isPlaceholderData };
};

export const usePublicBackgrounds = (
  page: number = 0,
  limit: number = 25,
  type: string,
  category_id?: string
) => {
  const { isError, error, data, isFetching, isPlaceholderData } = useQuery({
    queryKey: [PUBLIC_BACKGROUND_KEY, category_id, limit, page],
    queryFn: async () => {
      return await getAllPublicBackgrounds(
        page * limit,
        limit,
        type as "default" | "ai",
        category_id
      );
    },
  });
  return { isError, error, data, isFetching, isPlaceholderData };
};

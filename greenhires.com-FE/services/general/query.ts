import { CATEGORY_KEY } from "@/constants/query_key";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllCategories, uploadImage } from "./api";

export const useGetAllCategories = (type: string) => {
  const { data, error, isPending } = useQuery({
    queryKey: [...CATEGORY_KEY, { type }],
    queryFn: async () => {
      return await getAllCategories(type);
    },
  });
  return { data, error, isPending };
};

export const useUploadImage = () => {
  const {
    error,
    isPending: isUploading,
    data,
    mutateAsync,
  } = useMutation({
    mutationFn: uploadImage,
  });
  return { uploadImageRQ: mutateAsync, data, isUploading, error };
};

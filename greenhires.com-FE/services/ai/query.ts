import { MY_BACKGROUND_KEY } from "@/constants/query_key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBackgroundImage, uploadBackgroundImage } from "./api";

export const useUploadBackgroundImage = () => {
  const queryClient = useQueryClient();
  const { error, isPending, mutateAsync, isSuccess } = useMutation({
    mutationFn: uploadBackgroundImage,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      } else {
        queryClient.invalidateQueries({ queryKey: [MY_BACKGROUND_KEY] });
        return data;
      }
    },
  });
  return { uploadBg: mutateAsync, isPending, error, isSuccess };
};

export const useDeleteBackgroundImage = () => {
  const queryClient = useQueryClient();
  const { error, isPending, mutateAsync, isSuccess } = useMutation({
    mutationFn: deleteBackgroundImage,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      } else {
        toast.success("Delete background image successfully!");
        queryClient.invalidateQueries({ queryKey: [MY_BACKGROUND_KEY] });
        return data;
      }
    },
  });
  return { deleteBg: mutateAsync, isPending, error, isSuccess };
};

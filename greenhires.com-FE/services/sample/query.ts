import { SAMPLE_KEY } from "@/constants/query_key";
import { SavingContext } from "@/stores/saving";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "sonner";
import {
  addSample,
  changeSampleStatus,
  deleteSampleById,
  duplicateSampleById,
  exportSample,
  getAllSamples,
  replaceVariant,
  updateSampleById,
} from "./api";
import { SAMPLE_TYPES } from "@/constants/dashboard";

export const useGetAllSample = (
  page: number,
  limit: number,
  status?: string,
  start_date?: Date,
  end_date?: Date,
  category_id?: string,
  restrict?: "all" | "my",
  type?: SAMPLE_TYPES
) => {
  const { data, error, isPending } = useQuery({
    queryKey: [
      ...SAMPLE_KEY,
      { page, limit, status, start_date, end_date, category_id, type },
    ],
    queryFn: async () => {
      return await getAllSamples(
        page,
        limit,
        status,
        start_date,
        end_date,
        category_id,
        restrict,
        type
      );
    },
  });
  return { data, error, isPending };
};

export const useDeleteSample = () => {
  const queryClient = useQueryClient();

  const { error, isPending, mutate } = useMutation({
    mutationFn: deleteSampleById,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);

        return;
      }
      queryClient.invalidateQueries({ queryKey: [...SAMPLE_KEY] });
      toast.success("Delete sample successfully");
    },
  });
  return { deleteSampleById: mutate, isPending, error };
};

export const useChangeSampleStatus = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();
  const {
    error,
    isPending: isSubmitting,
    mutateAsync,
  } = useMutation({
    mutationFn: changeSampleStatus,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [...SAMPLE_KEY] });
      /^\/consultant\/canva/.test(pathname) &&
        router.push("/consultant/dashboard");
      toast.success("Change status sample successfully");
    },
  });
  return { changeSampleStatus: mutateAsync, isSubmitting, error };
};

export const useReplaceVariant = (closeMenu: () => void) => {
  const router = useRouter();
  const { error, isPending, mutateAsync } = useMutation({
    mutationFn: replaceVariant,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      toast.success("Add variant successfully");
      router.refresh();
      closeMenu();
    },
  });
  return { addVariantRQ: mutateAsync, isPending, error };
};

export const useDuplicateSample = () => {
  const queryClient = useQueryClient();
  const { error, isPending, mutate } = useMutation({
    mutationFn: duplicateSampleById,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [...SAMPLE_KEY] });
      toast.success("Duplicate sample successfully");
    },
  });
  return { duplicateSampleById: mutate, isPending, error };
};

export const useAddSample = () => {
  const queryClient = useQueryClient();
  const { error, isPending, mutate } = useMutation({
    mutationFn: addSample,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [...SAMPLE_KEY] });
      toast.success("Add sample successfully");
    },
  });
  return { addSample: mutate, isPending, error };
};

export const useUpdateSample = () => {
  const queryClient = useQueryClient();
  const { setSaving } = useContext(SavingContext);
  const { error, isPending, mutate } = useMutation({
    mutationFn: updateSampleById,
    onSuccess: (data) => {
      setSaving(false);
      queryClient.invalidateQueries({ queryKey: [...SAMPLE_KEY] });
    },
  });
  return { updateSampleById: mutate, isPending, error };
};

export const useExportSample = () => {
  const { error, isPending, mutateAsync } = useMutation({
    mutationFn: exportSample,
    onSuccess: (data) => {
      if (!data.url) {
        toast.error("Export failed, please try again later");
      }
    },
  });

  return { exportSample: mutateAsync, isPending, error };
};

import { MY_RESUMES_KEY, PREVIEW_KEY, RESUME_KEY } from "@/constants/query_key";
import { PublicViewResume, ResumeDto } from "@/interfaces/builder/resume";
import { useResumeStore } from "@/stores/resume";
import { SavingContext } from "@/stores/saving";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "sonner";
import {
  createResume,
  createResumeFromLinkedin,
  deleteResume,
  duplicateResume,
  exportResume,
  fetchResumeByUsernameSlug,
  getAllResumes,
  previewResume,
  updateResume,
  uploadResumeAvatar,
} from "./api";
import { TYPE } from "@/constants/dashboard";

export const useCreateResume = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    error,
    isPending: loading,
    mutateAsync,
  } = useMutation({
    mutationFn: createResume,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      if (data.builder_type === "resumeio") {
        router.replace(`/resume/${data.id}/edit`);
      } else {
        router.replace(`/canva/${data.id}/edit`);
      }
      queryClient.setQueryData<ResumeDto>([RESUME_KEY, { id: data.id }], data);
      queryClient.setQueryData<ResumeDto[]>(
        [MY_RESUMES_KEY, { type: data.type }],
        (cache) => {
          if (!cache) return [data];
          return [...cache, data];
        }
      );
    },
  });

  return { createResume: mutateAsync, loading, error };
};

export const useMyCVs = (type: TYPE) => {
  const {
    data: cvs,
    isError,
    isPending,
  } = useQuery({
    queryKey: [MY_RESUMES_KEY, { type }],
    queryFn: () => getAllResumes(type),
  });

  return { cvs, isError, isPending };
};
export const useCreateResumeLinkedin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { error, isPending, mutateAsync } = useMutation({
    mutationFn: createResumeFromLinkedin,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      if (data.builder_type === "resumeio") {
        router.replace(`/resume/${data.id}/edit`);
      } else {
        router.replace(`/canva/${data.id}/edit`);
      }
      queryClient.setQueryData<ResumeDto>([RESUME_KEY, { id: data.id }], data);
      queryClient.setQueryData<ResumeDto[]>(
        [MY_RESUMES_KEY, { type: data.type }],
        (cache) => {
          if (!cache) return [data];
          return [...cache, data];
        }
      );
    },
  });

  return { createResumeLinkedin: mutateAsync, isPending, error };
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();
  const {
    error,
    isPending: loading,
    mutate,
  } = useMutation({
    mutationFn: updateResume,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [RESUME_KEY, { id: data.id }],
      });
      queryClient.invalidateQueries({
        queryKey: [MY_RESUMES_KEY, { type: data.type }],
      });
    },
  });

  return { updateResume: mutate, loading, error };
};

export const useUploadImage = () => {
  const setValue = useResumeStore()((state) => state.setResume);
  const { error, isPending, mutate } = useMutation({
    mutationFn: uploadResumeAvatar,
    onSuccess: (data) => {
      setValue("basics.picture", data.url);
    },
  });
  return { uploadResumeImage: mutate, isPending, error };
};

export const useExportResume = () => {
  const { error, isPending, mutateAsync } = useMutation({
    mutationFn: exportResume,
    onSuccess: (data) => {
      if (!data.url) {
        toast.error("Export failed, please try again later");
      }
    },
  });

  return { exportResume: mutateAsync, isPending, error };
};

export const useResumePreview = (id: string) => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: [PREVIEW_KEY, id],
    queryFn: () => previewResume(id),
  });

  return { url: data?.url, loading, error };
};

export const useResumePublicView = ({ username, slug }: PublicViewResume) => {
  const {
    data: resume,
    isError,
    isPending,
  } = useQuery({
    queryKey: [RESUME_KEY, { username, slug }],
    queryFn: () => fetchResumeByUsernameSlug({ username, slug }),
  });
  return { resume, isError, isPending };
};

export const useUpdateResumeRealtime = () => {
  const queryClient = useQueryClient();
  const { setSaving } = useContext(SavingContext);
  const {
    error,
    isPending: loading,
    mutate,
  } = useMutation({
    mutationFn: updateResume,
    onSuccess: (data) => {
      setSaving(false);
      queryClient.setQueryData([RESUME_KEY, { id: data.id }], data);
      queryClient.invalidateQueries({
        queryKey: [MY_RESUMES_KEY, { type: data.type }],
      });
    },
  });

  return { updateResumeRealtime: mutate, loading, error };
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync,
  } = useMutation({
    mutationFn: deleteResume,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [RESUME_KEY, { id: data.id }],
      });
      queryClient.invalidateQueries({
        queryKey: [MY_RESUMES_KEY, { type: data.type }],
      });
    },
  });

  return { deleteCV: mutateAsync, loading, error };
};

export const useDuplicateResume = () => {
  const queryClient = useQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync,
  } = useMutation({
    mutationFn: duplicateResume,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      queryClient.setQueryData<ResumeDto>([RESUME_KEY, { id: data.id }], data);
      queryClient.invalidateQueries({
        queryKey: [MY_RESUMES_KEY, { type: data.type }],
      });
    },
  });

  return { duplicateCV: mutateAsync, loading, error };
};

export const debouncedUpdateResume = debounce(updateResume, 5000);

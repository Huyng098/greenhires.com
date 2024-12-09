"use client";
import { CANVA_IMAGES_KEY, USER_KEY } from "@/constants/query_key";
import { UserDto, addNewUserSchema } from "@/interfaces/user";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { logout } from "../auth/api";
import { deleteImage, uploadImage } from "../general/api";
import {
  addUser,
  changeMyInfor,
  changePassword,
  changePersonalInformation,
  changeRoleUserById,
  deleteMe,
  deleteUserbyId,
  getAllUsers,
  getCanvaImages,
  getMe,
  uploadPicture,
} from "./api";

export const useUploadAvatar = (user: UserDto) => {
  const setUser = useAuthStore()((state) => state.setUser);
  const { error, isPending, mutate } = useMutation({
    mutationFn: uploadPicture,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      setUser({ ...user, picture: data.url });
    },
  });
  return { uploadAvatar: mutate, isPending, error };
};

export const useChangePersonalInfor = () => {
  const setUser = useAuthStore()((state) => state.setUser);
  const { error, isPending, mutate } = useMutation({
    mutationFn: changePersonalInformation,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      setUser(data);
      toast.success("Change personal information successfully");
    },
  });
  return { changePersonalInformation: mutate, isPending, error };
};

export const useChangePassword = () => {
  const { error, isPending, mutate } = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      toast.success("Change password successfully");
    },
  });
  return { changePassword: mutate, isPending, error };
};

export const useSignOut = (is_internal: boolean = false) => {
  const router = useRouter();
  const setUser = useAuthStore()((state) => state.setUser);
  const { error, isPending, mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      if (is_internal) router.replace("/internal/signin");
      else {
        router.replace("/auth/signin");
      }
      setUser(null);
    },
  });
  return { logout: mutate, isPending, error };
};

export const useDeleteme = () => {
  const router = useRouter();
  const { error, isPending, mutate } = useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      router.replace("/auth/signin");
    },
  });
  return { deleteMe: mutate, isPending, error };
};

export const useGetAllUsers = (
  offset: number,
  limit: number,
  role?: string
) => {
  const { data, error, isPending } = useQuery({
    queryKey: [...USER_KEY, { offset, limit, role }],
    queryFn: async () => {
      return await getAllUsers(offset, limit, role);
    },
  });
  return { data, error, isPending };
};
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { error, isPending, mutate } = useMutation({
    mutationFn: deleteUserbyId,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [...USER_KEY] });
      toast.success("Delete User Successfully");
    },
  });
  return { deleteUserbyId: mutate, isPending, error };
};

export const userChangeRoleUser = () => {
  const queryClient = useQueryClient();
  const { error, isPending, mutate } = useMutation({
    mutationFn: changeRoleUserById,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [...USER_KEY] });
      toast.success("Change Role User Successfully");
    },
  });
  return { changeRoleUserById: mutate, isPending, error };
};

export const useAddUser = (
  form: UseFormReturn<z.infer<typeof addNewUserSchema>>
) => {
  const queryClient = useQueryClient();
  const { error, isPending, mutate } = useMutation({
    mutationFn: addUser,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [...USER_KEY] });
      form.reset();
      toast.success("Add User Successfully");
    },
  });
  return { addUser: mutate, isPending, error };
};

export const useChangeMyInfor = () => {
  const { error, isPending, mutate } = useMutation({
    mutationFn: changeMyInfor,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      toast.success("Change personal information successfully");
    },
  });
  return { changeMyInfor: mutate, isPending, error };
};

export const useUploadPicture = (uploadType: "avatar" | "cover_picture") => {
  const user = useAuthStore()((state) => state.user);
  const setUser = useAuthStore()((state) => state.setUser);
  const { error, isPending, mutate } = useMutation({
    mutationFn: uploadPicture,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }

      if (user) {
        if (uploadType === "avatar") setUser({ ...user, picture: data.url });
        else setUser({ ...user, cover_picture: data.url });
      }
      toast.success("Change picture successfully");
    },
  });
  return { uploadPicture: mutate, isPending, error };
};

export const useGetCanvaImages = (limit: number, offset: number) => {
  const { data, error, isPending } = useQuery({
    queryKey: [CANVA_IMAGES_KEY, { limit, offset }],
    queryFn: async () => {
      return await getCanvaImages(offset, limit);
    },
  });
  return { images: data, error, isPending };
};

export const useUploadCanva = () => {
  const queryClient = useQueryClient();
  const {
    error,
    isPending: isUploading,
    data,
    mutateAsync,
  } = useMutation({
    mutationFn: uploadImage,
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: [CANVA_IMAGES_KEY] });
    },
  });
  return { uploadImageRQ: mutateAsync, data, isUploading, error };
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  const { error, isPending, mutate } = useMutation({
    mutationFn: deleteImage,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [CANVA_IMAGES_KEY] });
      toast.success("Delete Image Successfully");
    },
  });
  return { deleteImage: mutate, isPending, error };
};

export const useGetMe = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore()((state) => state.setUser);
  const { error, isPending, mutate } = useMutation({
    mutationFn: getMe,
    onSuccess: (data) => {
      console.log(data);
      if ("error_code" in data) {
        return;
      }
      setUser(data);
    },
  });
  return { getMe: mutate, isPending, error };
};

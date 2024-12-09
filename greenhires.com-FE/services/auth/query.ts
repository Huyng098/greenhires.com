import { USER_KEY } from "@/constants/query_key";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { forgotPassword, login, logout, register, resetPassword } from "./api";

export const useLogin = (internal: boolean = true) => {
  const setUser = useAuthStore()((state) => state.setUser);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { error, isPending, mutate } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.error_code) {
        toast.error(data.detail);
        return;
      }
      setUser(data);
      // Set user to queryClient
      queryClient.setQueryData(USER_KEY, data);
      if (!internal) {
        return router.replace("/");
      }
      if (data.role === "consultant") {
        return router.replace("/consultant/dashboard");
      }
      if (data.role === "superadmin" || data.role === "admin") {
        return router.replace("/admin/dashboard");
      }
      router.replace("/");
    },
  });
  return { login: mutate, isPending, error };
};

export const useLogout = () => {
  const setUser = useAuthStore()((state) => state.setUser);
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(USER_KEY, null);
    },
  });
  return { logout: mutate, isPending, error };
};

export const useForgotPassword = () => {
  const { error, isPending, mutate, reset, isSuccess } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      if (data.error_code) {
        toast.error(data.detail);
        return;
      }
    },
  });
  return { forgotPassword: mutate, isPending, error, isSuccess };
};

export const useRegister = () => {
  const { error, isPending, mutateAsync, reset, isSuccess } = useMutation({
    mutationFn: register,
  });
  return { register: mutateAsync, isPending, error, isSuccess };
};

export const useResetPassword = () => {
  const { error, isPending, mutate, reset, isSuccess } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data.error_code) {
        toast.error(data.detail);
        return;
      }
    },
  });
  return { resetPassword: mutate, isPending, error, isSuccess };
};

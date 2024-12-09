"use client";
import { UserDto } from "@/interfaces/user";
import { createContext, useContext, useRef } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
}

export const createStore = () =>
  create<AuthStore>()(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
      }),
      { name: "auth" }
    )
  );

const AuthContext = createContext<ReturnType<typeof createStore> | null>(null);

export const useAuthStore = () => {
  if (!AuthContext)
    throw new Error("useAuthStore must be used within a AuthProvider");
  return useContext(AuthContext)!;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useRef<ReturnType<typeof createStore>>();
  if (!store.current) {
    store.current = createStore();
  }
  return (
    <AuthContext.Provider value={store.current}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

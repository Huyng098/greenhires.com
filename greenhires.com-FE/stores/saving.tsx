"use client";
import { createContext, useState } from "react";

export type SavingContextType = {
  saving: boolean;
  setSaving: (saving: boolean) => void;
};

export const SavingContext = createContext<SavingContextType>(
  {} as SavingContextType
);

export const SavingProvider = ({ children }: { children: React.ReactNode }) => {
  const [saving, setSaving] = useState(false);
  return (
    <SavingContext.Provider value={{ saving, setSaving }}>
      {children}
    </SavingContext.Provider>
  );
};

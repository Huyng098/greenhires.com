import { InputHTMLAttributes } from "react";

export type TInput = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hasError?: boolean;
};

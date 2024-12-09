import { InputHTMLAttributes } from "react";

export type TCheckbox = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

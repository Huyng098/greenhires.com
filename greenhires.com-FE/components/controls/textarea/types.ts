import { InputHTMLAttributes } from "react";

export type TTextarea = InputHTMLAttributes<HTMLTextAreaElement> & {
  rows?: number;
  label?: string;
};

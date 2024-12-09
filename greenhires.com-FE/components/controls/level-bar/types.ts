import { InputHTMLAttributes } from "react";

export type LevelBarProps = {
    value: number;
    label: string;
    color: string;
};

export type TLevelBar = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  items: LevelBarProps[];
};
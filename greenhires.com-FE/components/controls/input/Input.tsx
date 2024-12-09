import { TextField } from "@mui/material";
import { ForwardedRef, forwardRef } from "react";
import { TInput } from ".";

export const commonStyles = {
  focusedFieldset: {
    "& .Mui-focused fieldset": {
      border: "1px solid #19B2B9 !important",
    },
    "& label.Mui-focused": {
      color: "#19B2B9",
    },
  },
};

const Component = (
  {
    id,
    label,
    required,
    disabled,
    placeholder,
    hasError,
    className,
    ...props
  }: TInput,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <TextField
      ref={ref}
      inputProps={{ ...props }}
      id={id}
      size="small"
      sx={{
        ...commonStyles.focusedFieldset,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: hasError ? "red !important" : undefined,
        },
      }}
      label={label}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      className={`w-full ${className}`}
    />
  );
};

export const Input = forwardRef<HTMLInputElement, TInput>(Component);

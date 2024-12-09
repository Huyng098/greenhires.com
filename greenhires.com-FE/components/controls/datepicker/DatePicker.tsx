import { isValidDate } from "@/lib/utils";
import {
  FormControl,
  IconButton,
  Input,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import {
  BaseSingleInputFieldProps,
  DatePicker,
  DateValidationError,
  FieldSection,
  LocalizationProvider,
  UseDateFieldProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";

interface FreeStyleInputFieldProps
  extends UseDateFieldProps<Dayjs>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      DateValidationError
    > {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onTextChange?: (value: string) => void;
}

const commonStyles = {
  focusedFieldset: {
    "& .Mui-focused fieldset": {
      border: "1px solid #19B2B9 !important",
    },
    "& label.Mui-focused": {
      color: "#19B2B9",
    },
  },
};

function MuiIcon() {
  return (
    <Image
      width={15}
      height={15}
      src="/icons/date.svg"
      alt="Date picker opening icon"
    />
  );
}

function FreeStyleInputField(props: FreeStyleInputFieldProps) {
  const {
    setOpen,
    onTextChange,
    onChange,
    label,
    value,
    InputProps: { ref } = {},
  } = props;

  const [textValue, setTextValue] = useState(
    isValidDate(value) ? dayjs(value).format("MM-YYYY") : value
  );

  useEffect(() => {
    setTextValue(isValidDate(value) ? dayjs(value).format("MM-YYYY") : value);
  }, [value]);

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor="custom-date-input">{label}</InputLabel>
      <OutlinedInput
        id="custom-date-input"
        ref={ref}
        label={label}
        value={textValue}
        onChange={(e) => {
          if (onTextChange) {
            setTextValue(e.target.value);
            onTextChange(e.target.value);
          }
        }}
        sx={{ ...commonStyles.focusedFieldset }}
        size="small"
        fullWidth
        endAdornment={
          <IconButton onClick={() => setOpen?.((prev) => !prev)}>
            <MuiIcon />
          </IconButton>
        }
      />
    </FormControl>
  );
}

export const DateInput = ({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange?: (value: any) => void;
  value?: any;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full bg-white">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          slots={{
            openPickerIcon: MuiIcon,
            field: FreeStyleInputField,
          }}
          slotProps={{
            field: {
              setOpen,
              onTextChange: onChange,
            } as any,
          }}
          label={label}
          value={value}
          onChange={onChange}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        />
      </LocalizationProvider>
    </div>
  );
};

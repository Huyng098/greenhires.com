import React, { FC, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IconButton } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { RichInput } from "../controls/texteditor";
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  DateView,
  FieldSection,
  LocalizationProvider,
  UseDateFieldProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CalendarDots } from "@phosphor-icons/react";

interface IProps {
  onInputChange: (value: string) => void;
  onDatePickerChange: (value: string) => void;
  value: string;
  placeholder: string;
  id: string;
  format: string;
  datePickerView?: DateView[];
}

interface ButtonFieldProps
  extends UseDateFieldProps<Dayjs>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      DateValidationError
    > {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonField = (props: ButtonFieldProps) => {
  const { setOpen, InputProps: { ref } = {} } = props;
  return (
    <IconButton onClick={() => setOpen?.((prev) => !prev)} ref={ref}>
      <CalendarDots size={32} />
    </IconButton>
  );
};

const FreeStyleDatePicker: FC<IProps> = ({
  onInputChange,
  onDatePickerChange,
  value,
  id,
  placeholder,
  format,
  datePickerView = ["year", "month"],
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    onDatePickerChange(dayjs(newValue).format(format));
  };

  return (
    <div className="flex gap-2 w-full">
      <RichInput
        content={value}
        id={id}
        isHasAIOption={false}
        hideToolbar={true}
        onChange={onInputChange}
        placeholder={placeholder}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={datePickerView}
          onChange={handleDateChange}
          value={selectedDate}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          slots={{ field: ButtonField }}
          slotProps={{ field: { setOpen } as any }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default FreeStyleDatePicker;

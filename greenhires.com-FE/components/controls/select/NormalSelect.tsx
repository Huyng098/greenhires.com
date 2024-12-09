import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const styles = {
  height: "46px",
  select: {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #19B2B9 !important",
    },
  },
  inputLabel: {
    "&.Mui-focused": {
      color: "#19B2B9",
    },
  },
};

interface ISelectNormalProps {
  id: string;
  options: any;
  placeholder: string;
  defaultValue?: any;
  isHideLabel?: boolean;
  onChange?: (e: any) => void;
}

export const ISelectNormal = ({
  id,
  options,
  placeholder,
  defaultValue,
  isHideLabel,
  onChange,
}: ISelectNormalProps) => {
  return (
    <FormControl fullWidth size="small">
      {!isHideLabel && (
        <InputLabel id={id} sx={styles.inputLabel}>
          {placeholder}
        </InputLabel>
      )}
      <Select
        id={id}
        label={!isHideLabel ? placeholder : undefined}
        onChange={onChange}
        defaultValue={defaultValue}
        sx={styles.select}
      >
        {isHideLabel && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option: any, index: number) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ISelectNormal;

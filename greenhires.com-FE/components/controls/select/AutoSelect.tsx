import { Autocomplete, TextField } from "@mui/material";
import { commonStyles } from "../input";

interface ISelectAutoCompleteProps {
    id: string;
    options: any;
    placeholder: string;
}

export const ISelectAutoComplete = ({ id, options, placeholder, ...props
} : ISelectAutoCompleteProps) => {
    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            {...props}
            options={options}
            sx={{ backgroundColor: "white" }}
            size="small"
            renderInput={(params) => 
            <TextField 
                {...params} 
                label={placeholder} 
                sx={{ ...commonStyles.focusedFieldset}} 
            />}
        />
    );
}

export default ISelectAutoComplete;
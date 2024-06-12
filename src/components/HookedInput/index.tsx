import { TextField } from "@mui/material";
import { useController } from "react-hook-form";

const HookedInput = ({name, defaultValue, control, rules, label, placeholder}: any) => {
    const { field, fieldState } = useController({ name, defaultValue, control, rules });
    return <TextField
              label={label}
              placeholder={placeholder}
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              sx={{ minWidth: 210 }}
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
}

export default HookedInput;
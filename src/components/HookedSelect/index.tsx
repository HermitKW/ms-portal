import { Select, SelectProps as MuiSelectProps, FormControl, InputLabel, SxProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form"

type HookedSelectProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> =
    Omit<ControllerProps<TFieldValues, TName>, "render"> & SelectProps & FormProps;

type SelectProps = MuiSelectProps<any>;

type FormProps = {
    sx?: SxProps<Theme>
};

const HookedSelectField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ control, name, rules, defaultValue, shouldUnregister, children, sx, ...selectProps }: HookedSelectProps<TFieldValues, TName>) => {
    return <FormControl variant="standard" sx={sx}>
        <InputLabel>{selectProps.label}</InputLabel>
        <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            shouldUnregister={shouldUnregister}
            render={(field) => {
                return <Select
                    {...selectProps}
                    {...field.field}
                >
                    {children}
                </Select>
            }}
        />
    </FormControl>
}

export default HookedSelectField;
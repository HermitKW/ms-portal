import { DatePicker, DatePickerProps } from "@mui/lab";
import { TextField } from "@mui/material";
import moment from "moment";
import { Controller, ControllerProps, FieldPath, FieldPathValue, FieldValues, RegisterOptions, UseControllerProps, Validate } from "react-hook-form";


type DateProp = DatePickerProps<Date> & React.RefAttributes<HTMLDivElement>;
export type HookedDatePickerProp<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> =
    Omit<ControllerProps<TFieldValues, TName>, "render"> & Omit<DateProp, "onChange" | "renderInput" | "value" | "children">;

const isFuncValidation = (validate: RegisterOptions['validate']): validate is Validate<Date> => {
    return typeof validate === "function";
}

const HookedDatePicker = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ control, name, shouldUnregister, defaultValue, rules, ...dateProps }: HookedDatePickerProp<TFieldValues, TName>) => {
    const isValidDate = (d: Date | null) => {
        return !d || moment(d).isValid() || "Please input a valid date";
    }
    let newValidate: RegisterOptions["validate"];
    if (isFuncValidation(rules?.validate)) {
        const validate = rules.validate;
        rules.validate = (value) => {
            const error = validate(value);
            if (typeof error === "string") {
                return error;
            }
            return isValidDate(value);
        }
        newValidate = rules.validate;
    } else {
        const validate = rules?.validate;
        newValidate = {
            ...validate,
            isValidDate,
        };
    }
    const newRules = {
        ...rules,
        validate: newValidate,
    };

    return <Controller
        control={control}
        name={name}
        shouldUnregister={shouldUnregister}
        rules={newRules}
        defaultValue={defaultValue}
        render={(formField) => {
            const { field: { ref, onBlur, name, ...field }, fieldState, formState } = formField;
            return <DatePicker
                {...dateProps}
                {...field}
                inputRef={ref}
                label={dateProps.label}
                renderInput={(inputProps) => (
                    <TextField
                        {...inputProps}
                        InputLabelProps={{ shrink: true }}
                        variant="standard"
                        onBlur={onBlur}
                        name={name}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        onChange={(e) => {
                            field.onChange(e);
                        }}
                    />
                )}
            />
        }}
    />

}

export default HookedDatePicker;
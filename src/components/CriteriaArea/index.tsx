import { Search } from "@mui/icons-material";
import { Button, Container, Grid, GridTypeMap, TablePagination } from "@mui/material";
import { SystemProps } from "@mui/system";
import { Theme } from "@mui/material/styles";
import React, { FunctionComponentElement, ReactElement, ReactNode, cloneElement, forwardRef, memo, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS } from "src/constants";
import { DeepPartial, DefaultValues, FieldValues, SubmitHandler, UseFormProps, UseFormReturn, useForm } from "react-hook-form";


export interface CriteriaItem {
    item: ReactElement;
    gridItemProps?: Omit<GridTypeMap["props"], "children" | "item"> & { gridClassName?: string };
}
interface CriteriaRow {
    row: CriteriaItem[];
    gridContainerProps?: Omit<GridTypeMap["props"], "children" | "item"> & { gridClassName?: string };
}
type LimitArray = readonly any[] & { length: 0 | 1 | 2 | 3 }

type LimitElement = readonly CriteriaItem[] & LimitArray;

export interface CriteriaAreaProps<TFieldValues extends FieldValues = FieldValues> {
    rows: CriteriaRow[];
    defaultValues: DefaultValues<TFieldValues>;
    onSubmit?: SubmitHandler<TFieldValues>;
}

const CriteriaArea = forwardRef(<TFieldValues extends FieldValues = FieldValues>({ rows, defaultValues, onSubmit }: CriteriaAreaProps<TFieldValues>, ref) => {
    const { control, handleSubmit, reset, getValues } = useForm({ defaultValues });
    useImperativeHandle(ref, () => {
        return {
            getValues,
        }
    });
    return <Container maxWidth={false} disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container' component={"form"} onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}>
        <Grid container rowSpacing={2}>
            {rows.map((row, i) => {
                const { gridClassName, ...containerProps } = row.gridContainerProps || {};
                return <Grid container item key={i} className={gridClassName} {...containerProps} >
                    {
                        row.row.map((v, i) => {
                            const { gridClassName, ...restProps } = v.gridItemProps || {};
                            return <Grid item key={i} {...restProps} className={gridClassName}>{cloneElement(v.item, { control })}</Grid>
                        })
                    }
                </Grid>
            })}
        </Grid>
    </Container>
})

export const CriteriaActions = () => {
    const { t } = useTranslation("common");
    return <>
            <Button
              variant="outlined"
              sx={{ marginRight: 1 }}
              size="medium"
              type="reset"
            >
              {t('reset')}
            </Button>
            <Button
              variant="contained"
              startIcon={<Search fontSize="small" />}
              size="medium"
              type='submit'
            >
              {t('search')}
            </Button>
          </>
}

export default memo(CriteriaArea);
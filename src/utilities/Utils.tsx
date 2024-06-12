import { FormHelperText } from "@mui/material"
import { map } from "lodash"

export const concatErrorMsg = (array) => {

    return (
        <>
            {
                map(array, (i, idx) => {
                    return (
                        <FormHelperText sx={{ margin: "0" }}>
                            {i + ";"}
                            {parseInt(idx) !== array.length - 1 && array.length > 1 ? (<br />) : null}
                        </FormHelperText>
                    )
                })
            }
        </>
    )
}

export type CatslasReturn<T> = {
    message: string
    result: T,
}
export type Countable<T> = {
    [K in keyof T]: T[K]
} & { count: number }

export type Order = 'asc' | 'desc';

export const concatErrorMsgWithErrorFormHelperText = (array) =>{
          
    return (
        <>
            {
                map(array,(i,idx)=>{
                    return (
                        <FormHelperText error sx={{margin: "0"}}>
                            {i + ";"}
                            {parseInt(idx) !== array.length - 1 && array.length > 1 ? (<br/>) : null }
                        </FormHelperText>    
                    )
                })
            }
        </>
    )
}

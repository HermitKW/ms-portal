import { AlertProps } from "@mui/material";
import React, { Dispatch, ReactNode, SetStateAction, useCallback, useState } from "react";
import SnackbarCustom from "../SnackbarCustom";

type GlobalSnackbarProps = {
    showSnackbar: boolean,
    snackbarSeverity: AlertProps["severity"],
    snackbarMsg: string,
};

type OpenSnackbarProps = {
    showSnackbar: true,
    snackbarSeverity: AlertProps["severity"],
    snackbarMsg: string,
}
type CloseSnackbarProps = {
    showSnackbar: false
}


export const GlobalSnackbarSetter = React.createContext<(property: OpenSnackbarProps | CloseSnackbarProps) => void>(null);

export const GlobalSnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [globalSnackbarProperty, setGlobalSnackbarInner] = useState<GlobalSnackbarProps>({
        showSnackbar: false,
        snackbarSeverity: "info",
        snackbarMsg: "",
    });
    const setGlobalSnackbar = useCallback((
        property: OpenSnackbarProps | CloseSnackbarProps
    ) => {
        setGlobalSnackbarInner(v => ({ ...v, ...property }));
    }, []);
    return <GlobalSnackbarSetter.Provider value={setGlobalSnackbar}>
        <SnackbarCustom {...globalSnackbarProperty} />
        {children}
    </GlobalSnackbarSetter.Provider>
}
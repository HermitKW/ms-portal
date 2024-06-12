import React from "react";

type GlobalTimeoutModalProvider = {
    globalTimeoutStart: boolean,
    setGlobalTimeoutStart: (data: boolean) => void,
    globalTimeoutLogoutSecondsConfig: number,
    setGlobalTimeoutLogoutSecondsConfig: (data: number) => void,
};

export const GlobalTimeoutModalContext = React.createContext<GlobalTimeoutModalProvider>(null);
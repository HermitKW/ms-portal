import React from "react";

type AuthenticateProvider = {
    isAuthenticated: boolean,
    setAuthenticated: (data: boolean) => void
};

export const authenticateContext = React.createContext<AuthenticateProvider>(null);



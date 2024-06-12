import React from "react";
import { UserQueryResult, UserAction } from "src/models/User";


type UserSearchProvider = {
    userAction: UserAction,
    setUserAction: (data: UserAction) => void
};

export const UserSearchContext = React.createContext<UserSearchProvider>(null);



import React from "react";
import { UserQueryResult } from "src/models/User";


type UserSearchProvider = {
    userQueryResultList: UserQueryResult[],
    setUserQueryResultList: (data: UserQueryResult[]) => void
};

export const UserSearchContext = React.createContext<UserSearchProvider>(null);



import React from "react";
import { UserSearchCriteria } from "src/models/User";

type UserSearchCriteriaProvider = {
    userSearchCriteria: UserSearchCriteria,
    setUserSearchCriteria: (data: UserSearchCriteria) => void,
};

export const UserSearchCriteriaContext = React.createContext<UserSearchCriteriaProvider>(null);


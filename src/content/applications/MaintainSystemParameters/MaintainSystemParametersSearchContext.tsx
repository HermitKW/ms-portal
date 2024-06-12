import React from "react";
import { ParameterQueryResult } from "src/models/Parameter";


type ParameterSearchProvider = {
    parameterQueryResultList: ParameterQueryResult[],
    setParameterQueryResultList: (data: ParameterQueryResult[]) => void
};

export const ParameterSearchContext = React.createContext<ParameterSearchProvider>(null);



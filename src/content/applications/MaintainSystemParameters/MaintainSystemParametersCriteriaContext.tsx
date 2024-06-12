import React from "react";
import { ParameterSearchCriteria } from "src/models/Parameter";

type ParameterSearchCriteriaProvider = {
    parameterSearchCriteria: ParameterSearchCriteria,
    setParameterSearchCriteria: (data: ParameterSearchCriteria) => void,
};

export const ParameterSearchCriteriaContext = React.createContext<ParameterSearchCriteriaProvider>(null);


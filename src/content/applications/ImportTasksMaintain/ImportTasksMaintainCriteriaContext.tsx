import React from "react";
import { ImportTasksMaintainSearchCriteria } from "src/models/ImportTasksMaintain";

type ImportTasksMaintainSearchCriteriaProvider = {
    importTasksMaintainSearchCriteria: ImportTasksMaintainSearchCriteria,
    setImportTasksMaintainSearchCriteria: (data: ImportTasksMaintainSearchCriteria) => void,
};

export const ImportTasksMaintainSearchCriteriaContext = React.createContext<ImportTasksMaintainSearchCriteriaProvider>(null);


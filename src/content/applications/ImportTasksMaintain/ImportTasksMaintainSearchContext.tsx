import React from "react";
import { ImportTasksMaintainQueryResult } from "src/models/ImportTasksMaintain";


type ImportTasksMaintainSearchProvider = {
    importTasksMaintainQueryResultList: ImportTasksMaintainQueryResult[],
    setImportTasksMaintainQueryResultList: (data: ImportTasksMaintainQueryResult[]) => void
};

export const ImportTasksMaintainSearchContext = React.createContext<ImportTasksMaintainSearchProvider>(null);



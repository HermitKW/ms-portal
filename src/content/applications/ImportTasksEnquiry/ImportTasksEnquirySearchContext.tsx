import React from "react";
import { ImportTasksEnquiryQueryResult } from "src/models/ImportTasksEnquiry";


type ImportTasksEnquirySearchProvider = {
    importTasksEnquiryQueryResultList: ImportTasksEnquiryQueryResult[],
    setImportTasksEnquiryQueryResultList: (data: ImportTasksEnquiryQueryResult[]) => void
};

export const ImportTasksEnquirySearchContext = React.createContext<ImportTasksEnquirySearchProvider>(null);



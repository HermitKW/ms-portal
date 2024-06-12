import React from "react";
import { ImportTasksEnquirySearchCriteria } from "src/models/ImportTasksEnquiry";

type ImportTasksEnquirySearchCriteriaProvider = {
    importTasksEnquirySearchCriteria: ImportTasksEnquirySearchCriteria,
    setImportTasksEnquirySearchCriteria: (data: ImportTasksEnquirySearchCriteria) => void,
};

export const ImportTasksEnquirySearchCriteriaContext = React.createContext<ImportTasksEnquirySearchCriteriaProvider>(null);


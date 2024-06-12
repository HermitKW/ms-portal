import React from "react";
import { DocumentClassSearchCriteria } from "src/models/DocumentClass";

type MaintainDocumentClassSearchCriteriaProvider = {
    documentClassSearchCriteria: DocumentClassSearchCriteria,
    setDocumentClassSearchCriteria: (data: DocumentClassSearchCriteria) => void,
};

export const MaintainDocumentClassSearchCriteriaContext = React.createContext<MaintainDocumentClassSearchCriteriaProvider>(null);


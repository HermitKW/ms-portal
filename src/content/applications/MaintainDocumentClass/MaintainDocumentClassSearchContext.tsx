import React from "react";
import { DocumentClassQueryResult } from "src/models/DocumentClass";


type MaintainDocumentClassSearchProvider = {
    documentClassQueryResultList: DocumentClassQueryResult,
    setDocumentClassQueryResultList: (data: DocumentClassQueryResult[]) => void
};

export const MaintainDocumentClassSearchContext = React.createContext<MaintainDocumentClassSearchProvider>(null);



import React from "react";
import { FileQueryResult } from "src/models/File";


type FileSearchProvider = {
    fileQueryResultList: FileQueryResult[],
    setFileQueryResultList: (data: FileQueryResult[]) => void
};

export const FileSearchContext = React.createContext<FileSearchProvider>(null);



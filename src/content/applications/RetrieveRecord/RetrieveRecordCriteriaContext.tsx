import React from "react";
import { FileSearchCriteria } from "src/models/File";

type FileSearchCriteriaProvider = {
    fileSearchCriteria: FileSearchCriteria,
    setFileSearchCriteria: (data: FileSearchCriteria) => void,
};

export const FileSearchCriteriaContext = React.createContext<FileSearchCriteriaProvider>(null);


import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';


export type FileQueryResult = {
    id: string;
    fileName: string;
    fileFormat: string;
    fileSize: string;
    importDate: string;
    createDate: string;
};

export type FileSearchCriteria = {
    fileName: string;
    fileFormat: string;
    searchFromImportDate: string;
    searchToImportDate: string;
    searchFromCreateDate: string;
    searchToCreateDate: string;
    page?: number,
    limit?: number,
    count?: number,
    fileList?: FileQueryResult[]
}

export const emptyFileSearchCriteria: FileSearchCriteria = {
    fileName: '',
    fileFormat: '',
    searchFromImportDate: '',
    searchToImportDate: '',
    searchFromCreateDate: '',
    searchToCreateDate: '',
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    count: 0,
    fileList: []
}
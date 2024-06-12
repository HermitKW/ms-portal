import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';


export type ImportTasksEnquiryQueryResult = {
    documentClass: string;
    frequency: string;
    actionDate: string;
    status: string;
};

export type ImportTasksEnquirySearchCriteria = {
    documentClass: string;
    status: string;
    dateFrom: string;
    dateTo: string;
    page?: number,
    limit?: number,
    count?: number,
    importTasksEnquiryList?: ImportTasksEnquiryQueryResult[]
}

export const emptyImportTasksEnquirySearchCriteria: ImportTasksEnquirySearchCriteria = {
    documentClass: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    count: 0,
    importTasksEnquiryList: []
}
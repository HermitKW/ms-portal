import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';

export type DocumentClassQueryResult = {
    documentClass: string;
    name: string;
    code: string;
    description: string;
    maxsize: number;
    retentionPeriod: number;
    retentionPeriodUnitSelected: number;
    importingPath: string;
    defaultGrantedTimePeriod: number;
    notificationBeforeRetentionPeriod: number;
    notificationForSuccess: number;
    emailList: string[];
    extendedRetentionPeriod: number;
    updateTime: Date;
};

export type DocumentClassSearchCriteria = {
    docName: string;
    docId:string;
    docDesc: string;
    page?: number,
    limit?: number,
    count?: number,
    documentClassList?: DocumentClassQueryResult[]
}

export const emptyFileSearchCriteria: DocumentClassSearchCriteria = {
    docName: "",
    docId:"",
    docDesc: "",
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    count: 0,
    documentClassList: []
}
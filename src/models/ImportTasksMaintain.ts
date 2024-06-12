import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';


export type ImportTasksMaintainQueryResult = {
    name: string;
    documentClass: string;
    frequency: string;
    details: string;
};

export type ImportTasksMaintainSearchCriteria = {
    documentClass: string;
    page?: number,
    limit?: number,
    count?: number,
    importTasksMaintainList?: ImportTasksMaintainQueryResult[]
}

export const emptyImportTasksMaintainSearchCriteria: ImportTasksMaintainSearchCriteria = {
    documentClass: '',
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    count: 0,
    importTasksMaintainList: []
}



export type ImportJobMaintainQueryResult = {
    impJobId: string;
    impJobName: string;
    docClassId: string;
    impJobFrequency: string;
    minutes: string;
    hours: string;
    day: string;
    dayOfWeek: string;
    onetimeDatetime: string;
    details: string;
};

export const emptyImportJobMaintainQueryResult: ImportJobMaintainQueryResult = {
    impJobId: '',
    impJobName: '',
    docClassId: '',
    impJobFrequency: '',
    minutes: '',
    hours: '',
    day: '',
    dayOfWeek: '',
    onetimeDatetime: '',
    details: '',
}

export type ImportJobEditView = {
    impJobId: string;
    impJobName: string;
    docClassId: string;
    impJobFrequency: string;
    minutes: string;
    hours: string;
    day: string;
    dayOfWeek: string;
    onetimeDatetime: string;
    details: string;
    updateTime: Date; 
};

export const emptyImportJobEditView: ImportJobEditView = {
    impJobId: '',
    impJobName: '',
    docClassId: '',
    impJobFrequency: '',
    minutes: '',
    hours: '',
    day: '',
    dayOfWeek: '',
    onetimeDatetime: '',
    details: '',
    updateTime: null,
}
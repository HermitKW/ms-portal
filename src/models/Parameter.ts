import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';


export type ParameterQueryResult = {
    id: string;
    description: string;
    value: number;
};

export type ParameterSearchCriteria = {
    id: string;
    description: string;
    page?: number,
    limit?: number,
    count?: number,
    parameterList?: ParameterQueryResult[]
}

export const emptyParameterSearchCriteria: ParameterSearchCriteria = {
    id: '',
    description: '',
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    count: 0,
    parameterList: []
}
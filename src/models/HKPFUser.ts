import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';

export type HKPFUser = {
    rank: string;
    designation: string;
    location: string;
    ui: string;
    userGroupIdList: number[];
    status: string;
    akPost: number;
}

export type HKPFUserQueryResult = {
    rank: string;
    designation: string;
    location: string;
    ui: string;
    userGroupIdList: number[];
    status: string;
    akPost: number;
};

export type HKPFUserGroup = {
    id: number;
    description: string
}



export type HKPFUserSearchCriteria = {
    rank?: String;
    designation?: String;
    location?: String;
    ui?: String;
    userGroupId?: string | number;
    status?: String;
    akPost?: String;
    page?: number,
    limit?: number,
    count?: number,
    hkpfUserList?: HKPFUserQueryResult[]
};


export const emptyHKPFUserSearchCriteria: HKPFUserSearchCriteria = {
    rank: '',
    designation: '',
    location: '',
    ui: '',
    userGroupId: "",
    status: "ALL",
    akPost: '',
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    count: 0,
    hkpfUserList: []
}
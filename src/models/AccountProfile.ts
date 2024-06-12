import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';


export type AccountProfile = {
    id: string;
    accId: string;
    accUi: string;
    accName: string;
    accPost: string;
    accEmail: string;
    accStatus?: string;
    teamId?: string;
    createTime?: string;
    createBy?: string;
    updateTime?: string;
    updateBy?: string;
    deleted?: string;
    deleteTime?: string;
    deleteBy?: string;
}

export type AccountProfileQueryResult = AccountProfile & {
    
};

export type ImportUserInfo = {
    showResultPopUp?: boolean;
    additionInfo?: string;
    errorMessage?: string;
    showLoader?: boolean;
    totalRecordCount?: string;
    validCount?: string;
    invalidCount?: string;
    importResult?: string;
    successImported?: boolean;
}

export const emptyImportUserInfo: ImportUserInfo = {
    showResultPopUp: false,
    additionInfo: '',
    errorMessage: '',
    showLoader: false,
    totalRecordCount: '',
    validCount: '',
    invalidCount: '',
    importResult: '',
    successImported: false,
}


export type UserSearchCriteria = {
    username: string;
    staffName: string;
    staffEmail: string;
    page?: number,
    limit?: number,
    count?: number,

}

export const emptyUserSearchCriteria: UserSearchCriteria = {
    username: '',
    staffName: '',
    staffEmail: '',
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    count: 0,
}


export type UserProfileError = {
    ui?: any;
    name?: any;
    post?: any;
    team?: any;
    email?: any;
    status?: any;
    userRole?: any;

}

export const emptyUserProfileError: UserProfileError = {
    ui: '',
    name: '',
    post: '',
    team: '',
    email: '',
    status: '',
    userRole: '',
}




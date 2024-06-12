import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';


export type User = {
    id: string;
    username: string;
    staffName: string;
    staffEmail: string;
    staffPhoneNo: string;
    password: string;
    corpId?: string;
    userGroupIdList?: number[];
}

export type UserQueryResult = {
    id: string;
    username: string;
    staffName: string;
    staffEmail: string;
    staffPhoneNo: string;
    corpId?: string;
    locked: boolean;
    corpName: string;
    disabled: boolean;
};

export type UserAction = {
    limit?: number;
};

export const emptyUserAction: UserAction = {
    limit: DEFAULT_ROWS_PER_PAGE,
}

export type ImportUser = {
    id: string;
    username: string;
    staffName: string;
    staffEmail: string;
    staffPhoneNo: string;
    password: string;
    corpId?: string;
    type?: string;
    userGroupIdList?: number[];
    usernameCorrect: Boolean;
    staffNameCorrect: Boolean;
    emailCorrect: Boolean;
    phoneNumberCorrect: Boolean;
    corporateCorrect: Boolean;
    typeCorrect: Boolean;
    passwordCorrect: Boolean;
};

export type ImportUserQueryResult = {
    id: string;
    username?: string;
    staffName?: string;
    staffEmail?: string;
    staffPhoneNo?: string;
    password?: string;
    originalPassword?: string;
    corpId?: string;
    corporateName?: string;
    type?: string;
    userNameCorrect?: Boolean;
    staffNameCorrect?: Boolean;
    emailCorrect?: Boolean;
    phoneNumberCorrect?: Boolean;
    corporateCorrect?: Boolean;
    typeCorrect?: Boolean;
    passwordCorrect?: Boolean;
    usernameErrorMessage?: string;
    staffNameErrorMessage?: string;
    emailErrorMessage?: string;
    phoneNumberErrorMessage?: string;
    corporateErrorMessage?: string;
    typeErrorMessage?: string;
    passwordErrorMessage?: string;
    activeUserCount?: number;
    activeManagerCount?: number;
    managerAccountAllow?: number;
    userAccountAllow?: number;
    addManagerAccount?: number;
    addUserAccount?: number;
    corporateManagerAccountLimitError?: Boolean;
    corporateUserAccountLimitError?: Boolean;
    
};
export type UserGroup = {
    id: number;
    description: string
}

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
    userList?: UserQueryResult[]
}

export const emptyUserSearchCriteria: UserSearchCriteria = {
    username: '',
    staffName: '',
    staffEmail: '',
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    count: 0,
    userList: []
}
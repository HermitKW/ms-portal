import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';


export type UserDocumentClassQueryResult = {
    id: number;
    usdId: number | string;
    usdReqNo: string;
    usdUsrId: string;
    usdUsrUi: string;
    usdDocClass: string;
    usdRolId: string;
    usdStatus: string;
    usdAccessStime: Date;
    usdAccessEtime: Date;
    importDateFrom: Date;
    importDateTo: Date;
    usdApproveBy: string;
    usdApproveDate: Date;
    usdGrantBy: string;
    usdGrantDate: Date;
    usdReason: string;
    usdRejectBy: string;
    usdRejectDate: Date;
    usdRevokeBy: string;
    usdRevokeDate: Date;
    createTime: Date;
    updateTime: Date;
};

export type AccessRightRequestViewResponse = {
    usdId: number;
    updateTime: Date;
    usdStatus: string;
    usdDocClass: string;
    usdAccessStime: Date;
    usdAccessEtime: Date;
    usdImportDateFrom: Date;
    usdImportDateTo: Date;
    usdReason: string;
    createBy: string;
    createTime: Date;
    usdGrantBy: string;
    usdGrantDate: Date;
    usdRevokeBy: string;
    usdRevokeDate: Date;
    usdApproveBy: string;
    usdApproveDate: Date;
    usdRejectBy: string;
    usdRejectDate: Date;
    remarksSupport: string;
    remarksUnsupport: string;
    remarksApprove: string;
    remarksReject: string;
};

export const emptyAccessRightRequestViewResponse: AccessRightRequestViewResponse = {
    usdId: 0,
    updateTime: null,
    usdStatus: "",
    usdDocClass: "",
    usdAccessStime: null,
    usdAccessEtime: null,
    usdImportDateFrom: null,
    usdImportDateTo: null,
    usdReason: "",
    createBy: "",
    createTime: null,
    usdGrantBy: "",
    usdGrantDate: null,
    usdRevokeBy: "",
    usdRevokeDate: null,
    usdApproveBy: "",
    usdApproveDate: null,
    usdRejectBy: "",
    usdRejectDate: null,
    remarksSupport: "",
    remarksUnsupport: "",
    remarksApprove: "",
    remarksReject: "",
}

export type UserDocumentClassSearchCriteria = {
    requestNo: string;
    documentClass: string;
    status: string;
    accessDateFrom: Date;
    accessDateTo: Date;
    importDateFrom: Date;
    importDateTo: Date;
    page?: number,
    limit?: number,
}

export const emptyFileSearchCriteria: UserDocumentClassSearchCriteria = {
    requestNo: "",
    documentClass: "",
    status: "",
    accessDateFrom: null,
    accessDateTo: null,
    importDateFrom: null,
    importDateTo: null,
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
}

export type AccessRightRequestInput = {
    documentClassInput: string;
    accessDateFromInput: Date;
    accessDateToInput: Date;
    importDateFromInput: Date;
    importDateToInput: Date;
    requestReasonInput: string;
}

export const emptyAccessRightRequestInput: AccessRightRequestInput = {
    documentClassInput: "",
    accessDateFromInput: null,
    accessDateToInput: null,
    importDateFromInput: null,
    importDateToInput: null,
    requestReasonInput: "",
}


export type VerifyRightRequestViewResponse = AccessRightRequestViewResponse & {

};

export const emptyVerifyRightRequestViewResponse: VerifyRightRequestViewResponse = {
    usdId: 0,
    updateTime: null,
    usdStatus: "",
    usdDocClass: "",
    usdAccessStime: null,
    usdAccessEtime: null,
    usdImportDateFrom: null,
    usdImportDateTo: null,
    usdReason: "",
    createBy: "",
    createTime: null,
    usdGrantBy: "",
    usdGrantDate: null,
    usdRevokeBy: "",
    usdRevokeDate: null,
    usdApproveBy: "",
    usdApproveDate: null,
    usdRejectBy: "",
    usdRejectDate: null,
    remarksSupport: "",
    remarksUnsupport: "",
    remarksApprove: "",
    remarksReject: "",
}

export type ApproveRightRequestViewResponse = AccessRightRequestViewResponse & {
    
};

export const emptyApproveRightRequestViewResponse: ApproveRightRequestViewResponse = {
    usdId: 0,
    updateTime: null,
    usdStatus: "",
    usdDocClass: "",
    usdAccessStime: null,
    usdAccessEtime: null,
    usdImportDateFrom: null,
    usdImportDateTo: null,
    usdReason: "",
    createBy: "",
    createTime: null,
    usdGrantBy: "",
    usdGrantDate: null,
    usdRevokeBy: "",
    usdRevokeDate: null,
    usdApproveBy: "",
    usdApproveDate: null,
    usdRejectBy: "",
    usdRejectDate: null,
    remarksSupport: "",
    remarksUnsupport: "",
    remarksApprove: "",
    remarksReject: "",
}
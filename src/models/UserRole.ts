import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';


export type UserRole = {
    id: string;
    usrNo: string;
    usrId: string;
    usrRolId: string;
    usrDcId: string;
    createTime?: string;
    createBy?: string;
    updateTime?: string;
    updateBy?: string;
    deleted?: string;
    deleteTime?: string;
    deleteBy?: string;
}

export type UserRoleDisplay = {
    id?: string;
    usrId?: string;
    usrRolId?: string;
    usrDcId?: string;
    updateTime?: string;
}
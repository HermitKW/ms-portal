import React from "react";

export type UserInfo = {
    // userId?: number;
    // corpId?: string;
    // lastLoginTs?: string;
    // staffName?: string;
    // phoneNumber?: string;
    // email?: string;
    // postingDesc?: string;
    privilegesMap?: any;
    accId?: number;
    accUi?: string;
    accName?: string;
    accPost?: string;
    accEmail?: string;
}

type UserInfoProvider = {
    userInfo: UserInfo,
    setUserInfo?: (data: UserInfo) => void,
    reloadUserInfo?: boolean,
    setReloadUserInfo?: (data: boolean) => void
};


export const emptyUserInfo = {
    privilegesMap: {}
}

export const UserInfoContext = React.createContext<UserInfoProvider>({
    userInfo: {privilegesMap: {}}}
)

// export function checkPrivilege(privilegesMap : any, userCode: string){
//     return {
//       canDelete: privilegesMap && privilegesMap[userCode]?.canDelete,
//       canView: privilegesMap && privilegesMap[userCode]?.canView,
//       canUpdate: privilegesMap && privilegesMap[userCode]?.canUpdate,
//       canCreate: privilegesMap && privilegesMap[userCode]?.canCreate,
//     }
//   }

  export function checkPrivilege(privilegesMap : any, userCode: string){
    return {
      hasPrivilege: privilegesMap && privilegesMap[userCode],
      documentClassIdList: privilegesMap?.[userCode],
    }
  }


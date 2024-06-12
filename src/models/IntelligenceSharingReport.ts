export type IntelligenceSharingReport = {
    corpNameEng: string,
    corpNameCn: string,
    corpUniId: string,
    incorpPlaceId: string,
    others: string,
    rptNumber: string,
    bizRegNo: string,
  
    fraudCategory: FraudCategory[],
    fraudType: FraudType[],
    fraudSuspdOthers: string,
    sources: Sources[],
    suspReasonId: string,
    suspReasonOthers: string,
    transactions: Transaction[],
    observations: string,
    lastUpdatedTsStr: string,
  
    bankContactName: string,
    sharingBankContactName: string,
    bankContactEmail: string,
    bankContactNumber: string,
    draft: boolean,
    lstRptVrsId?: number,
    submitAnonymous: boolean,
    
    id?: number;
}

export type IdCodeField = {
    id: string,
    code: string
}

export type Sources = IdCodeField;

export type FraudType = IdCodeField

export type FraudCategory = IdCodeField

export const emptyIntelligenceSharingReport: IntelligenceSharingReport = {
    corpNameEng: '',
    corpNameCn: '',
    corpUniId: '',
    incorpPlaceId: '',
    others: '',
    rptNumber: '',
    lastUpdatedTsStr: '',
    bizRegNo: '',
    draft: false,
  
    fraudType: [{id: "", code: ""}],
    fraudCategory: [{id: "", code: ""}],
    fraudSuspdOthers: '',
    sources: [{id: "", code: ""}],
    suspReasonId: '',
    suspReasonOthers: '',
    transactions: [],
    observations: '',
    submitAnonymous: false,
  
    bankContactName: '',
    sharingBankContactName: '',
    bankContactEmail: '',
    bankContactNumber: ''
};

export type Transaction = {
    id: string, 
    currencyId: string,
    amount: number | null,
    corpType: string,
    fromDate: string | null,
    toDate: string | null,
    bankId: string,
    corpName: string,
    accountBankCode: string,
    accountBranchCode: string,
    accountNumber: string
};

export const emptyTransaction: Transaction = {
    id: '',
    currencyId: '',
    amount: null,
    fromDate: null,
    toDate: null,
    bankId: '',
    corpType: '',
    corpName: '',
    accountBankCode: '',
    accountBranchCode: '',
    accountNumber: ''
}

export type CounterpartyBankEmailOption = {
    bankId: string,
    checked: boolean
}
  
export type TransactionData = {
    id: string;
    currencyId: string;
    amount: string | null;
    fromDate: string | null;
    toDate: string | null;
    bankId: string;
    corpType: string;
    accountBankCode: string;
    accountBranchCode: string;
    accountNumber: string;
    corpName: string;
  }
  

export type TransactionError = {
    id?: string, 
    currencyId?: string,
    amount?: string,
    corpType?: string,
    fromDate?: string,
    toDate?: string,
    bankId?: string,
    corpName?: string,
    accountBankCode?: string,
    accountBranchCode?: string,
    accountNumber?: string
};
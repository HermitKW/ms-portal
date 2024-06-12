
export type CounterpartyBankQueryResult = {
    id: number;
    code: string;
    description: string;
    status: string;
    managerAccountAllow: number
    userAccountAllow: number
    finestUser: boolean
};
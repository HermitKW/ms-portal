import { string } from "prop-types";

export type FraudCategoryAndTypeQueryResult = {
    idFraudCategory: number,
    idFraudType?: number,
    typeFraudCategory: string,
    codeFraudCategory: string,
    descriptionFraudCategory: string,
    statusFraudCategory: string,
    orderFraudCategory?: number,
    codeFraudType?: string,
    descriptionFraudType?: string,
    statusFraudType?: string,
    orderFraudType?: number
};
import moment, { Moment } from 'moment';
import { DEFAULT_ROWS_PER_PAGE } from 'src/constants';
import { IntelligenceSharingReport } from 'src/models/IntelligenceSharingReport';

export type IntelligenceSharingReportSearchCriteria = {
    corporateNameCriteria?: string,
    bizRegNoCriteria?: string,
    comRegNumCriteria?: string,
    rptNoCriteria?: string,
    page?: number,
    limit?: number,
    isCorporateNameExactSearch?: boolean,
    searchFromDate?: Moment,
    searchToDate?: Moment,
    count?: number,
    reportList?: IntelligenceSharingReport[]
}

export const emptyIntelligenceSharingReportSearchCriteria: IntelligenceSharingReportSearchCriteria = {
    corporateNameCriteria: '',
    bizRegNoCriteria: '',
    comRegNumCriteria: '',
    rptNoCriteria: '',
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    isCorporateNameExactSearch: false,
    searchFromDate: null,
    searchToDate: null,
    count: 0,
    reportList: []
}

export type OurIntelligenceSharingReportSearchCriteria = {
    corporateNameCriteria?: string,
    bizRegNoCriteria?: string,
    comRegNumCriteria?: string,
    rptNoCriteria?: string,
    page?: number,
    limit?: number,
    isCorporateNameExactSearch?: boolean,
    searchFromDate?: Moment,
    searchToDate?: Moment,
    count?: number,
    reportList?: IntelligenceSharingReport[]
}

export const emptyOurIntelligenceSharingReportSearchCriteria: OurIntelligenceSharingReportSearchCriteria = {
    corporateNameCriteria: '',
    bizRegNoCriteria: '',
    comRegNumCriteria: '',
    rptNoCriteria: '',
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    isCorporateNameExactSearch: false,
    searchFromDate: null,
    searchToDate: null,
    count: 0,
    reportList: []
}

export type RelatedIntelligenceSharingReportSearchCriteria = {
    corporateNameCriteria?: string,
    bizRegNoCriteria?: string,
    comRegNumCriteria?: string,
    rptNoCriteria?: string,
    page?: number,
    limit?: number,
    isCorporateNameExactSearch?: boolean,
    searchFromDate?: Moment,
    searchToDate?: Moment,
    count?: number,
    reportList?: IntelligenceSharingReport[]
}

export const emptyRelatedIntelligenceSharingReportSearchCriteria: RelatedIntelligenceSharingReportSearchCriteria = {
    corporateNameCriteria: '',
    bizRegNoCriteria: '',
    comRegNumCriteria: '',
    rptNoCriteria: '',
    page: 0,
    limit: DEFAULT_ROWS_PER_PAGE,
    isCorporateNameExactSearch: false,
    searchFromDate: null,
    searchToDate: null,
    count: 0,
    reportList: []
}
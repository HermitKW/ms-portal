import React from "react";
import { IntelligenceSharingReport } from "src/models/IntelligenceSharingReport";

type IntelligenceSharingReportSearchProvider = {
    submitterInformationRequestQueryResultList: IntelligenceSharingReport[],
    setSubmitterInformationRequestQueryResultList: (data: IntelligenceSharingReport[]) => void
};

export const SubmitterInformationRequestContext = React.createContext<IntelligenceSharingReportSearchProvider>(null);



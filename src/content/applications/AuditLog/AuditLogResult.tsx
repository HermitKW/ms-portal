import { Card } from '@mui/material';
import { subDays } from 'date-fns';
import IntelligenceSharingReportResultTable from './AuditLogResultTable';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { LocalLaundryServiceSharp } from '@mui/icons-material';
import { StrReport } from 'src/models/StrReport';
import { IntelligenceSharingReport } from 'src/models/IntelligenceSharingReport';
import { SubmitterInformationRequestContext } from './AuditLogContext';



function IntelligenceSharingReportResult({children}) {
  return (
    <Card>
      {children}
    </Card>
  );
}

export default IntelligenceSharingReportResult;

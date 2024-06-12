import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import IntelligenceSharingReportResult from './AuditLogResult';
import IntelligenceSharingReportResultTable from './AuditLogResultTable';
import SubmitterInformationRequestSearchTable from './AuditLogResultTable';
import { ENV_NAME } from 'src/constants';

function IntelligenceSharingReport() {

  var pageTitle: string;

  return (
    <>
      <Helmet>
        <title>
          {ENV_NAME}  CATSLAS - Audit Log
         
        </title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader pageTitle={pageTitle} />
      </PageTitleWrapper>
      <Container maxWidth={false}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <IntelligenceSharingReportResult>
              <SubmitterInformationRequestSearchTable/>
            </IntelligenceSharingReportResult>
          </Grid>
        </Grid>
      </Container>
      <Footer/>
    </>
  );
}

export default IntelligenceSharingReport;

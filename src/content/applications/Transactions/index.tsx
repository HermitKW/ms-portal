import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import { ENV_NAME } from 'src/constants';

function ApplicationsTransactions() {
  return (
    <>
      <Helmet>
        <title>{ENV_NAME}Transactions - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ApplicationsTransactions;

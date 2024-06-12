import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import OnlineHelpResult from './OnlineHelpResult';
import { ENV_NAME } from 'src/constants';

function OnlineHelp() {

  var pageTitle: string;

  return (
    <>
      <Helmet>
        <title>
          {ENV_NAME}  CATSLAS - Online Help
         
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
            <OnlineHelpResult/>
          </Grid>
        </Grid>
      </Container>
      <Footer/>
    </>
  );
}

export default OnlineHelp;

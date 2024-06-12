import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import { ENV_NAME, USER_CONFIG_SERVICE_URL } from 'src/constants';
import CaseParticularResult from './CaseParticularResult';


function CaseParticular({}) {

  var pageTitle: string;
  
  return (
    <>
      <Helmet>
        <title>
          {ENV_NAME}
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
              <CaseParticularResult />
            </Grid>
        </Grid>
       
      </Container>
      <Footer/>
    </>
  );
}

export default CaseParticular;

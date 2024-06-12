import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Modal, Box, CardContent, Card, Typography, AccordionSummary, Accordion, AccordionDetails, Button } from '@mui/material';
import Footer from 'src/components/Footer';

import VerifyAccessRightResult from './VerifyAccessRightResult';
import { ENV_NAME } from 'src/constants';
import { useContext } from 'react';
import { Check, DoDisturb } from '@mui/icons-material';
import { useNavigate } from 'react-router';

function Users() {

  const navigateNew = useNavigate();

  const clickCancel = ()=>{
    navigateNew('/intelligence-sharing-report/search');
  }

  return (
    <>
      <Helmet>
        <title>{ENV_NAME}CATSLAS - Grant Access Right and Query</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
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
            <VerifyAccessRightResult />
          </Grid>
        </Grid>
      </Container>
      <Footer/>
    </>
  );
}

export default Users;

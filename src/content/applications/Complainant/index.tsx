import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Modal, Box, CardContent, Card, Accordion, AccordionSummary, AccordionDetails, Typography, Button, Select, MenuItem, TextField, InputLabel, FormControl, AppBar, Toolbar } from '@mui/material';
import Footer from 'src/components/Footer';

import { ENV_NAME, USER_CONFIG_SERVICE_URL } from 'src/constants';
import { Check, DoDisturb, Height, Padding } from '@mui/icons-material';
import { useContext, useEffect, useState, ChangeEvent } from 'react';
import DatePicker from "@mui/lab/DatePicker";
import moment, { Moment } from 'moment';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';

function IntelligenceSharingReport() {

  var pageTitle: string;
  
  return (
    <>
      <Helmet>
        <title>
          {ENV_NAME}
        </title>
      </Helmet>
      {/* <PageTitleWrapper>
        <PageHeader pageTitle={pageTitle} />
      </PageTitleWrapper> */}
      <Container maxWidth={false}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
            <Grid item xs={12}>
              {/* <ComplainantResultTable /> */}
            </Grid>
        </Grid>
       
      </Container>
      <Footer/>
    </>
  );
}

export default IntelligenceSharingReport;

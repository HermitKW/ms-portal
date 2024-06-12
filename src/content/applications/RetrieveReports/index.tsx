import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Modal, Box, CardContent, Card, Accordion, AccordionSummary, AccordionDetails, Typography, Button, Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';
import Footer from 'src/components/Footer';
import customAxios from '../../../utilities/CustomAxios';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { ENV_NAME, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from 'src/constants';
import { useContext, useEffect, useState, ChangeEvent, Component } from 'react';
import RetrieveReportsResult from './RetrieveReportsResult';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface dataTemp {
  rptId: string;
  rptName: string;
}

function RetrieveReports({ }) {
  const [orderField, setOrderField] = useState('');
  const [orderByMapped, setOrderByMapped] = useState('');
  const [reportMap, setReportMap] = useState<dataTemp[]>(null);
  useEffect(() => {
    async function fetchReportData() {
      globalPageLoadSetter(true);
      const reportData = await customAxios.get(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/reports?orderField=${orderField}&&orderByMapped=${orderByMapped}`, {
      });
      globalPageLoadSetter(false);
      setReportMap(reportData.data.result);
    }
    fetchReportData();
    setReportMap([{rptId: "RGR_001", rptName: "Import Utilization Report"}]);
  }, []);

  const globalPageLoadSetter = useContext(SetPageLoaderContext);

  const { t } = useTranslation('retrieveReports')

  return (
    <>
      <Helmet>
        <title>
          {ENV_NAME}CATSLAS - Reports
        </title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader pageTitle={t('reports')} />
      </PageTitleWrapper>
      <Container maxWidth={false}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}>

          <Grid item xs={12}>
            <RetrieveReportsResult reportMap={reportMap} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default RetrieveReports;

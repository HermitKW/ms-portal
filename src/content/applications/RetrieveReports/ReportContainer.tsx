import { Helmet } from "react-helmet-async"
import { Outlet, useNavigate, useParams } from "react-router";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { ENV_NAME, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from 'src/constants';
import PageHeader from "./PageHeader";
import { Card, Container, Grid } from "@mui/material";
import Footer from "src/components/Footer";
import { useTranslation } from "react-i18next";
import RGR001ResultTable from "./RGR001ResultTable";
import RGR003ResultTable from "./RGR003ResultTable";
import RGR004ResultTable from "./RGR004ResultTable";
import RGR005ResultTable from "./RGR005ResultTable";
import RGR006ResultTable from "./RGR006ResultTable";
import RGR007ResultTable from "./RGR007ResultTable";
import RGR008ResultTable from "./RGR008ResultTable";
import RGR009ResultTable from "./RGR009ResultTable";
import RGR010ResultTable from "./RGR010ResultTable";
import RGR002ResultTable from "./RGR002ResultTable";
import { ReactNode } from "react";

const ReportContainer = () => {
    const { reportId } = useParams();
    const n = useNavigate();
    const { t } = useTranslation('retrieveReports');
    const rptMap = new Map<string, { reportTitle: string, component: ReactNode }>();
    rptMap.set("RGR_001", {
        reportTitle: t('importUtilizationReport'),
        component: <RGR001ResultTable />,
    });
    rptMap.set("RGR_002", {
        reportTitle: t('importSummaryReport'),
        component: <RGR002ResultTable />,
    });
    rptMap.set("RGR_003", {
        reportTitle: t('importExceptionReport'),
        component: <RGR003ResultTable />,
    });
    rptMap.set("RGR_004", {
        reportTitle: t('importDetailReport'),
        component: <RGR004ResultTable />,
    });
    rptMap.set("RGR_005", {
        reportTitle: t('recordAccessSummary'),
        component: <RGR005ResultTable />,
    });
    rptMap.set("RGR_006", {
        reportTitle: t('activityLogReport'),
        component: <RGR006ResultTable />,
    });
    rptMap.set("RGR_007", {
        reportTitle: t('auditLogReport'),
        component: <RGR007ResultTable />,
    });
    rptMap.set("RGR_008", {
        reportTitle: t('userAccountAndAccessControl'),
        component: <RGR008ResultTable />
    });
    rptMap.set("RGR_009", {
        reportTitle: t('archiveRecordSummary'),
        component: <RGR009ResultTable />
    });
    rptMap.set("RGR_010", {
        reportTitle: t('recordAccessDetail'),
        component: <RGR010ResultTable />,
    });

    return (
        <>
            <Helmet>
                <title>
                    {ENV_NAME}CATSLAS - Reports
                </title>
            </Helmet>
            <PageTitleWrapper>
                <PageHeader
                    pageTitle={rptMap.get(reportId).reportTitle}
                    selectedRpt={reportId}
                    setSelectedRpt={() => n(-1)} />
            </PageTitleWrapper>
            <Container maxWidth={false}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}>

                    <Grid item xs={12}>
                        {rptMap.get(reportId).component}
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    )
}

export default ReportContainer;
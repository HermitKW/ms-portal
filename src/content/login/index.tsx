import { Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid, TextField, Typography } from '@mui/material';

import { Link as RouterLink, useNavigate, useParams, useRoutes, useSearchParams } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import { Label } from '@mui/icons-material';
import axios, { AxiosError } from 'axios';
import { ChangeEvent, MouseEvent, KeyboardEvent, useState, useEffect, useContext } from 'react';
import Footer from 'src/components/Footer';
import { useTranslation } from 'react-i18next';
import { authenticateContext } from 'src/authentication';
import i18n from 'src/i18n';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import { ENV_NAME, IS_SHOW_LOGIN_URL, USER_CONFIG_SERVICE_URL } from 'src/constants';
import { UserInfoContext, checkPrivilege } from 'src/authentication/UserInfoProvider';
import LanguageSelector from 'src/components/LanguageSelector';
import { isEmpty } from "lodash";
import {
  CATSLAS_PRIVILEGE_ENQUIRE_ACCESS_RIGHT_FOR_DOCUMENT_CLASS,
  CATSLAS_PRIVILEGE_REQUEST_ACCESS_FOR_DOCUMENT_CLASS,
  CATSLAS_PRIVILEGE_VERIFY_ACCESS_REQUEST_FOR_DOCUMENT_CLASS,
  CATSLAS_PRIVILEGE_APPROVE_ACCESS_REQUEST_FOR_DOCUMENT_CLASS,
  CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,

  CATSLAS_PRIVILEGE_SEARCH_USER_PROFILE,
  CATSLAS_PRIVILEGE_MAINTAIN_USER_PROFILE,
  CATSLAS_PRIVILEGE_MAINTAIN_DOCUMENT_CLASS,
  CATSLAS_PRIVILEGE_MAINTAIN_SYSTEM_PARAMETERS,
  CATSLAS_PRIVILEGE_IMPORT_TASKS_MAINTAIN,
  CATSLAS_PRIVILEGE_IMPORT_TASKS_ENQUIRY,
  CATSLAS_PRIVILEGE_MAINTAIN_TEAM_EMAIL_TEMPLATE,
  CATSLAS_PRIVILEGE_SEND_EMAIL_FOR_ACCOUNT_ACCESS_REVIEW,

  CATSLAS_PRIVILEGE_GENERATE_RGR_001,
  CATSLAS_PRIVILEGE_GENERATE_RGR_002,
  CATSLAS_PRIVILEGE_GENERATE_RGR_003,
  CATSLAS_PRIVILEGE_GENERATE_RGR_004,
  CATSLAS_PRIVILEGE_GENERATE_RGR_005,
  CATSLAS_PRIVILEGE_GENERATE_RGR_006,
  CATSLAS_PRIVILEGE_GENERATE_RGP_007,
  CATSLAS_PRIVILEGE_GENERATE_RGP_008,
  CATSLAS_PRIVILEGE_GENERATE_RGP_009,
  CATSLAS_PRIVILEGE_GENERATE_RGP_010,
  CATSLAS_PRIVILEGE_GENERATE_RGP_011,

  CATSLAS_PRIVILEGE_ENQUIRE_DISPOSAL_DATE_OF_ARCHIVAL_RECORDS,
  CATSLAS_PRIVILEGE_EXTEND_DISPOSAL_DATE_OF_ARCHIVAL_RECORDS,
  CATSLAS_PRIVILEGE_CHANGE_LANGUAGE,
  CATSLAS_PRIVILEGE_ONLINE_HELP,
  CATSLAS_PRIVILEGE_ENQUIRE_ACTIVITIES_LOG,

  CATSLAS_PRIVILEGE_TEST,
} from "src/constants";


const LoginWrapper = styled(Box)(
    () => `
      overflow: auto;
      flex: 1;      
      align-items: center;
      height: 100%;
      background-color: #ffffff;
  `
  );

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

const MuiAvatar = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #e5f7ff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

const TsAvatar = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #dfebf6;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

type LoginProp = {
  ui: string
}

type LoginResponse = {
  data: Record<string, string>,
}


function Login() {

  const { t } = useTranslation();
  
  const [uiState, setUiState] = useState<LoginProp>({ui: null});
  const goToLanding = useNavigateWithLocale("landing");
  // const goToLogin = useNavigateWithLocale("login");
  const goToDocumentClassAccessManagement = useNavigateWithLocale("document-class-access");
  const goToVerifyAccessRight = useNavigateWithLocale("verify-access-right");
  const goToApproveAccessRight = useNavigateWithLocale("approve-access-right");
  const goToRetrieveRecord = useNavigateWithLocale("retrieve-record");

  const goToUserProfile = useNavigateWithLocale("user-profile");
  const goToMaintainDocumentClass = useNavigateWithLocale("maintain-document-class");
  const goToMaintainSystemParameters = useNavigateWithLocale("maintain-system-parameters");
  const goToImportTasksMaintain = useNavigateWithLocale("import-tasks-maintain");
  const goToImportTasksEnquiry = useNavigateWithLocale("import-tasks-enquiry");

  const goToSearchDisposalDate = useNavigateWithLocale("search-disposal-date");
  const goToRetrieveReports = useNavigateWithLocale("retrieve-reports");
  const goToAuditLogSearch = useNavigateWithLocale("audit-log/search");

  const goToErrorPage403 = useNavigateWithLocale("error/403");
  const [searchParams] = useSearchParams();
  
  const [loginError, setLoginError] = useState<string>("");
  const navigateNew = useNavigate();
  const navigateWithLocale = useNavigateWithLocale();

  const [accUi, setAccUi] = useState<string>("");

  const updateUI = (event: ChangeEvent<HTMLInputElement>) => {
    setAccUi(event.target.value);
  }

  
  
  const authContext = useContext(authenticateContext);

  const userInfoContext = useContext(UserInfoContext);
  const privilegesMap = userInfoContext.userInfo?.privilegesMap;

  useEffect(()=>{
    if(IS_SHOW_LOGIN_URL === "FALSE"){
      navigateNew('/');
    }
  })

  
  const goToPageByPrivilege = ()=>{
    if (!isEmpty(privilegesMap)) {
      if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_ENQUIRE_ACCESS_RIGHT_FOR_DOCUMENT_CLASS).hasPrivilege) {
        goToDocumentClassAccessManagement();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_VERIFY_ACCESS_REQUEST_FOR_DOCUMENT_CLASS).hasPrivilege) {
        goToVerifyAccessRight();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_APPROVE_ACCESS_REQUEST_FOR_DOCUMENT_CLASS).hasPrivilege) {
        goToApproveAccessRight();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS).hasPrivilege) {
        goToRetrieveRecord();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_SEARCH_USER_PROFILE).hasPrivilege) {
        goToUserProfile();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_MAINTAIN_DOCUMENT_CLASS).hasPrivilege) {
        goToMaintainDocumentClass();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_MAINTAIN_SYSTEM_PARAMETERS).hasPrivilege) {
        goToMaintainSystemParameters();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_IMPORT_TASKS_MAINTAIN).hasPrivilege) {
        goToImportTasksMaintain();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_IMPORT_TASKS_ENQUIRY).hasPrivilege) {
        goToImportTasksEnquiry();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_001).hasPrivilege
      || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_002).hasPrivilege
      || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_003).hasPrivilege
      || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_004).hasPrivilege
      || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_005).hasPrivilege
      || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_006).hasPrivilege
      || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGP_007).hasPrivilege
      || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGP_008).hasPrivilege
      || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGP_009).hasPrivilege
      || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGP_010).hasPrivilege
      || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGP_011).hasPrivilege) {
        goToRetrieveReports();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_ENQUIRE_DISPOSAL_DATE_OF_ARCHIVAL_RECORDS).hasPrivilege) {
        goToSearchDisposalDate();
      } else if (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_ENQUIRE_ACTIVITIES_LOG).hasPrivilege) {
        goToAuditLogSearch();
      } else {
        goToErrorPage403();
      }
    }
  }
  useEffect(() => {
    if (!isEmpty(privilegesMap)) {
      if (authContext.isAuthenticated) {
        if(!!searchParams.get("redirectUrl")){
          var redirectUrl = decodeURI(searchParams.get("redirectUrl"));
          navigateWithLocale(`${redirectUrl}`)();
        }
        else{
          goToPageByPrivilege();  
        }
      }
    }
  }, [authContext.isAuthenticated, privilegesMap]);


function login(accUi, setAuthenticated, setReloadUserInfo){
  //TBD
  // navigateNew('/landing');
  if(!accUi){
    return;
  }

  // goToLanding();

  //TBUC
  axios.post<any, any, any>(
    // `https://catslas-gateway.catslas-dev.acmp.hpf.gov.hk/api/v1/internal/authorization/dpToken/generate/proxy`,
    `${USER_CONFIG_SERVICE_URL}/api/v1/internal/authorization/dpToken/generate/proxy`,
     {accUi: accUi}, 
     {withCredentials: true})
     .then(function(res){
        // navigateNew('/landing')
        // navigateNew('/document-class-access')
        goToLanding();
     }).catch((e) => {
      console.log("Login dpToken generate proxy")
      console.log(e)
     })
}
  
  return (
    <LoginWrapper>
        <Helmet>
            <title>{ENV_NAME}CATSLAS</title>
        </Helmet>
        <Grid container justifyContent="flex-end">
          <LanguageSelector xs={6}/>
        </Grid>
        
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={0}
          sx={{
            height: "100%"
          }}
        >
            <Card sx={{
              height: "100%",
              width: "100%"
            }}>
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '50%' },
                    "height": "100%",
                    "width": "100%"
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Grid item xs={12} sx={{textAlign: "center"}}>
                    <TextField
                      inputProps={{
                        width: 500
                      }}
                      helperText={loginError}
                      error={!!loginError}

                      required
                      value={accUi}
                      id="ui"
                      label={"UI"}
                      onChange={updateUI}                      
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if(e.key === 'Enter') {
                          login(accUi, authContext.setAuthenticated, userInfoContext.setReloadUserInfo)
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} style={{textAlign: "center", marginTop: "10px"}}>
                    <Button variant="contained" onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      login(accUi, authContext.setAuthenticated, userInfoContext.setReloadUserInfo);
                    }}>
                      {t("login")}
                    </Button>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
        </Grid>
    </LoginWrapper>
  );
}

export default Login;

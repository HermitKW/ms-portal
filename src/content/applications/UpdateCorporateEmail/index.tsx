import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageLoader from "src/components/PageLoader";
import { Grid, Container, TextField, Button, Typography } from '@mui/material';
import Footer from 'src/components/Footer';
import { Save } from '@mui/icons-material';
import React, { useEffect, useState, MouseEvent, ChangeEvent } from "react";
import axios, { AxiosResponse } from "axios";
import id from "date-fns/esm/locale/id/index.js";
import { ENV_NAME, INTELLIGENCE_SHARING_RPT_SERVICE_URL, SYSTEM_CONFIG_SERVICE_URL } from "src/constants";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function IntelligenceSharingReport() {

  var pageTitle = "Corporate Email Setting";
  
  //console.log("reload");
  //console.log(pageTitle);

  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [newEmail, setNewEmail] = useState<any>("");
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<any>("");
  const [errorMessage, setErrorMessage] = useState<any>("");

  const alertMessage = {
    "success":"Update successful",
    "error": "Update failed"
  }


  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    let loadMasterData = axios.get(`${SYSTEM_CONFIG_SERVICE_URL}/api/v1/internal/master-data/map/corporate-email`)
    .then((response) => {
        setName(response.data.result.description);

        if (response.data.result.bankEmails != "") {
            setEmail(response.data.result.bankEmails);
        } else {
            setEmail("Empty");
        }
    });
  }, [id]);

  const [showLoader, setShowLoader] = useState<boolean>(false);

  const saveEmail = () => {

        setShowLoader(true);
        setErrorMessage("");
        //console.log(newEmail);
        //console.log(newCaseAccountNo);

        let result = axios.post(`${SYSTEM_CONFIG_SERVICE_URL}/api/v1/internal/master-data/map/corporate-email/update`,
           {
              "email": newEmail
           }
        ).then((response) => {
              console.log("done:" + JSON.stringify(response.data));
              if (response.data.code == "200") {
                  setEmail(response.data.result.bankEmails);
                  setAlertStatus("success");
              } else if (response.data.code == "500") {
                  setErrorMessage(response.data.result);
                  setAlertStatus("error");
              } else {
                  setAlertStatus("error");
              }
              setShowLoader(false);
              setOpen(true);
        }).catch((error) => {
              console.log("error: " + JSON.stringify(error.response.data));
              setShowLoader(false);
              setAlertStatus("error");
              setOpen(true);
        });
  };

  return (
    <>
      <Helmet>
        <title>
          {ENV_NAME}CATSLAS - {pageTitle}
        </title>
      </Helmet>
      <PageLoader showLoader={showLoader}></PageLoader>
      <PageTitleWrapper>
        <PageHeader pageTitle={pageTitle} />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid container item xs={12}>
            <Grid item xs={2}>
              <Typography variant="h4" component="h4" gutterBottom marginRight="10px">
                Corporate: 
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h4" component="h4" gutterBottom marginRight="10px">                
                {name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={2}>
              <Typography variant="h4" component="h4" gutterBottom marginRight="10px">
                Current Email:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h4" component="h4" gutterBottom marginRight="10px">                
                  {email}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} justifyContent="flex-start" >
            <Grid container item xs={6} sx={{paddingTop: 0, marginBottom: "10px"}}>
              <TextField 
                fullWidth
                inputProps={{maxLength: 255}}
                id="newCaseAccountNo"
                onChange={(event) => setNewEmail(event.target.value)}
                variant="outlined"
                placeholder="New Email Address"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={6} justifyContent="flex-end">
          <Grid item>
            <Button
                variant="contained"
                startIcon={<Save fontSize="small" />}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    saveEmail();
                }}
                size="large"
              >
                Save
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert severity={alertStatus} sx={{ width: '100%' }}>
          {errorMessage == ""? alertMessage[alertStatus]: errorMessage}
        </Alert>
      </Snackbar>

      <Footer/>
    </>
  );
}

export default IntelligenceSharingReport;

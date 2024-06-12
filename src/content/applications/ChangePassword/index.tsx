import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, TextField, Button, Typography } from '@mui/material';
import Footer from 'src/components/Footer';
import { Save } from '@mui/icons-material';
import {MouseEvent} from 'react';
import { ENV_NAME } from 'src/constants';


function IntelligenceSharingReport() {

  //Set from DB/constants
  const passwordStandards : string[] = ["Must be between 6 and 8 characters", "The password will expire in 180 days",
  "The password must contains a number and a letter"];

  const passwordStandardsDisplay = [];

  for(let i = 0; i < passwordStandards.length; i++){
    passwordStandardsDisplay.push(
    <Grid container item xs={12}>
      <Grid item xs={5} sx={{display: "flex", alignItems:"center"}}>
        <Typography variant="h5" component="h5" gutterBottom marginRight="10px">
          {i+1}. {passwordStandards[i]}
        </Typography>
      </Grid>
    </Grid>)
  }

  var pageTitle = "Change Password";
  
  console.log("reload");
  console.log(pageTitle);

  return (
    <>
      <Helmet>
        <title>
          {ENV_NAME} CATSLAS - {pageTitle}
        </title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader pageTitle={pageTitle} />
      </PageTitleWrapper>
      <hr
        style={{
          color: 'grey',
          height: '1px',
        }}
      />
      <Container maxWidth={false}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >

          <Grid container item xs={12}>
            <Grid item xs={5} sx={{display: "flex", alignItems:"center"}}>
              <Typography variant="h4" component="h4" gutterBottom marginRight="10px">
                Password Standards:
              </Typography>
            </Grid>
            {passwordStandardsDisplay}
          </Grid>
       
          <Grid container item xs={12}>
            <Grid item xs={2} sx={{display: "flex", alignItems:"center"}}>
              <Typography variant="h4" component="h4" gutterBottom marginRight="10px">
                Current Password: 
              </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField 
                    fullWidth
                    inputProps={{maxLength: 80}}
                    id="newCaseAccountNo"
                    variant="outlined"
                    placeholder="Current Password"
                />
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={2} sx={{display: "flex", alignItems:"center"}}>
              <Typography variant="h4" component="h4" gutterBottom marginRight="10px">
                New Password:
              </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField 
                    fullWidth
                    inputProps={{maxLength: 80}}
                    id="newCaseAccountNo"
                    variant="outlined"
                    placeholder="New Password"
                />
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={2} sx={{display: "flex", alignItems:"center"}}>
              <Typography variant="h4" component="h4" gutterBottom marginRight="10px">
                Re-Type Password:
              </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField 
                    fullWidth
                    inputProps={{maxLength: 80}}
                    id="newCaseAccountNo"
                    variant="outlined"
                    placeholder="Re-Type Password"
                />
            </Grid>
          </Grid>          
        </Grid>
        <Grid container item xs={8}  justifyContent="flex-end">
            <Grid item>
                <Button
                    variant="contained"
                    startIcon={<Save fontSize="small" />}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        //searchIntelligenceSharingReport();
                    }}
                    sx={{marginTop: "10px"}}
                    size="large"
                    >
                    Save
                </Button>
            </Grid>
        </Grid>
      </Container>

      <Footer/>
    </>
  );
}

export default IntelligenceSharingReport;

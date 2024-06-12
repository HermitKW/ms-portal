import { MouseEvent } from 'react';

import { Typography, Button, Grid, Box, AppBar, Toolbar, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import { useNavigate } from 'react-router-dom';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';

import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

function PageHeader({pageTitle}) {

  // const navigate = useNavigateWithLocale('str-report-edit');
  const navigate = useNavigate();
  const { t } = useTranslation('documentClassAccessMgmnt')

  //const decodedJwt = jwtDecode<JwtPayload>(localStorage.getItem("ACCESS_TOKEN"));

  // const user = {
  //   name: decodedJwt.sub
  // }

  return (
    <Grid item xs container direction="column" justifyContent="center" >
      <Grid container item>
        <Grid item xs={5}>
          <Typography style={{ marginLeft: "10px", color:'#5B8197',font:'Roboto',fontWeight:'700',fontSize:'16px' }} variant="h3" component="h3" gutterBottom>
            {t('Complainant')}
          </Typography>
        </Grid>
        <Grid container item xs={7}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#094880" }}
              startIcon={<Search fontSize="small" />}
              // onClick={(e: MouseEvent<HTMLButtonElement>) => {
              //     // navigate()
              //     navigate('/intelligence-sharing-report/create')
              // }}
            >
              {t('Complaints Record Check')}
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#FFFFFF", color: "#052C42", border: '1px solid' }}
              startIcon={<Clear fontSize="small" />}
              // onClick={(e: MouseEvent<HTMLButtonElement>) => {
              //     // navigate()
              //     navigate('/intelligence-sharing-report/create')
              // }}
            >
              {t('Delete')}
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#094880" }}
              startIcon={<AddTwoToneIcon fontSize="small" />}
              // onClick={(e: MouseEvent<HTMLButtonElement>) => {
              //     // navigate()
              //     navigate('/intelligence-sharing-report/create')
              // }}
            >
              {t('Add')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      
      <Grid item xs={12}>
          <AppBar position="static" style={{ backgroundColor: "#094880" }}>
            <Toolbar>
              <Button color="inherit">COM 1 - M/CHAN</Button>
              <Button color="inherit">COM 2 - F/WONG</Button>
            </Toolbar>
          </AppBar>
      </Grid>

    </Grid>
  );
}

export default PageHeader;

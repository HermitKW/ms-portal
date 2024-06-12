import { MouseEvent } from 'react';

import { Typography, Button, Grid } from '@mui/material';

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
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography 
          style={{ fontSize: "16px", font: "Roboto", lineHeight: "28px", fontWeight: "700", color: "#5B8197" }}
        >
          {t('COM 1 - M/CHAN  is')}
        </Typography>
      </Grid>
      {/* <Grid item>
        <Button
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
              // navigate()
              navigate('/intelligence-sharing-report/create')
          }}
        >
          Create Report
        </Button>
      </Grid> */}
    </Grid>
  );
}

export default PageHeader;

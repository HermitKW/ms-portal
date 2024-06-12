import { MouseEvent } from 'react';

import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import { useNavigate } from 'react-router-dom';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';

import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

function PageHeader(props) {
  const { t } = useTranslation('retrieveReports')
  // const navigate = useNavigateWithLocale('str-report-edit');
  const navigate = useNavigate();

  //const decodedJwt = jwtDecode<JwtPayload>(localStorage.getItem("ACCESS_TOKEN"));

  // const user = {
  //   name: decodedJwt.sub
  // }

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom marginRight="10px">
          {props.pageTitle}
        </Typography>
      </Grid>
      {props.selectedRpt != "" && props.selectedRpt != undefined? (
      <Grid item>
        <Button
          variant="outlined"
          sx={{marginRight:1, width: 200}}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            props.setSelectedRpt("");
            // setPage(0);
            // searchIntelligenceSharingReport(limit, 0);
          }}
          size="medium"
        >
          {t('back')}
        </Button>
      </Grid>
    ):(<></>)}
    </Grid>
  );
}

export default PageHeader;

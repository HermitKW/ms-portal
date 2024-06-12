import { MouseEvent } from 'react';

import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import { useNavigate } from 'react-router-dom';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';

import jwtDecode, { JwtPayload } from 'jwt-decode';

function PageHeader({pageTitle}) {

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
          {pageTitle}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;

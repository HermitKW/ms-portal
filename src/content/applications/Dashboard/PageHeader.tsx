import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Jwt } from 'jsonwebtoken';
import { useNavigate } from 'react-router';

function PageHeader() {
  //const decodedJwt = jwtDecode<JwtPayload>(localStorage.getItem("ACCESS_TOKEN"));
  

  const navigate = useNavigate();


  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          CAPO - Welcome
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;

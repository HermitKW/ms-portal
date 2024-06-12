import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Jwt } from 'jsonwebtoken';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

function PageHeader() {
  //const decodedJwt = jwtDecode<JwtPayload>(localStorage.getItem("ACCESS_TOKEN"));
  

  const navigate = useNavigate();
  const { t } = useTranslation('retrieveRecord')

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
        {t('retrieveRecordAndQuery')}
        </Typography>
      </Grid>
      {/* <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={() => navigate('/user-management/0')}
        >
          Create User
        </Button>
      </Grid> */}
    </Grid>
  );
}

export default PageHeader;

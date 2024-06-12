import { MouseEvent } from 'react';

import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import { useNavigate } from 'react-router-dom';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';

import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

function PageHeader({pageTitle}) {

  const navigate = useNavigate();
  const { t } = useTranslation('searchDisposalDate')


  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom marginRight="10px">
          {t('searchDisposalDate')}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;

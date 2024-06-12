import { Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

function PageHeader() {
  

  const navigate = useNavigate();
  const { t } = useTranslation('approveAccessRight')

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
        {t('401 Forbidden')}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;

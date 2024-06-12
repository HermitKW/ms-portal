import { Box, Card, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import './index.scss';
function OnlineHelpResult({}) {

  
  const { t } = useTranslation('onlineHelp')

  return (
    <>
      <Grid id="online-help">
      <Paper className='online-help-paper' variant="elevation" elevation={3}>{t('requestStep')}</Paper>
      <div><KeyboardDoubleArrowDownIcon /></div>
      <Paper className='online-help-paper' variant="elevation" elevation={3}>{t('verificationStep')}</Paper>
      <div><KeyboardDoubleArrowDownIcon /></div>
      <Paper className='online-help-paper' variant="elevation" elevation={3}>{t('approvalStep')}</Paper>
      <div><KeyboardDoubleArrowDownIcon /></div>
      <Paper className='online-help-paper' variant="elevation" elevation={3}>{t('retrieveStep')}</Paper>
      </Grid>
    </>
  );
}

export default OnlineHelpResult;

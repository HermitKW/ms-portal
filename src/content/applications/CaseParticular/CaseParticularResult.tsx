import { Box, Grid, Card } from '@mui/material';
import CaseParticularResultTable from './CaseParticularResultTable';

function DocumentClassAccessManagementResult() {

  return (
    <Box style={{ width: "100%" }}>
      <Card>
        <Grid style={{ height: "30px", color:'#5B8197',font:'Roboto',fontWeight:'700',fontSize:'16px',lineHeight:'28px', marginLeft: "10px" }}>
          Total No. of Allegation(s) : 2      
        </Grid>
        <CaseParticularResultTable/>
      </Card>
    </Box>
  );
}

export default DocumentClassAccessManagementResult;

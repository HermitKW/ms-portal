import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Card, Container, Grid, Toolbar, makeStyles, useTheme } from '@mui/material';
import PageHeader from './PageHeader';
import ComplainantSideBar from 'src/content/applications/Complainant/ComplainantSideBar';
import './index.scss';
import './ComplaineeResultTable.scss';


function ComplaineeLayout() {

  var pageTitle: string;
  
  return (
    <>
      <PageHeader pageTitle={pageTitle} />
      <Container maxWidth={false} style={{ padding: "0px" }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
            <Grid item xs={12}>
              <ComplainantSideBar />
            </Grid>
            <Grid item xs={12} style={{ padding: "16px" }}>
              <Box id='comee-mgmnt'>
                <Outlet/>
              </Box>
            </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ComplaineeLayout;






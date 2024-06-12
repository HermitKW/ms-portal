import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Card, Button, Box, Typography } from '@mui/material';
import Footer from 'src/components/Footer';
import { useNavigate } from 'react-router';
import { ENV_NAME } from 'src/constants';

function Users() {

  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{ENV_NAME}CATSLAS - Welcome</title>
      </Helmet>
        <Box sx={{display: "flex", height: "35%", minHeight: "200px"}}>
            <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"            
            >
                <Grid item container xs={12} justifyContent={"center"} sx={{height: "100%", paddingTop: 0}}>
                    <Grid item xs={4} >
                        <Button fullWidth sx={{height: "100%"}} 
                            onClick={() => {
                                navigate("/intelligence-sharing-report/search")
                            }}>
                            <Typography variant="h3" component="h3" >                                
                                Search Intelligence Sharing Report
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={4} sx={{height: "100%"}}>
                        <Button fullWidth sx={{height: "100%"}}
                            onClick={() => {
                                navigate("/our-intelligence-sharing-report/search")
                            }}>
                                                        
                            <Typography variant="h3" component="h3" >                                
                                Our Intelligence Sharing Report
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justifyContent={"center"} sx={{height: "100%", paddingTop: 0}}>
                    <Grid item xs={4} sx={{height: "100%",  paddingTop: 0}}>
                        <Button fullWidth sx={{height: "100%"}}
                            onClick={() => {
                                navigate("/related-intelligence-sharing-report/search")
                            }}>
                            <Typography variant="h3" component="h3" >                                
                                Related Intelligence Sharing Report
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={4} sx={{height: "100%", paddingTop: 0}}>
                        <Button fullWidth sx={{height: "100%"}}
                            onClick={() => {
                                navigate("/user-management")
                            }}>
                            <Typography variant="h3" component="h3" >                                
                                Staff Management
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </>
  );
}

export default Users;

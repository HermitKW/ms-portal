import { Button, Card, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

function CaseTable() {
    const navigate = useNavigate();

  return (
<div>
<Grid item container xs={12} justifyContent={"center"} sx={{height: "100%", paddingTop: 0}}>
                    <Grid item xs={4} >
                        <Button fullWidth sx={{height: "100%"}} 
                            onClick={() => {
                                navigate("/intelligence-sharing-report/search")
                            }}>
                            <Typography variant="h3" component="h3" >                                
                                HKI Case
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={4} sx={{height: "100%"}}>
                        <Button fullWidth sx={{height: "100%"}}
                            onClick={() => {
                                navigate("/our-intelligence-sharing-report/search")
                            }}>
                                KLN Case                 
                            <Typography variant="h3" component="h3" >                                
                                
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
                                NT Case
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={4} sx={{height: "100%", paddingTop: 0}}>
                        <Button fullWidth sx={{height: "100%"}}
                            onClick={() => {
                                navigate("/user-management")
                            }}>
                            <Typography variant="h3" component="h3" >                                
                                
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
</div>
  );
}

export default CaseTable;
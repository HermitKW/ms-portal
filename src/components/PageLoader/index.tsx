import { useEffect } from 'react';
import NProgress from 'nprogress';
import { Box, CircularProgress, Grid, Modal, Typography } from '@mui/material';

function PageLoader({ showLoader }) {

  return (
    showLoader?
        <Modal
            sx={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%'
            }}
        component="div"
        open={true}
        >
            <Grid
                sx={{
                    width: '100%',
                    height: '100%'
                }
                }
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                >

                <Grid item xs={3}>
                    <CircularProgress size={64} disableShrink thickness={3} />
                </Grid>   
                
            </Grid> 
        </Modal>
    :
        null
  );
}

export default PageLoader;

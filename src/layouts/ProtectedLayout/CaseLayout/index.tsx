import { FC, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Card, AppBar, Box, Button, Container, Grid, Toolbar, useTheme } from '@mui/material';
import CaseSidebar from 'src/components/CaseMenu/';
import CaseDetails from 'src/components/CaseDetails';
import CaseTopBar from 'src/components/CaseTopBar';
import { CasePrimaryResponse, emptyCasePrimaryResponse } from 'src/models/CasePrimary';


function CaseLayout() {
  const caseDetailsRef = useRef(null);

  const handleCaseDetailsSave = () => {
    if(caseDetailsRef.current){
      caseDetailsRef.current.saveCaseDetailsInfo();
    }
  }

  return (
    <Box
      sx={{
        padding: "60px"
      }}
    >
      <CaseTopBar onCaseDetailsSave={handleCaseDetailsSave} />
      

      <Grid container sx={{height: "100%"}}>
        <Grid item xs={1.5} style={{overflow: "hidden",  color: "red", background: "#094880"}}>
          <CaseSidebar />
        </Grid>

        <Grid container item xs style={{overflow: "hidden"}} sx={{ height: "100%"}} direction="column" spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CaseDetails ref={caseDetailsRef} />
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              {<Outlet />}
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseLayout;

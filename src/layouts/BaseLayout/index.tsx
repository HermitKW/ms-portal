import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

import { AppBar, Box, Toolbar } from '@mui/material';
import Logo from 'src/components/Logo';
import styled from '@emotion/styled';
//import AppMenu from 'src/components/AppMenu';
import Grid from '@mui/material/Grid/Grid';
import LanguageSelector from 'src/components/LanguageSelector';
import { SYSTEM_VERSION } from 'src/constants';
import Sidebar from 'src/components/SideBar';
import { SidebarProvider } from 'src/contexts/SidebarContext';

interface BaseLayoutProps {
  children?: ReactNode;
}


const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        backgroundColor: '#ffffff'
      }}
    >
      <AppBar position="relative" style={{backgroundColor: "#0A5C98"}} sx={{ paddingLeft: { sm: 5, md: 5 }}}>
        <Box sx={{position: "absolute"}}>'
        </Box>
{/*          <Box sx={{position: "absolute", left: "20px", bottom: "0"}}>
           {SYSTEM_VERSION}
          </Box> */}
          <Toolbar style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Logo />
          </Toolbar>
      </AppBar>
      <Grid container>
        {/* <LanguageSelector xs={12}/> */}
      </Grid>
      {children || <Outlet />}
    </Box>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;

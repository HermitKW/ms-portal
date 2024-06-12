import { FC, ReactNode, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

import { AppBar, Box, Button, Container, Grid, Toolbar, useTheme } from '@mui/material';
import Logo from 'src/components/Logo';
import styled from '@emotion/styled';
import LanguageSelector from 'src/components/LanguageSelector';
import { authenticateContext } from 'src/authentication';
import { UserInfoContext } from 'src/authentication/UserInfoProvider';
import AppMenu from 'src/components/AppMenu';
import { useTranslation } from 'react-i18next';
import i18n from 'src/i18n';
import NavigateWithLocale, { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import { GlobalTimeoutModalContext } from 'src/components/GlobalTimeoutModal/GlobalTimeoutModalContext'
import axios from 'axios';
import { IS_SHOW_LOGIN_URL, SYSTEM_VERSION, USER_CONFIG_SERVICE_URL } from 'src/constants';
import Sidebar from 'src/components/SideBar';
import { Grid3x3 } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MiniDrawer from 'src/components/MiniDrawer/MiniDrawer';

interface BaseLayoutProps {
  children?: ReactNode;
}

const ProtectedLayout: FC<BaseLayoutProps> = ({ children }) => {

  const theme = useTheme();

  const authContext = useContext(authenticateContext);
  const globalTimeoutModalContext = useContext(GlobalTimeoutModalContext);
  
  const userInformationContext = useContext(UserInfoContext);
  
  function logout(reason?){
    axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/authorization/logout`, 
    {reason: reason ?? ""}, {withCredentials: true})
      .then(function(){
        userInformationContext.setUserInfo(null);
        authContext.setAuthenticated(false);  
      })
      .catch(() => {      
        userInformationContext.setUserInfo(null);
        authContext.setAuthenticated(false);  
      }) 
  }

  
  const { t } = useTranslation();

  const navigate = useNavigate();
  const goToLogin = useNavigateWithLocale("login");

  //

  useEffect(() => {
    if(authContext.isAuthenticated){
      globalTimeoutModalContext.setGlobalTimeoutStart(true);
    }else{
      globalTimeoutModalContext.setGlobalTimeoutStart(false);
    }
  }, [authContext.isAuthenticated]);

  if(!authContext.isAuthenticated){
    if(IS_SHOW_LOGIN_URL === "TRUE"){
      /* goToLogin(); */
      // return <Navigate to={"login"}/>;   
    }
    else{
      window.close();
    } 
  }

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        backgroundColor: '#EFF7FF',
        fontFamily: "Arial",
      }}
    > 
          <MiniDrawer></MiniDrawer>
…
      <Grid container sx={{height: "100%"}}>
        <Grid item xs={0.3} style={{maxWidth: theme.sidebar.width, color: "red", paddingTop: "0px", background: "#d7e9fd"}}>
          {/* <Sidebar/> */}
        </Grid>
        <Grid item xs style={{overflowX: "scroll", paddingTop: "0px"}}>
          <Box>
            {<Outlet />}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

ProtectedLayout.propTypes = {
  children: PropTypes.node
};

export default ProtectedLayout;

import { FC, ReactNode, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

import { AppBar, Box, Button, Card, Container, Grid, Toolbar, makeStyles, useTheme } from '@mui/material';
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
import PageHeader from 'src/content/applications/Complainant/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ComplainantResultTable from 'src/content/applications/Complainant';
import ComplainantSideBar from 'src/content/applications/Complainant/ComplainantSideBar';
import './index.scss';
import './ComplainantResultTable.scss';


function ComplainantLayout() {

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
              <Box id='com-mgmnt'>
                <Outlet/>
              </Box>
            </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ComplainantLayout;






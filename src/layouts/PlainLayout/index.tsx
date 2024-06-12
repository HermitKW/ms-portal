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

interface PlainLayoutProps {
  children?: ReactNode;
}


const PlainLayout: FC<PlainLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        backgroundColor: '#ffffff'
      }}
    >
      {children || <Outlet />}
    </Box>
  );
};

PlainLayout.propTypes = {
  children: PropTypes.node
};

export default PlainLayout;

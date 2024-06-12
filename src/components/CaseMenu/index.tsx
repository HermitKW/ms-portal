import { useContext } from 'react';
import Scrollbar from 'src/components/Scrollbar';
import { SidebarContext } from 'src/contexts/SidebarContext';

import {
  Box,
  Drawer,
  alpha,
  styled,
  Divider,
  useTheme,
  Button,
  lighten,
  darken,
  Tooltip
} from '@mui/material';

import CaseSidebarMenu from './CaseSideBarMenu';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};  
        min-width: ${theme.sidebar.width};
        color: ${theme.colors.alpha.trueWhite[70]};
        position: relative;
        z-index: 7;
        height: 100%;
        background-color: ${theme.colors.primary.lighter};
`
);

const CaseSidebar = () => {
  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: 'inline-block'
          },
          left: 0
        }}
      >
        <Scrollbar>
          <CaseSidebarMenu />
        </Scrollbar>
      </SidebarWrapper>
    </>
  );
}

export default CaseSidebar;

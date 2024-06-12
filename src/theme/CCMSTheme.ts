import * as React from 'react';
import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const CCMSTheme = createTheme({
  palette: {
    primary: {
      main: "#1976D2",
      light: "#0D6A88",
      contrastText: "#FFFFFF",
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  font: {
    fontFamily: ''
  },
  colors: {
    gradients: {
      blue1: '',
      blue2: '',
      blue3: '',
      blue4: '',
      blue5: '',
      orange1: '',
      orange2: '',
      orange3: '',
      purple1: '',
      purple3: '',
      pink1: '',
      pink2: '',
      green1: '',
      green2: '',
      black1: '',
      black2: ''
    },
    shadows: {
      success: '',
      error: '',
      primary: '',
      warning: '',
      info: ''
    },
    alpha: {
      white: {
        5: '',
        10: '',
        30: '',
        50: '',
        70: '',
        100: ''
      },
      trueWhite: {
        5: '',
        10: '',
        30: '',
        50: '',
        70: '',
        100: ''
      },
      black: {
        5: '',
        10: '',
        30: '',
        50: '',
        70: '',
        100: ''
      },
      customBlue: {
        5: '',
        10: '',
        30: '',
        50: '',
        70: '',
        100: ''
      }
    },
    secondary: {
      lighter: '',
      light: '',
      main: '',
      dark: ''
    },
    primary: {
      lighter: '',
      light: '',
      main: '',
      dark: ''
    },
    success: {
      lighter: '',
      light: '',
      main: '',
      dark: ''
    },
    warning: {
      lighter: '',
      light: '',
      main: '',
      dark: ''
    },
    error: {
      lighter: '',
      light: '',
      main: '',
      dark: ''
    },
    info: {
      lighter: '',
      light: '',
      main: '',
      dark: ''
    }
  },
  general: {
    reactFrameworkColor: undefined,
    borderRadiusSm: '',
    borderRadius: '',
    borderRadiusLg: '',
    borderRadiusXl: ''
  },
  sidebar: {
    background: undefined,
    boxShadow: undefined,
    width: '',
    textColor: undefined,
    dividerBg: undefined,
    menuItemColor: undefined,
    menuItemColorActive: undefined,
    menuItemBg: undefined,
    menuItemBgActive: undefined,
    menuItemIconColor: undefined,
    menuItemIconColorActive: undefined,
    menuItemHeadingColor: undefined
  },
  header: {
    height: '',
    background: undefined,
    boxShadow: undefined,
    textColor: undefined
  }
});


export default CCMSTheme;
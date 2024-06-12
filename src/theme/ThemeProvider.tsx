import React, { useContext, useEffect, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';
import i18n from 'src/i18n';
import { LocaleContext } from 'src/contexts/LocaleContext';
import * as locales from '@mui/material/locale';
export const ThemeContext = React.createContext(
  (themeName: string): void => {}
);

type SupportedLocales = keyof typeof locales;

const ThemeProviderWrapper: React.FC = (props) => {
  const localeContext = useContext(LocaleContext);
  const curThemeName = localStorage.getItem('appTheme') || 'PureLightTheme';
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  // var langCode: SupportedLocales = 'enUS';
  // if(i18n.language === 'zh-HK'){
  //   langCode = 'zhHK';
  // }else if(i18n.language === 'zh-CN'){
  //   langCode = 'zhCN';
  // }


  // const [locale, setLocale] = useState<SupportedLocales>(langCode);
  
  // const themeWithLocale = useMemo(
  //   () => createTheme(theme, locales[locale]),
  //   [locale, theme],
  // );
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[localeContext.locale]),
    [localeContext.locale, theme],
  );

 
  return (
    <StylesProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={themeWithLocale}>{props.children}</ThemeProvider>
      </ThemeContext.Provider>
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;

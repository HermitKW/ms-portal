import { useNavigate, useRoutes } from 'react-router-dom';
import { useNavigateWithLocale } from "src/helper/NavigateWithLocale";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

import { AlertProps, CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import { Global } from '@emotion/react';
import 'src/i18n';
import React, { useRef, useContext, useEffect, useMemo, useState } from 'react';
import { authenticateContext } from './authentication';
import axios, { AxiosError } from 'axios';
import router from 'src/routes';
import { AxiosLogoutHandler } from './authentication/AxiosLogoutHandler';
import { CustomAxiosHandler } from './utilities/CustomAxios/CustomAxiosHandler';

import { UserInfo, UserInfoContext, emptyUserInfo } from './authentication/UserInfoProvider';
import { IS_SHOW_LOGIN_URL, USER_CONFIG_SERVICE_URL } from './constants';
import { GlobalPageLoaderProvider } from './components/GlobalPageLoader/GlobalPageLoaderContext';
import { GlobalSnackbarProvider } from "./components/GlobalSnackbar/GlobalSnackbarContext";
import { LocaleContext } from './contexts/LocaleContext';
import * as locales from '@mui/material/locale';
import TimeoutModal from './components/TimeoutModal';
import { GlobalTimeoutModalContext } from './components/GlobalTimeoutModal/GlobalTimeoutModalContext';
import customAxios from './utilities/CustomAxios';

import { UserAction, emptyUserAction } from "src/models/User";
import {UserSearchContext} from 'src/content/applications/UserProfile/UserProfileSearchContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import MiniDrawer from './components/MiniDrawer/MiniDrawer';

type SupportedLocales = keyof typeof locales;

function App() {

  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  customAxios.defaults.withCredentials = true;
  customAxios.defaults.withXSRFToken = true;
  // axios.defaults.decompress = false;
  // axios.defaults.headers.common["Accept-Encoding"] = "identity;q=0";
  // axios.defaults.headers.post["Accept-Encoding"] = "identity;q=0";

  const content = useRoutes(router);
  const navigateNew = useNavigate();
  const timerRef = useRef();

  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  const authenticateProvided = useMemo(() => ({
    isAuthenticated,
    setAuthenticated
  }), [isAuthenticated]);

  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [reloadUserInfo, setReloadUserInfo] = useState<boolean>(true);

  const userInfoProvided = {
    userInfo,
    setUserInfo,
    reloadUserInfo,
    setReloadUserInfo
  };
  const goToDocumentClassAccessManagement = useNavigateWithLocale("document-class-access");

  const loadUserInfo = async () => {

    //TBD
    //   setUserInfo({
    //     userId: 1,      
    //     lastLoginTs: "2023-10-10 10:10:10",          
    //     postingDesc: "123 - Test User",
    //     privilegesMap: {

    //     }
    // });

    //setAuthenticated(true);
    //TBUC
    axios.post<any>(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/authorization/user-info`, null, 
      {
        headers: {
          "Accept-Encoding": "deflate,br"
        }
      }
    ).then(function (res) {

        console.log("after await load user info");
        console.log(res.data);
        if (res.status === 200) {
          setUserInfo(res.data.result);
          setAuthenticated(true);
        } else {
          console.log("else is reached")
          setUserInfo(emptyUserInfo);
          setAuthenticated(false);
          console.log("else is reached")
        }
        console.log("before setreload user to false")
        setReloadUserInfo(false);
      })
      .catch((e) => {
        console.log("Get user info error");
        console.log(e);
        console.log("test", e);
        setUserInfo(emptyUserInfo);
        setAuthenticated(false);
        setReloadUserInfo(false);
      })
  }

  useEffect(() => {
    console.log("reload User has Change");
    console.log(reloadUserInfo);


    if (reloadUserInfo) {
      console.log("reload User has Change and is true");
      loadUserInfo();
    }
  }, [reloadUserInfo])

  useEffect(() => {
    if (IS_SHOW_LOGIN_URL === "FALSE") {
      if (!isAuthenticated) {
        console.log('logout')
        setReloadUserInfo(true);
      }
      else {
        //navigateNew('/intelligence-sharing-report/search');
        // navigateNew('/document-class-access');
        goToDocumentClassAccessManagement();
      }
    }
  }, [isAuthenticated])

  const [globalTimeoutStart, setGlobalTimeoutStart] = useState(false);
  const [globalTimeoutLogoutSecondsConfig, setGlobalTimeoutLogoutSecondsConfig] = useState<number>(null);

  const globalTimeoutModalProvided = {
    globalTimeoutStart,
    setGlobalTimeoutStart,
    globalTimeoutLogoutSecondsConfig,
    setGlobalTimeoutLogoutSecondsConfig
  }


  const [locale, setLocale] = useState<SupportedLocales>("enUS");
  const localeProvided = useMemo(() => ({
    locale,
    setLocale
  }), [locale]);


  const [userAction, setUserAction] = useState<UserAction>(emptyUserAction);
  const userSearchProvided = useMemo(() => ({
    userAction,
    setUserAction
  }), [userAction]);



  return (
    <authenticateContext.Provider value={authenticateProvided}>
      <UserInfoContext.Provider value={userInfoProvided}>
        <LocaleContext.Provider value={localeProvided}>
          <GlobalTimeoutModalContext.Provider value={globalTimeoutModalProvided}>
            <GlobalPageLoaderProvider>
              <GlobalSnackbarProvider>
              <UserSearchContext.Provider value={userSearchProvided}>
                <AxiosLogoutHandler updateTimer={timerRef}>
                  <CustomAxiosHandler updateTimer={timerRef}>
                    <ThemeProvider>
                      <TimeoutModal timerRef={timerRef} />
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <CssBaseline />
                        <Global styles={{
                          "*": {
                            fontFamily: "Roboto sans-serif"
                          },
                          ".MuiContainer-root": {
                            marginBottom: "10px"
                          }
                        }} />
                        {content}
                      </LocalizationProvider>
                    </ThemeProvider>
                  </CustomAxiosHandler>
                </AxiosLogoutHandler>
                </UserSearchContext.Provider>
              </GlobalSnackbarProvider>
            </GlobalPageLoaderProvider>
          </GlobalTimeoutModalContext.Provider>
        </LocaleContext.Provider>
      </UserInfoContext.Provider>
    </authenticateContext.Provider>
  );
}
export default App;

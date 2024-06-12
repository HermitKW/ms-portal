import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import { AxiosError } from "axios";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { authenticateContext } from '../../authentication'
import React from "react";
import { Close } from "@mui/icons-material";
import { SetPageLoaderContext } from "src/components/GlobalPageLoader/GlobalPageLoaderContext";
import customAxios from './index'
import { GENERIC_ERROR_MESSAGE } from "src/constants";
import { GlobalTimeoutModalContext } from "src/components/GlobalTimeoutModal/GlobalTimeoutModalContext";
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';

export function CustomAxiosHandler({ children, updateTimer }) {
  const authContext = useContext(authenticateContext);
  const [open, setOpen] = useState<boolean>(false);
  const [errMsg, setErrmsg] = useState<string>("");

  const [serverErrorMsg, setServerErrorMsg] = useState("");
  const [showServerError, setShowServerError] = useState<boolean>(false);

      const globalPageLoadSetter = useContext(SetPageLoaderContext);
    const globalTimeoutModalContext = useContext(GlobalTimeoutModalContext);
    const handleClose = (event: SyntheticEvent| Event, reason?: string) => {
        if(reason === 'clickaway'){
            return;
        }

    setOpen(false);
  }

  const goToErrorPage403 = useNavigateWithLocale("error/403");

  useEffect(() => {

    const requestInterceptor = customAxios.interceptors.request.use(function (config) {
      if (globalTimeoutModalContext.globalTimeoutLogoutSecondsConfig && config.url.indexOf('session-extend/cancel') === -1) {
        updateTimer.current.resetTimer()
      }
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

      const responseInterceptor = customAxios.interceptors.response.use((response) => {
        return response;
      }, (error: AxiosError<any, any>) => {
        if(401 === error.response.status){
          globalPageLoadSetter(false);
          if(error.response.data?.error === "Unauthorized"){
            authContext.setAuthenticated(false);     
          }
          if (error.response.data?.message === "Login Expired"){
            setOpen(true);
            console.log(error.response);
            setErrmsg("Login expired");            
            authContext.setAuthenticated(false);          
          }
          return Promise.reject(error);
        } else if (403 === error.response?.status) {
          globalPageLoadSetter(false);
          setServerErrorMsg(error.response.data.message);
          setShowServerError(true);
          goToErrorPage403();
          
        } else if(500 === error.response.status){
          globalPageLoadSetter(false);
          if(error.response.data.error === "Internal Server Error"){
            setServerErrorMsg(GENERIC_ERROR_MESSAGE);
            setShowServerError(true);
          }else{
            setServerErrorMsg(error.response.data.message);
            setShowServerError(true);
          }
        }else if(530 === error.response.status){
          if(error.response.data.message === 'Invalid Login' || 
          error.response.data.message === 'Account is locked'
          ){
            setOpen(true);
            setErrmsg(error.response.data.message);
          }
          globalPageLoadSetter(false);
        	return Promise.reject(error);
        }

        globalPageLoadSetter(false);
        return Promise.reject("Access denied");
      });
      return () => { 
        customAxios.interceptors.request.eject(requestInterceptor);
        customAxios.interceptors.response.eject(responseInterceptor);
       };
    }, [authContext]);

  const handleCloseError = () => {
    setServerErrorMsg("");
    setShowServerError(false);
  }

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        Close
      </IconButton>
    </>
  );

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showServerError}
        message={serverErrorMsg}
        key={"top_center_server_error"}
        action={action}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {serverErrorMsg}
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseError}
            >
              <Close fontSize="small" />
            </IconButton>
          </React.Fragment>
        </Alert>

      </Snackbar>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errMsg}
        action={action}
      />
      {children}
    </>
  );
}
import { FC, ReactNode, useContext, useEffect, useState } from 'react';
import { LocalizationProvider } from "@mui/lab";
import { Button, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import i18n from "src/i18n";
import { authenticateContext } from 'src/authentication';
import { UserInfoContext } from 'src/authentication/UserInfoProvider';
import { useTranslation } from 'react-i18next';
import { LocaleContext } from 'src/contexts/LocaleContext';
import { USER_CONFIG_SERVICE_URL } from 'src/constants';
import * as locales from '@mui/material/locale';
import axios from 'axios';

type SupportedLocales = keyof typeof locales;

function LanguageSelector({xs} ){

    const authContext = useContext(authenticateContext);
    const localeContext = useContext(LocaleContext);
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


    const location = useLocation();
    const navigate = useNavigate();

    function changeLanguage(langCode: string){
        //if requirement for not refreshing the page exists....
        const regEx = /^\/[\w-]+\/(.*)/;
        var requestPath = regEx.exec(location.pathname)[1];
        navigate(`/${langCode}/${requestPath}`);
        i18n.changeLanguage();
        
        var locale: SupportedLocales = 'enUS'
          if(i18n.language === 'zh-HK'){
                locale = 'zhHK';
            }else if(i18n.language === 'zh-CN'){
                locale = 'zhCN';
            }
        localeContext.setLocale(locale);
        // const regEx = /^\/[\w-]+\/(.*)/;
        // console.log(location.pathname)
        // var requestPath = regEx.exec(location.pathname)[1];
        // console.log("xxxxxxx requestPath");
        // console.log(requestPath)
        // window.location.href = `/${langCode}/${requestPath}`;
    }

    return (
        <Grid item container justifyContent="flex-end">
            <Button sx={{color: "white", width: "50px", padding: "9px 0px", minWidth: "auto", fontFamily: "Arial"}} onClick={() => changeLanguage("en")}>
                Eng
            </Button>
            <Button sx={{color: "white",  width: "50px", padding: "9px 0px",  minWidth: "auto", fontFamily: "Arial"}} onClick={() => changeLanguage("zh-HK")}>
                繁
            </Button>
            {/* <Button sx={{color: "white"}} onClick={() => changeLanguage("en")}>
                Eng
            </Button>
            <Button sx={{color: "white"}} onClick={() => changeLanguage("zh-HK")}>
                繁
            </Button> */}
            <Button sx={{color: "white",  width: "50px"}} onClick={() => {
                  logout("Logout");
                }}>
                {t("logout")}
              </Button>
        </Grid>
    );
};

export default LanguageSelector;
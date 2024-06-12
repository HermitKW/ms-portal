import {useContext, useState, useRef, useEffect, useImperativeHandle} from 'react';
import axios from 'axios';
import { Button, styled,Paper,Container, Grid, Card, CardContent, Box, Accordion, AccordionDetails, AccordionSummary, Typography, Modal } from "@mui/material";
import { GlobalTimeoutModalContext } from "../GlobalTimeoutModal/GlobalTimeoutModalContext"
import { authenticateContext } from "../../authentication/index"
import { Check, DoDisturb, Save, Close } from "@mui/icons-material";
import { USER_CONFIG_SERVICE_URL, SESSION_EXTEND_REMINDER_TIMEOUT_SECONDS, SESSION_IDLE_LOGOUT_TIMEOUT_SECONDS, SYSTEM_CONFIG_SERVICE_URL } from '../../constants';
import { forEach } from 'lodash';
import i18next from 'i18next';

export default function TimeoutModal({timerRef}) {
  const globalTimeoutModalContext = useContext(GlobalTimeoutModalContext);
  const [timer, setTimer] = useState<number>(null);
  
  const [showTimeoutModal,setShowTimeoutModal] = useState<boolean>(false)
  const authContext = useContext(authenticateContext);

  const tick = useRef<NodeJS.Timer>()

  function logout(reason){
    axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/authorization/logout`, {
      reason: reason ?? ""
    }, {withCredentials: true})
      .then(function(){
        authContext.setAuthenticated(false);  
        setShowTimeoutModal(false); // remove popup
      })
      .catch(() => {      
        authContext.setAuthenticated(false);  
        setShowTimeoutModal(false); // remove popup
      }) 
  }

    useEffect(() => {
      if (globalTimeoutModalContext.globalTimeoutStart) { 
          tick.current = setInterval(() => { 
          setTimer((prevTimer) => --prevTimer);
         }, 1000);
      }
      else { 
        clearInterval(tick.current); 
      } 
      return () => clearInterval(tick.current); 
    }, [globalTimeoutModalContext.globalTimeoutStart])

     useEffect(() => { 
      if(timer !== null && timer === secondsRemainShowTimeoutReminder){ 
        setShowTimeoutModal(true);
      } 
      else if(timer === 0){
        //Logout
        setTimer(globalTimeoutModalContext.globalTimeoutLogoutSecondsConfig); 
        setShowTimeoutModal(false);
        logout("TIMEOUT");
      }
      // todo: clear timeout
    }, [timer])

  useImperativeHandle(timerRef, function (){

    return {
      resetTimer: () => {
        console.log(" set timer is called");
        setTimer(globalTimeoutModalContext.globalTimeoutLogoutSecondsConfig)
      }
    }
  })

   const [secondsRemainShowTimeoutReminder,setSecondsRemainShowTimeoutReminder] = useState<number>(null);
 
   function loadmessage() {
    axios.get(`${SYSTEM_CONFIG_SERVICE_URL}/api/v1/system-administration/message`)
    .then(function(r){
      
      forEach(r.data.result,(i)=>{
        forEach(Object.keys(i.messageList),(pageName)=>{
          i18next.addResourceBundle(i.lang, pageName, i.messageList[pageName]);
          //console.log(JSON.stringify(i.messageList[pageName]));
        })
      })
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    })
    .catch((e) => {
      console.log("Get Message Error");
      console.log(e);
      console.log("getmessageerror", e);
    });
   }

   useEffect(()=>{
     if(authContext.isAuthenticated){
       loadConfigs();
       loadmessage();
     }
   },[authContext.isAuthenticated])

  
   

  const loadConfigs = async()=>{
    let session_timeout_reminder_config, session_timeout_logout_config

    const body = {
      configKeys: [
        SESSION_EXTEND_REMINDER_TIMEOUT_SECONDS
        ,SESSION_IDLE_LOGOUT_TIMEOUT_SECONDS
    ]
    }
    axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/system-administration/sys-params`,body)
    .then(function(res){
      if(res.data && res.status === 200){
        session_timeout_reminder_config = res.data.result.find((config)=>{return config.sysId === SESSION_EXTEND_REMINDER_TIMEOUT_SECONDS});
        session_timeout_logout_config = res.data.result.find((config)=>{return config.sysId === SESSION_IDLE_LOGOUT_TIMEOUT_SECONDS});
        // setup session timeout and start run 
        setTimer(parseInt(session_timeout_logout_config.sysValue));
        globalTimeoutModalContext.setGlobalTimeoutStart(true);
        globalTimeoutModalContext.setGlobalTimeoutLogoutSecondsConfig(parseInt(session_timeout_logout_config.sysValue))
        setSecondsRemainShowTimeoutReminder(parseInt(session_timeout_logout_config.sysValue) - parseInt(session_timeout_reminder_config.sysValue));
      }
      else{
        globalTimeoutModalContext.setGlobalTimeoutStart(false);
      }
     
    })
    .catch((e) => {
      console.log("get Sys param error");
        console.log(e);
        console.log("sysparamerror", e);
      globalTimeoutModalContext.setGlobalTimeoutStart(false);
    })
  }

  const clickCancel = () => {
    logout("CANCEL_SESSION_EXTENSION")
    setShowTimeoutModal(false);
    globalTimeoutModalContext.setGlobalTimeoutStart(true);
  };

  const clickConfirm = () => {
    axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/authorization/access-token/refresh`,{})
    setShowTimeoutModal(false);
    globalTimeoutModalContext.setGlobalTimeoutStart(true);
  };

  return (
    showTimeoutModal ? 
         <Modal
        open={showTimeoutModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Container maxWidth="lg">
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <Card>              
                  <CardContent>
                    <Box
                      component="div"
                      sx={{
                        '& .MuiTextField-root': { width: '90%' },
                        '& .MuiInputLabel-root': { ml: "1rem"},
                        '& .MuiInputBase-root': { ml: "1rem", mt: "0"}
                      }}
                    >
                      <Accordion expanded={true} className="expand_disabled">
                        <AccordionSummary
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography variant="h3">
                          Session Timeout
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container>
                            <Grid>
                                <Typography id="keep-mounted-modal-description" sx={{ mb: 2 }}>
                                 You're being timed out due to inactivity. Click confirm to extend your session.
                                </Typography>
                            </Grid>
                            <Grid item container justifyContent="end">
                              <Grid item> 
                                <Button 
                                  type="button" 
                                  sx={{marginLeft: '10px'}}
                                  variant="outlined"
                                  startIcon={<DoDisturb fontSize="small" />}
                                  onClick={clickCancel}
                                  >
                                  Logout
                                </Button>
                              </Grid>
                              <Grid item> 
                                <Button type="button"
                                  sx={{marginLeft: '10px'}}
                                  variant="contained"
                                  startIcon={<Check fontSize="small" />}
                                  onClick={clickConfirm}
                                >
                                  Confirm
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Modal>
    :
    null
  );
}
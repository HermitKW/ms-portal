import { Check, DoDisturb, Close } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Card, IconButton, CardContent, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import React, { FC, useEffect, useState, useContext, ChangeEvent, MouseEvent } from "react";

import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { DatePicker, TimePicker } from '@mui/lab';
import { USER_CONFIG_SERVICE_URL, INTELLIGENCE_SHARING_RPT_SERVICE_URL, ENV_NAME } from 'src/constants';
import axios from "axios";
import { keyBy, map } from 'lodash';
import { useNavigate, useParams, Navigate } from "react-router";
import { ImportJobEditView, emptyImportJobEditView } from 'src/models/ImportTasksMaintain';
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { Helmet } from "react-helmet-async";
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { concatErrorMsg, concatErrorMsgWithErrorFormHelperText } from "src/utilities/Utils";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface DocumentClassMap {
  key: any;
  value: any;
}

type ImportTaskParams = {
  id: string
};


interface CreateUpdateErrorMessageErrorMessage {
  importJobName: any
  importJobFrequency: any
  importJobDescription: any,
  documentClass: any,
  onetimeDate: any,
  onetimeTime: any,
  dailyTime: any,
  weeklyTime: any,
  dayOfWeek: any,
  dayOfMonth: any,
  monthlyTime: any,
}

function EditImportTasks() {

  const { t } = useTranslation('importTasksMaintain')

  const dateFormatter = (value) => {
    if (!value) return "";
    return moment(value).format('yyyy-MM-DD HH:mm:ss')
  }


  const [editMode, setEditMode] = useState<boolean>(false);
  const [impJobName, setImpJobName] = useState<String>('');
  const [impJobDesc, setImpJobDesc] = useState<String>('');
  const [impJobFrequency, setImpJobFrequency] = useState<string>("");
  const [dayOfWeek, setDayOfWeek] = useState<String>('');
  const [dayOfMonth, setDayOfMonth] = useState<String>('');
  const [updateTime, setUpdateTime] = useState<Date>(null);
  const [docClassId, setDocClassId] = useState<string>("");


  const [onetimeDate, setOnetimeDate] = useState<Moment>(null);
  const [onetimeTime, setOnetimeTime] = useState<Moment>(null);

  const [dailyTime, setDailyTime] = useState<Moment>(null);
  const [weeklyTime, setWeeklyTime] = useState<Moment>(null);
  const [monthlyTime, setMonthlyTime] = useState<Moment>(null);

  const [fromDateError, setFromDateError] = useState<String>('');
  const [createUpdateErrorMessage, setCreateUpdateErrorMessageErrorMessage] = useState<CreateUpdateErrorMessageErrorMessage>(null);

  // const [importJob, setImportJob] = useState<ImportJobEditView>(emptyImportJobEditView);



  const [documentClassMaps, setDocumentClassMaps] = useState<DocumentClassMap[]>([]);
  const [documentClassMapsKeyByKey, setDocumentClassMapsKeyByKey] = useState<any>(null);

  const [title, setTitle] = useState<string>("");
  const [addOrEdit, setAddOrEdit] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);


  const [alertStatus, setAlertStatus] = useState<any>("");
  const [serverErrorMsg, setServerErrorMsg] = useState("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const [showSnackbarSuccessPopup, setshowSnackbarSuccessPopup] = useState<boolean>(false);
  const [snackbarSuccessMsg, setsnackbarSuccessMsg] = useState<String>('');
  const [showSnackbarFailedPopup, setshowSnackbarFailedPopup] = useState<boolean>(false);
  const [snackbarFailedMsg, setsnackbarFailedMsg] = useState<String>('');

  const globalPageLoadSetter = useContext(SetPageLoaderContext);
  const params = useParams<ImportTaskParams>();
  const navigateWithLocale = useNavigateWithLocale();

  const documentClassMapsKeyBy = (documentClassMaps) => {
    setDocumentClassMapsKeyByKey(keyBy(documentClassMaps, "key"));
  }

  useEffect(() => {
    console.log("start create or edit Import Task");
    globalPageLoadSetter(true);
    loadDocumentClassesMap();
    setIsEdit(params.id !== '0');
    setEditMode(params.id !== '0')
    if (params.id !== '0') {
      console.log("Edit Import Task: " + params.id);
      viewImportJob(params.id);
      setTitle(t('editImportTask'))
      setAddOrEdit("Edit")
    } else {
      setTitle(t('addImportTask'))
      setAddOrEdit("Add")

    }
  }, [params.id])

  const changeOneTimeDate = (newValue) => {
    setOnetimeDate(newValue);
  };

  const changeOneTimeTime = (newValue) => {
    setOnetimeTime(newValue);
  };

  const changeDailyTime = (newValue) => {
    setDailyTime(newValue);
  };

  const changeWeeklyTime = (newValue) => {
    setWeeklyTime(newValue);
  };

  const changeMonthlyTime = (newValue) => {
    setMonthlyTime(newValue);
  };

  const changeFrequency = (frequency: string) => {
    setImpJobFrequency(frequency);
  };

  function saveOrUpdateJobScheduling(id) {

    let param = {
      impJobId: id,
      impJobName: impJobName,
      impJobDesc: impJobDesc,
      docClassId: docClassId,
      impJobFrequency: impJobFrequency,
      day: dayOfMonth,
      dayOfWeek: dayOfWeek,
      onetimeDate: onetimeDate ? moment(onetimeDate).format("yyyyMMDD") : onetimeDate,
      onetimeTime: onetimeTime ? moment(onetimeTime).format("HH:mm") : onetimeTime,
      dailyTime: dailyTime ? moment(dailyTime).format("HH:mm") : dailyTime,
      weeklyTime: weeklyTime ? moment(weeklyTime).format("HH:mm") : weeklyTime,
      monthlyTime: monthlyTime ? moment(monthlyTime).format("HH:mm") : monthlyTime,
      updateTime: updateTime
    };
    let url: string;
    if (editMode) {
      url = `${USER_CONFIG_SERVICE_URL}/api/v1/system-administration/import-job/${id}/update`;
    } else {
      url = `${USER_CONFIG_SERVICE_URL}/api/v1/system-administration/import-job/create`;
    }
    axios.post(url,
      param).then((response: any) => {
        if (response?.status === 200) {

          setAlertStatus("success");
          setServerErrorMsg(response.data.message);
          setShowMessage(true);
          setTimeout(() => {
            returnToImportJobMaintainPage();
          }, 1000);
        }
        setCreateUpdateErrorMessageErrorMessage(null);
        console.log(response.data.message);
      }).catch((error) => {

        if (error.response.status === 530) {
          const messageResult = error.response.data.result;
          console.log("CreateUpdateErrorMessageErrorMessage: " + messageResult);
          setCreateUpdateErrorMessageErrorMessage({
            ...createUpdateErrorMessage, "importJobName": (!!messageResult.importJobName ? concatErrorMsg(messageResult.importJobName) : ""),
            "importJobFrequency": (!!messageResult.importJobFrequency ? concatErrorMsgWithErrorFormHelperText(messageResult.importJobFrequency) : ""),
            "importJobDescription": (!!messageResult.importJobDescription ? concatErrorMsg(messageResult.importJobDescription) : ""),
            "documentClass": (!!messageResult.documentClass ? concatErrorMsgWithErrorFormHelperText(messageResult.documentClass) : ""),
            "onetimeDate": (!!messageResult.onetimeDate ? concatErrorMsg(messageResult.onetimeDate) : ""),
            "onetimeTime": (!!messageResult.onetimeTime ? concatErrorMsg(messageResult.onetimeTime) : ""),
            "dailyTime": (!!messageResult.dailyTime ? concatErrorMsg(messageResult.dailyTime) : ""),
            "dayOfWeek": (!!messageResult.dayOfWeek ? concatErrorMsgWithErrorFormHelperText(messageResult.dayOfWeek) : ""),
            "weeklyTime": (!!messageResult.weeklyTime ? concatErrorMsg(messageResult.weeklyTime) : ""),
            "dayOfMonth": (!!messageResult.dayOfMonth ? concatErrorMsgWithErrorFormHelperText(messageResult.dayOfMonth) : ""),
            "monthlyTime": (!!messageResult.monthlyTime ? concatErrorMsg(messageResult.monthlyTime) : ""),
          });
        }

        console.error('error: ' + error);
      });
  }

  const getFrequencyOptionsIdByName = (impJobFrequency) => {
    if (!impJobFrequency) return -1;
    switch (impJobFrequency) {
      case 'ONE_TIME':
        return 0;
      case 'DAILY':
        return 1;
      case 'WEEKLY':
        return 2;
      case 'MONTHLY':
        return 3;
      default:
        return -1;
    }
  }



  const loadDocumentClassesMap = () => {

    globalPageLoadSetter(true);

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/document-classes/map/admin`,
      {

      }).then((response) => {
        if (response.status === 200) {
          let documentClassMaps: DocumentClassMap[] = map(response.data.result, function (i) {
            let documentClassMap: DocumentClassMap = {
              key: i.key,
              value: i.value
            }
            return documentClassMap
          });
          console.log("documentClassMaps: " + documentClassMaps);
          setDocumentClassMaps(documentClassMaps);
          documentClassMapsKeyBy(documentClassMaps);
        }
        console.log(response)
      }).catch((error) => {
        setAlertStatus("error");
        setServerErrorMsg(error.response.data.message);
        setShowMessage(true);
        console.log(serverErrorMsg);
        console.log(error)
      });
  }


  const viewImportJob = (id) => {
    globalPageLoadSetter(true);
    let data = axios.get(`${USER_CONFIG_SERVICE_URL}/api/v1/system-administration/import-job/${id}`,
      {

      }).then((response: any) => {
        if (response?.status === 200) {
          setImportJob(response.data.result);
        }
      }).catch((error) => {
        console.log("error: " + error);
        if (error?.response?.status === 530) {
          setAlertStatus("error");
          setServerErrorMsg(error.response.data.message);
          setShowMessage(true);
          console.log(serverErrorMsg);
        }
      });
  }

  const setImportJob = (importJob) => {
    setImpJobName(importJob.impJobName);
    setImpJobDesc(importJob.impJobDesc);
    setDocClassId(importJob.docClassId);
    setImpJobFrequency(importJob.impJobFrequency);
    setUpdateTime(importJob.updateTime);
    switch (importJob.impJobFrequency) {
      case 'ONE_TIME':
        let dateArr = importJob.onetimeDatetime?.split(' ');
        setOnetimeDate(dateArr[0]);
        setOnetimeTime(moment().hours(importJob.hours).minute(importJob.minutes));
        break;
      case 'DAILY':
        setDailyTime(moment().hours(importJob.hours).minute(importJob.minutes))
        break;
      case 'WEEKLY':
        setDayOfWeek(importJob.dayOfWeek)
        setWeeklyTime(moment().hours(importJob.hours).minute(importJob.minutes))
        break;
      case 'MONTHLY':
        setDayOfMonth(importJob.day)
        setMonthlyTime(moment().hours(importJob.hours).minute(importJob.minutes))
        break;
    }
  }


  const clickBackButton = () => {
    console.log("back button click");
    returnToImportJobMaintainPage();
  }

  const returnToImportJobMaintainPage = () => {
    console.log("return To User Profile Page");
    navigateWithLocale("import-tasks-maintain")();
    // navigate(`/${i18n.language}/user-profile`);
  }


  const comfirmButtonClick = (id) => {
    saveOrUpdateJobScheduling(id);
    // resetErrorMessage();
    // if (isEdit) {
    //     updateUserProfile(params.id);
    // } else {
    //     createUserProfile();
    // }
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

  };

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

  const hideSnackbarSucess = () => {
    setshowSnackbarSuccessPopup(false);
    setsnackbarSuccessMsg('');
  }
  const hideSnackbarFailed = () => {
    setshowSnackbarFailedPopup(false);
    setsnackbarFailedMsg('');
  }

  const handleCloseError = () => {
    setServerErrorMsg("");
    setShowMessage(false);
  }



  const frequencyOptions = [
    {
      id: '0',
      name: 'ONE_TIME',
      datePicker:
        <>
          <Grid item></Grid>
          <Grid container spacing={2} alignItems="end" paddingTop={"10px"}>
            <Grid item>
              <FormControl>
                <DatePicker
                  value={onetimeDate}
                  onChange={changeOneTimeDate}
                  renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!createUpdateErrorMessage?.onetimeDate} helperText={createUpdateErrorMessage?.onetimeDate} />}
                  mask="____-__-__"
                  inputFormat="YYYY-MM-DD"
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TimePicker
                  value={onetimeTime}
                  onChange={changeOneTimeTime}
                  renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!createUpdateErrorMessage?.onetimeTime} helperText={createUpdateErrorMessage?.onetimeTime} />}
                  mask="__:__"
                  inputFormat="HH:mm"
                />
              </FormControl>
            </Grid>
          </Grid>
        </>
    },
    {
      id: '1',
      name: 'DAILY',
      datePicker:
        <>
          <Grid item></Grid>
          <Grid container spacing={2} alignItems="end" paddingTop={"10px"}>
            <Grid item>
              <FormControl>
                <TimePicker
                  value={dailyTime}
                  onChange={changeDailyTime}
                  renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!createUpdateErrorMessage?.dailyTime} helperText={createUpdateErrorMessage?.dailyTime} />}
                  mask="__:__"
                  inputFormat="HH:mm"
                />
              </FormControl>
            </Grid>
          </Grid>
        </>
    },
    {
      id: '2',
      name: 'WEEKLY',
      datePicker:
        <>
          <Grid item></Grid>
          <Grid container spacing={2} alignItems="end" paddingTop={"10px"}>
            <Grid item>
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={dayOfWeek}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setDayOfWeek(e.target.value);
                  }}
                >
                  <MenuItem value="Monday">{t('Monday')}</MenuItem>
                  <MenuItem value="Tuesday">{t('Tuesday')}</MenuItem>
                  <MenuItem value="Wednesday">{t('Wednesday')}</MenuItem>
                  <MenuItem value="Thursday">{t('Thursday')}</MenuItem>
                  <MenuItem value="Friday">{t('Friday')}</MenuItem>
                  <MenuItem value="Saturday">{t('Saturday')}</MenuItem>
                  <MenuItem value="Sunday">{t('Sunday')}</MenuItem>
                </Select>
                {
                  !!createUpdateErrorMessage?.dayOfWeek ?
                    createUpdateErrorMessage.dayOfWeek
                    : null
                }
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TimePicker
                  value={weeklyTime}
                  onChange={changeWeeklyTime}
                  renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!createUpdateErrorMessage?.weeklyTime} helperText={createUpdateErrorMessage?.weeklyTime} />}
                  mask="__:__"
                  inputFormat="HH:mm"
                />
              </FormControl>

            </Grid>
          </Grid>
        </>
    },
    {
      id: '3',
      name: 'MONTHLY',
      datePicker:
        <>
          <Grid item></Grid>
          <Grid container spacing={2} alignItems="end" paddingTop={"10px"}>
            <Grid item>
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={dayOfMonth}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setDayOfMonth(e.target.value);
                  }}
                >
                  {[...Array(31)].map((x, i) =>
                    <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                  )}
                  <MenuItem key="End-of-Month" value="L">End-of-Month</MenuItem>
                </Select>
                {
                  !!createUpdateErrorMessage?.dayOfMonth ?
                    createUpdateErrorMessage.dayOfMonth
                    : null
                }
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TimePicker
                  value={monthlyTime}
                  onChange={changeMonthlyTime}
                  renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!createUpdateErrorMessage?.monthlyTime} helperText={createUpdateErrorMessage?.monthlyTime} />}
                  mask="__:__"
                  inputFormat="HH:mm"
                />
              </FormControl>
            </Grid>
          </Grid>
        </>
    }
  ];


  return (
    <Card>
      <Helmet>
        <title>{ENV_NAME}CATSLAS - {addOrEdit} Import Task</title>
      </Helmet>

      <PageTitleWrapper>

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={4}>
            <Typography variant="h3" component="h3" gutterBottom marginRight="10px">
              {title}
            </Typography>
          </Grid>
          <Grid container item xs={8} justifyContent={"flex-end"}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={clickBackButton}
              >
                {t('back')}
              </Button>
              <Button
                sx={{ marginLeft: '10px' }}
                variant="contained"
                startIcon={<Check fontSize="small" />}
                type="submit"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  comfirmButtonClick(params.id);
                }}
                form="hook-form"
              >
                {t('confirm')}
              </Button>
            </Grid>
          </Grid>
        </Grid>

      </PageTitleWrapper>

      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>

            <Card id="edit-user-profile">
              <Container maxWidth={false} disableGutters sx={{ paddingLeft: '27px', paddingRight: '10px' }}
                className="search-container">
                <Grid container display={"grid"} gridTemplateColumns={"repeat(auto-fill, 150px 50%)"} alignItems={"baseline"} maxWidth={"100%"} >
                  <Grid item>
                    <Typography variant="h5" gutterBottom>
                      {t('name')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      InputLabelProps={{
                        shrink: true
                      }}
                      variant="standard"
                      style={{ width: "100%" }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setImpJobName(e.target.value)}
                      value={impJobName}
                      error={!!createUpdateErrorMessage?.importJobName}
                      helperText={createUpdateErrorMessage?.importJobName}
                    />

                  </Grid>

                  <Grid item>
                    <Typography variant="h5" gutterBottom>
                      {t('documentClass')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControl variant="standard" style={{ width: "100%" }}>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={docClassId}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setDocClassId(e.target.value);
                        }}
                      >
                        {
                          documentClassMaps?.map((documentClass) => {
                            return (
                              <MenuItem key={documentClass.key} value={documentClass.key}>
                                {documentClass.key}
                              </MenuItem>
                            )
                          })
                        }
                      </Select>
                      {
                        !!createUpdateErrorMessage?.documentClass ?
                          createUpdateErrorMessage.documentClass
                          : null
                      }
                    </FormControl>

                  </Grid>
                  <Grid item>
                    <Typography variant="h5" gutterBottom>
                      {t('description')}
                    </Typography>
                  </Grid>
                  <Grid className="field">
                    <TextField
                      InputLabelProps={{
                        shrink: true
                      }}
                      variant="standard"
                      style={{ width: "100%" }}
                      value={impJobDesc}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setImpJobDesc(e.target.value)}
                      error={!!createUpdateErrorMessage?.importJobDescription}
                      helperText={createUpdateErrorMessage?.importJobDescription}
                    />
                  </Grid>

                  <Grid item>
                    <Typography variant="h5" gutterBottom>
                      {t('frequency')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControl variant="standard" style={{ width: "100%" }}>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={impJobFrequency}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          changeFrequency(e.target.value);
                        }}
                      >
                        {frequencyOptions.map((m, index) =>
                          <MenuItem key={index} value={m.name}>{m.name}</MenuItem>
                        )}
                      </Select>
                      {
                        !!createUpdateErrorMessage?.importJobFrequency ?
                          createUpdateErrorMessage.importJobFrequency
                          : null
                      }
                    </FormControl>

                  </Grid>
                  {impJobFrequency != "" ? frequencyOptions[getFrequencyOptionsIdByName(impJobFrequency)].datePicker : <></>}
                </Grid>
              </Container>

            </Card>

          </Grid>
        </Grid>
      </Container>


      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showMessage}
        message={serverErrorMsg}
        key={"top_center_server_error"}
        action={action}
      >
        <Alert severity={alertStatus} sx={{ width: '100%' }}>
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
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={showSnackbarSuccessPopup} onClose={() => hideSnackbarSucess()} autoHideDuration={6000} >
          <Alert severity="success" sx={{ width: '100%' }}>
            {snackbarSuccessMsg}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              sx={{ marginLeft: "20px" }}
              onClick={() => hideSnackbarSucess()}
            >
              <Close fontSize="small" />
            </IconButton>
          </Alert>
        </Snackbar>
        <Snackbar open={showSnackbarFailedPopup} onClose={() => hideSnackbarFailed()} autoHideDuration={6000} >
          <Alert severity="error" sx={{ width: '100%' }}>
            {snackbarFailedMsg}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              sx={{ marginLeft: "20px" }}
              onClick={() => hideSnackbarFailed()}
            >
              <Close fontSize="small" />
            </IconButton>
          </Alert>
        </Snackbar>
      </Stack>
    </Card>
  );
}


export default EditImportTasks;
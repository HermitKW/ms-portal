import React, { ChangeEvent, FC, MouseEvent, useCallback, useContext, useEffect, useState } from 'react';
import './ImportTasksMaintainResultTable.scss';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  Container,
  Grid,
  TextField,
  Button,
  AccordionDetails,
  Modal,
  CardContent,
  Accordion,
  AccordionSummary,
  Input,
  FormControlLabel
} from '@mui/material';
import { Check, DoDisturb, Search, Close } from '@mui/icons-material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { TableHeader } from 'src/components/Table';
import { DatePicker, TimePicker } from '@mui/lab';
import moment from 'moment';
import {
  INTELLIGENCE_SHARING_RPT_SERVICE_URL, USER_CONFIG_SERVICE_URL
} from 'src/constants';
import PageLoader from 'src/components/PageLoader';
import { filter, map, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import customAxios from '../../../utilities/CustomAxios';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { keyBy } from 'lodash';
import { ImportJobMaintainQueryResult } from 'src/models/ImportTasksMaintain';
import SearchImportJobComponent from './ImportTaskSearchTable';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import { Order } from 'src/utilities/Utils';
import EnhancedTableHead from 'src/components/EnhancedTableHead';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface UserTableProp {
  className?: string;
}

interface DocumentClassMap {
  key: any;
  value: any;
}

const ImportTasksMaintainResultTable: FC<UserTableProp> = ({ }) => {
  const { t } = useTranslation('importTasksMaintain');



  const globalPageLoadSetter = useContext(SetPageLoaderContext);
  const [importJobList, setImportJobList] = useState<ImportJobMaintainQueryResult[]>([]);


  const [documentClassMaps, setDocumentClassMaps] = useState<DocumentClassMap[]>([]);
  const [documentClassMapsKeyByKey, setDocumentClassMapsKeyByKey] = useState<any>(null);


  const [disableImportJobPopUp, setDisableImportJobPopUp] = useState<boolean>(false);
  const [disableImportJobId, setDisableImportJobId] = useState<String>("");
  const [alertStatus, setAlertStatus] = useState<any>("");
  const [serverErrorMsg, setServerErrorMsg] = useState("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const [showSnackbarSuccessPopup, setshowSnackbarSuccessPopup] = useState<boolean>(false);
  const [snackbarSuccessMsg, setsnackbarSuccessMsg] = useState<String>('');
  const [showSnackbarFailedPopup, setshowSnackbarFailedPopup] = useState<boolean>(false);
  const [snackbarFailedMsg, setsnackbarFailedMsg] = useState<String>('');
  const [isSearched, setIsSearched] = useState<boolean>(false);

  const navigateWithLocale = useNavigateWithLocale();

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState("impJobName");

  const handleRequestSort = (_: unknown, property: string) => {
    const isAsc = orderBy === property && order !== "asc";
    const newOrder = isAsc ? "asc" : "desc";
    setOrder(newOrder);
    setOrderBy(property);
  }

  const refreshPage = () => {
    console.log("Refresh Page");
    setIsSearched(false)
}

  useEffect(() => {
    loadDocumentClassesMap();
  }, []);


  const documentClassMapsKeyBy = (documentClassMaps) => {
    setDocumentClassMapsKeyByKey(keyBy(documentClassMaps, "key"));
  }

  const loadDocumentClassesMap = () => {

    globalPageLoadSetter(true)

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
        globalPageLoadSetter(false)
        console.log(error)
      });
  }

  const clickDisableRecord = (id) => {
    setDisableImportJobId(id);
    setDisableImportJobPopUp(true);
  }

  const disableRecord = () => {
    disableImportTask(disableImportJobId);
  }

  const disableImportTask = (id) => {
    axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/system-administration/import-job/${id}/delete`, {

    }).then((response: any) => {
      if (response?.status === 200) {

        setAlertStatus("success");
        setServerErrorMsg(response.data.message);
        setShowMessage(true);
        refreshPage();
      }
      console.log(response.data.message);
      setIsSearched(false);
    }).catch((error) => {
      console.error('error: ' + error);
    });
  };

  const editImportTask = function (id: string) {
    return navigateWithLocale(`import-tasks-maintain`)(id);
  }


  const columns = [
    { name: t('name'), key: 'impJobName', seq: 1, type: 'string', headerStyle: { width: '40%' }, canOrder: true }
    , { name: t('documentClass'), key: 'docClassId', seq: 2, type: 'string', canOrder: true }
    , { name: t('frequency'), key: 'impJobFrequency', seq: 3, type: 'string', canOrder: true }
    , { name: t('details'), key: 'details', seq: 4, type: 'string', canOrder: false }
    , { name: t('action'), key: 'action', seq: 5, type: 'string', canOrder: false }
  ];

  const columnsSorted = sortBy(columns, function (o) {
    return o.seq;
  });
  const sortableResultTableColumns = columnsSorted.map(column => ({ id: column.key, label: column.name, canOrder: column.canOrder}));

  const theme = useTheme();

  const getCellDisplay = (value, type, columnKey, d) => {
    if (columnKey === 'details') {
      return getDateDescription(d.impJobFrequency, d);
    }
    return value;
  };


  function getDateDescription(fre, data) {
    if (fre === 'ONE_TIME') {
      return moment(data.onetimeDatetime).format("yyyy-MM-DD HH:mm:ss");
    } else if (fre === 'DAILY') {
      return data.hours + ":" + data.minutes;
    } else if (fre === 'WEEKLY') {
      return data.dayOfWeek + ", " + data.hours + ":" + data.minutes;
    } else if (fre === 'MONTHLY') {
      return getUnit(data.day) + ", " + data.hours + ":" + data.minutes;
    }
    return null;
  }

  function getUnit(date) {
    switch (date) {
      case '1':
      case '21':
      case '31':
        return date + 'st';
      case '2':
      case '22':
        return date + 'nd';
      case '3':
      case '23':
        return date + 'rd';
      case 'L':
        return 'End-of-Month';
      default:
        return date + 'th';
    }
  }

  const DisableImportJobPopup = () => {
    return (
      <Modal
        open={disableImportJobPopUp}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Container maxWidth={false}>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <Card>
                  <CardContent>
                    <Box
                      component="form"
                      sx={{
                        '& .MuiTextField-root': { width: '90%' },
                        '& .MuiInputLabel-root': { ml: "1rem" },
                        '& .MuiInputBase-root': { ml: "1rem", mt: "0" }
                      }}
                      noValidate
                      autoComplete="off"
                      onSubmit={() => { }}
                    >
                      <Accordion expanded={true} className="expand_disabled">
                        <AccordionSummary
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography variant="h3">{t('confirmToDelete')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container>
                            <Grid item container justifyContent="end">
                              <Grid item>
                                <Button type="button"
                                  sx={{ marginLeft: '10px' }}
                                  variant="outlined"
                                  startIcon={<DoDisturb fontSize="small" />}
                                  onClick={() => {
                                    setDisableImportJobPopUp(false);
                                  }}
                                >
                                  {t('cancel')}
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  type="button"
                                  sx={{ marginLeft: '10px' }}
                                  variant="contained"
                                  startIcon={<Check fontSize="small" />}
                                  onClick={() => {
                                    disableRecord();
                                    setDisableImportJobPopUp(false);
                                  }}>
                                  {t('confirm')}
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
    );
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
  //   return (
  //     <Grid>
  //       <Container maxWidth={false} disableGutters sx={{ paddingLeft: '27px', paddingRight: '10px' }}
  //         className="search-container">
  //         <Grid container className="row">
  //           <Typography sx={{ width: 300 }} gutterBottom>
  //             {t('name')}
  //           </Typography>
  //           {!editMode ?
  //             <Grid className="field">
  //               <TextField
  //                 InputLabelProps={{
  //                   shrink: true
  //                 }}
  //                 variant="standard"
  //                 onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
  //                 value={name}
  //               />
  //             </Grid>
  //             :
  //             <Typography sx={{ width: 300 }} gutterBottom>
  //               {name}
  //             </Typography>
  //           }
  //         </Grid>
  //         <Grid container className="row">
  //           <Typography sx={{ width: 300 }} gutterBottom>
  //             {t('documentClass')}
  //           </Typography>
  //           {!editMode ?
  //             <Grid className="field">
  //               <FormControl variant="standard" sx={{ minWidth: 150 }}>
  //                 <Select
  //                   labelId="demo-simple-select-standard-label"
  //                   id="demo-simple-select-standard"
  //                   value={selectedDocumentClass}
  //                   onChange={(e: ChangeEvent<HTMLInputElement>) => {
  //                     setSelectedDocumentClass(e.target.value);
  //                   }}
  //                 >
  //                   {
  //                     documentClassMaps?.map((documentClass) => {
  //                       return (
  //                         <MenuItem key={documentClass.key} value={documentClass.key}>
  //                           {documentClass.key}
  //                         </MenuItem>
  //                       )
  //                     })
  //                   }
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //             :
  //             <Typography sx={{ width: 300 }} gutterBottom>
  //               {selectedDocumentClass}
  //             </Typography>}
  //         </Grid>
  //         <Grid container className="row">
  //           <Typography sx={{ width: 300 }} gutterBottom>
  //             {t('description')}
  //           </Typography>
  //           <Grid className="field">
  //             <TextField
  //               InputLabelProps={{
  //                 shrink: true
  //               }}
  //               variant="standard"
  //               value={description}
  //               onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
  //             />
  //           </Grid>
  //         </Grid>
  //         <Grid container className="row">
  //           <Typography sx={{ width: 300 }} gutterBottom>
  //             {t('frequency')}
  //           </Typography>
  //           <Grid className="field">
  //             <FormControl variant="standard" sx={{ minWidth: 150 }}>
  //               <Select
  //                 labelId="demo-simple-select-standard-label"
  //                 id="demo-simple-select-standard"
  //                 value={frequency}
  //                 onChange={(e: ChangeEvent<HTMLInputElement>) => {
  //                   setDate(null);
  //                   setTime(null);
  //                   setFrequency(parseInt(e.target.value));
  //                 }}
  //               >
  //                 {frequencyOptions.map((m, index) =>
  //                   <MenuItem key={index} value={index}>{m.name}</MenuItem>
  //                 )}
  //               </Select>
  //             </FormControl>
  //           </Grid>
  //         </Grid>
  //         {frequency != -1 ? frequencyOptions[frequency].datePicker : <></>}
  //         <Grid item container justifyContent="end">
  //           <Grid item>
  //             <Button
  //               variant="outlined"
  //               sx={{ marginRight: 1 }}
  //               startIcon={<DoDisturb fontSize="small" />}
  //               onClick={(e: MouseEvent<HTMLButtonElement>) => {
  //                 // setDocumentClass("ALL");
  //                 // setSelectedDocumentClass("");
  //                 // setManagePage(false);
  //                 setEditMode(false);
  //               }}
  //               size="medium"
  //             >
  //               {t('cancel')}
  //             </Button>
  //           </Grid>
  //           <Grid item>
  //             <Button
  //               variant="contained"
  //               sx={{ marginRight: 1 }}
  //               startIcon={<Check fontSize="small" />}
  //               onClick={(e: MouseEvent<HTMLButtonElement>) => {
  //                 saveOrUpdateJobScheduling();
  //               }}
  //               size="medium"
  //             >
  //               {t('confirm')}
  //             </Button>
  //           </Grid>
  //         </Grid>
  //       </Container>
  //     </Grid>
  //   );
  // };

  return (
    <Card id="import-tasks-maintain">
      <SearchImportJobComponent
        setImportJobList={setImportJobList}
        isSearched={isSearched}
        setIsSearched={setIsSearched}
        order={order}
        orderBy={orderBy}
      />


      <TableContainer>
        <Table>

          {/* <TableHead>
            <TableRow>
              {
                map(columnsSorted, function (o) {
                  return (
                    <TableCell key={o.key} style={o.headerStyle}>
                      {o.name}
                    </TableCell>
                  );
                })
              }
              {
                <TableCell>
                  {t('action')}
                </TableCell>
              }
            </TableRow>
          </TableHead> */}
          <EnhancedTableHead
            headCells={sortableResultTableColumns}
            onRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy} />
          <TableBody>
            {
              map(importJobList, (d, idx) => (
                <TableRow
                  hover
                  key={d.impJobId}
                >
                  {map(columnsSorted, function (o) {
                    if (o.key !== "action") {
                      return (
                        <TableCell key={o.key}>
                          <Typography
                            variant="body1"
                            color="text.primary"
                            gutterBottom
                          >
                            {getCellDisplay(d[o.key], o.type, o.key, d)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                          </Typography>
                        </TableCell>
                      );
                    }
                  })}
                  {<TableCell align="left" sx={{ width: '100px' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '30px 30px', marginRight: 6 }}>
                      {
                        <Tooltip title={t('edit')} arrow>
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.primary.lighter
                              },
                              color: theme.palette.primary.main
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => {
                              editImportTask(d.impJobId)
                            }}
                          >
                            <EditTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }

                      {
                        <Tooltip title={t('delete')} arrow>
                          <IconButton
                            sx={{
                              '&:hover': { background: theme.colors.error.lighter },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => clickDisableRecord(d.impJobId)}
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                    </Box>
                  </TableCell>}

                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <DisableImportJobPopup />
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
};

export default ImportTasksMaintainResultTable;

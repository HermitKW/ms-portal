import React, { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback } from 'react';
import './VerifyAccessRightResultTable.scss';
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
import { CancelOutlined, Check, CheckBoxOutlined, DoDisturb, Save, ToggleOffTwoTone, Close } from "@mui/icons-material";

import { UserQueryResult } from 'src/models/User';
import { TableHeader } from 'src/components/Table';
import { DatePicker } from '@mui/lab';
import { Search } from '@mui/icons-material';
import { UserSearchContext } from './VerifyAccessRightSearchContext';
import { UserSearchCriteriaContext } from './VerifyAccessRightCriteriaContext';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, USER_CONFIG_SERVICE_URL, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from "src/constants";
import { useNavigate, useLocation } from 'react-router';
import PageLoader from "src/components/PageLoader";
import { filter, findIndex, map, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { timeout } from 'q';
import { UserDocumentClassQueryResult, VerifyRightRequestViewResponse, emptyVerifyRightRequestViewResponse } from 'src/models/UserDocumentClass';
import moment, { Moment } from 'moment';
import axios from "axios";
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import ViewAccessRightRequestPopup from "./ViewAccessRightRequestPopup";
import { concatErrorMsg } from "src/utilities/Utils";
import { keyBy } from 'lodash';
import SearchAccessRightRequestComponent from './VerifyAccessRightSearchTable';
import SupportRequestPopupComponent from './SupportRequestPopup';
import UnsupportRequestPopupComponent from './UnsupportRequestPopup';
import EnhancedTableHead from 'src/components/EnhancedTableHead';
import { Order, concatErrorMsgWithErrorFormHelperText } from 'src/utilities/Utils';

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
  key: any
  value: any
}


const VerifyAccessRightResultTable: FC<UserTableProp> = ({ }) => {
  const { t } = useTranslation('verifyAccessRight')
  const [userDocumentClassList, setUserDocumentClassList] = useState<UserDocumentClassQueryResult[]>([]);

  const [supportReuqestPopUp, setSupportReuqestPopUp] = useState<boolean>(false);
  const [unsupportReuqestPopUp, setUnsupportReuqestPopUp] = useState<boolean>(false);
  const [supportRequestId, setSupportRequestId] = useState<string>("");
  const [supportRequestUpdateDate, setSupportRequestUpdateDate] = useState<Moment | null>(null);
  const [unsupportRequestId, setUnsupportRequestId] = useState<string>("");
  const [unsupportRequestUpdateDate, setUnsupportRequestUpdateDate] = useState<Moment | null>(null);

  const [documentClassMaps, setDocumentClassMaps] = useState<DocumentClassMap[]>([]);
  const [documentClassMapsKeyByKey, setDocumentClassMapsKeyByKey] = useState<any>(null);
  const [supportOrUnSupportSucceed, setSupportOrUnSupportSucceed] = useState<boolean>(true);

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<any>("");
  const [serverErrorMsg, setServerErrorMsg] = useState("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const [showViewEditAccessRightRequestPopUp, setShowViewEditAccessRightRequestPopUp] = useState<boolean>(false);
  const [accessRightRequestViewResponse, setAccessRightRequestViewResponse] = useState<VerifyRightRequestViewResponse>(emptyVerifyRightRequestViewResponse);

  const globalPageLoadSetter = useContext(SetPageLoaderContext);

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState("createTime");

  const [remarksSupport, setRemarksSupport] = useState<string>("");
  const [remarksUnsupport, setRemarksUnsupport] = useState<string>("");

  const handleRequestSort = (_: unknown, property: string) => {
    const isAsc = orderBy === property && order !== "asc";
    const newOrder = isAsc ? "asc" : "desc";
    setOrder(newOrder);
    setOrderBy(property);
  }

  useEffect(() => {
    loadDocumentClassesMap();
  }, []);

  const navigate = useNavigate();

  const resultTableColumns = [
    { name: t('requestNumber'), key: 'usdReqNo', seq: 1, type: 'string', style: {}, canOrder: true }
    , { name: t('ui'), key: 'usdUsrUi', seq: 2, type: 'string', canOrder: true }
    , { name: t('documentClass'), key: 'usdDocClass', seq: 4, type: 'string', canOrder: true }
    , { name: t('requestDate'), key: 'createTime', seq: 5, type: 'datetime', canOrder: true }
    , { name: t('accessPeriodFrom'), key: 'usdAccessStime', seq: 6, type: 'date', canOrder: true }
    , { name: t('accessPeriodTo'), key: 'usdAccessEtime', seq: 7, type: 'date', canOrder: true }
    , { name: t('importDateFrom'), key: 'usdImportDateFrom', seq: 8, type: 'date', canOrder: true }
    , { name: t('importDateTo'), key: 'usdImportDateTo', seq: 9, type: 'date', canOrder: true }
    , { name: t('status'), key: 'usdStatus', seq: 10, type: 'string', canOrder: true }
    , { name: t('action'), key: 'action', seq: 11, type: 'string', canOrder: false }
  ]

  const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });
  const sortableResultTableColumns = resultTableColumnsSorted.map(column => ({ id: column.key, label: column.name, canOrder: column.canOrder }));

  const getCellDisplay = (value, type, columnKey) => {
    if (type === 'date') return moment(value).format('yyyy-MM-DD')
    if (type === 'datetime') return moment(value).format('yyyy-MM-DD HH:mm:ss')
    if (columnKey === 'usdDocClass') return documentClassMapping(value);
    if (columnKey === 'usdStatus') return statusMapping(value);
    return value
  }

  const dateFormatterToYYYYMMDD = (value) => {
    if (!value) return "";
    return moment(value).format('yyyy-MM-DD')
  }

  const dateFormatterToDateTime = (value) => {
    if (!value) return "";
    return moment(value).format('yyyy-MM-DD HH:mm:ss')
  }

  const statusMapping = (statusCode) => {
    if (!statusCode) return "";
    if ("PENDING" === statusCode) {
      return "Pending";
    }
    else if ("SUPPORTED" === statusCode) {
      return "Supported";
    }
    else if ("UNSUPPORTED" === statusCode) {
      return "Unsupported";
    }
    else if ("APPROVED" === statusCode) {
      return "Approved";
    }
    else if ("REJECTED" === statusCode) {
      return "Rejected";
    }
  }

  const documentClassMapping = (documentClassKey) => {
    if (!documentClassKey || !documentClassMapsKeyByKey) return "";
    return documentClassMapsKeyByKey[documentClassKey]?.value;
  }

  const documentClassMapsKeyBy = (documentClassMaps) => {
    setDocumentClassMapsKeyByKey(keyBy(documentClassMaps, "key"));
  }

  const theme = useTheme();

  const loadDocumentClassesMap = () => {

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/document-classes/map`,
      {
        requestFrom: "verify-access-rights"
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
          console.log("documentClassMapsKeyBy: " + documentClassMapsKeyByKey);
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

  const supportReuqest = (id, updateDate) => {
    console.log("supportReuqest-> updateTime: " + updateDate);
    if (supportRequestId !== id) {
      setRemarksSupport("");
    }
    setSupportRequestId(id);
    setSupportRequestUpdateDate(updateDate);
    setSupportReuqestPopUp(true);
  }

  function submitSupport() {
    supportAccessRightRequest();
  }

  const supportAccessRightRequest = () => {

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/verify-access-rights/support`,
      {
        "usdId": supportRequestId,
        "updateTime": supportRequestUpdateDate,
        "remarksSupport": remarksSupport
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.data.message)
          setAlertStatus("success");
          setServerErrorMsg(response.data.message);
          setShowMessage(true);
          setSupportOrUnSupportSucceed(true);
        }
        globalPageLoadSetter(false)
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

  const unsupportReuqest = (id, updateDate) => {
    console.log("unsupportReuqest-> updateTime: " + updateDate);
    if (unsupportRequestId !== id) {
      setRemarksUnsupport("");
    }
    setUnsupportRequestId(id);
    setUnsupportRequestUpdateDate(updateDate);
    setUnsupportReuqestPopUp(true);
  }

  function submitUnsupport() {
    unsupportAccessRightRequest();
  }

  const unsupportAccessRightRequest = () => {

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/verify-access-rights/unsupport`,
      {
        "usdId": unsupportRequestId,
        "updateTime": unsupportRequestUpdateDate,
        "remarksUnsupport": remarksUnsupport
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.data.message)
          setAlertStatus("success");
          setServerErrorMsg(response.data.message);
          setShowMessage(true);
          setSupportOrUnSupportSucceed(true);
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

  const viewAccessRightRequest = (id) => {

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/verify-access-rights/view`,
      {
        "usdId": id
      }).then((response) => {
        if (response.status === 200) {
          setAccessRightRequestViewResponse(response.data.result);
          setShowViewEditAccessRightRequestPopUp(true);
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

  const viewRecord = (id) => {
    viewAccessRightRequest(id);
  }

  const handleCloseError = () => {
    setServerErrorMsg("");
    setShowMessage(false);
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

  const toggleViewEditAccessRightRequestPopup: () => void = (t?: VerifyRightRequestViewResponse, index?: number | null | undefined) => {
    console.log("toggleAccessRightRequestPopup");
    // setAccessRightRequest({...t})
    setShowViewEditAccessRightRequestPopUp((prev) => {
      return !prev;
    })
  };



  // const SupportRequestPopup = () => {
  //   return (
  //     <Modal
  //       open={supportReuqestPopUp}
  //       aria-labelledby="modal-modal-title"
  //       aria-describedby="modal-modal-description"
  //     >
  //       <Box
  //         display="flex"
  //         alignItems="center"
  //         justifyContent="center"
  //         height="100%"
  //       >
  //         <Container maxWidth="lg">
  //           <Grid container alignItems="center" justifyContent="center">
  //             <Grid item>
  //               <Card>
  //                 <CardContent>
  //                   <Box
  //                     component="form"
  //                     sx={{
  //                       '& .MuiTextField-root': { width: '90%' },
  //                       '& .MuiInputLabel-root': { ml: "1rem" },
  //                       '& .MuiInputBase-root': { ml: "1rem", mt: "0" }
  //                     }}
  //                     noValidate
  //                     autoComplete="off"
  //                     onSubmit={() => { }}
  //                   >
  //                     <Accordion expanded={true} className="expand_disabled">
  //                       <AccordionSummary
  //                         aria-controls="panel1a-content"
  //                         id="panel1a-header"
  //                       >
  //                         <Typography variant="h3">{t('confirmToSupport')}</Typography>
  //                       </AccordionSummary>
  //                       <AccordionDetails>
  //                         <Grid container>
  //                           <Grid container className="row">
  //                             <Typography variant="h6" gutterBottom>
  //                               {t('remarks')}:
  //                             </Typography>
  //                             <Grid container xs={10} className="field">
  //                               <TextField
  //                                 id="outlined-multiline-static"
  //                                 multiline
  //                                 rows={2}
  //                                 variant="outlined"
  //                                 value={remarks}
  //                                 onChange={(e: ChangeEvent<HTMLInputElement>) => setRemarks(e.target.value)}
  //                               />
  //                             </Grid>
  //                           </Grid>
  //                           <Grid container className="row">
  //                             <Grid item container justifyContent="end">
  //                               <Grid item>
  //                                 <Button type="button"
  //                                   sx={{ marginLeft: '10px' }}
  //                                   variant="outlined"
  //                                   startIcon={<DoDisturb fontSize="small" />}
  //                                   onClick={() => {
  //                                     setSupportReuqestPopUp(false);
  //                                   }}
  //                                 >
  //                                   {t('no')}
  //                                 </Button>
  //                               </Grid>
  //                               <Grid item>
  //                                 <Button
  //                                   type="button"
  //                                   sx={{ marginLeft: '10px' }}
  //                                   variant="contained"
  //                                   startIcon={<Check fontSize="small" />}
  //                                   onClick={() => {
  //                                     submitSupport();
  //                                     setSupportReuqestPopUp(false);
  //                                   }}>
  //                                   {t('yes')}
  //                                 </Button>
  //                               </Grid>
  //                             </Grid>
  //                           </Grid>
  //                         </Grid>
  //                       </AccordionDetails>
  //                     </Accordion>
  //                   </Box>
  //                 </CardContent>
  //               </Card>
  //             </Grid>
  //           </Grid>
  //         </Container>
  //       </Box>
  //     </Modal>
  //   );
  // }

  // const UnsupportRequestPopup = () => {
  //   return (
  //     <Modal
  //       open={unsupportReuqestPopUp}
  //       aria-labelledby="modal-modal-title"
  //       aria-describedby="modal-modal-description"
  //     >
  //       <Box
  //         display="flex"
  //         alignItems="center"
  //         justifyContent="center"
  //         height="100%"
  //       >
  //         <Container maxWidth="lg">
  //           <Grid container alignItems="center" justifyContent="center">
  //             <Grid item>
  //               <Card>
  //                 <CardContent>
  //                   <Box
  //                     component="form"
  //                     sx={{
  //                       '& .MuiTextField-root': { width: '90%' },
  //                       '& .MuiInputLabel-root': { ml: "1rem" },
  //                       '& .MuiInputBase-root': { ml: "1rem", mt: "0" }
  //                     }}
  //                     noValidate
  //                     autoComplete="off"
  //                     onSubmit={() => { }}
  //                   >
  //                     <Accordion expanded={true} className="expand_disabled">
  //                       <AccordionSummary
  //                         aria-controls="panel1a-content"
  //                         id="panel1a-header"
  //                       >
  //                         <Typography variant="h3">{t('confirmToUnsupport')}</Typography>
  //                       </AccordionSummary>
  //                       <AccordionDetails>
  //                         <Grid container>
  //                           <Grid item container justifyContent="end">
  //                             <Grid item>
  //                               <Button type="button"
  //                                 sx={{ marginLeft: '10px' }}
  //                                 variant="outlined"
  //                                 startIcon={<DoDisturb fontSize="small" />}
  //                                 onClick={() => {
  //                                   setUnsupportReuqestPopUp(false);
  //                                 }}
  //                               >
  //                                 {t('no')}
  //                               </Button>
  //                             </Grid>
  //                             <Grid item>
  //                               <Button
  //                                 type="button"
  //                                 sx={{ marginLeft: '10px' }}
  //                                 variant="contained"
  //                                 startIcon={<Check fontSize="small" />}
  //                                 onClick={() => {
  //                                   submitUnsupport();
  //                                   setUnsupportReuqestPopUp(false);
  //                                 }}>
  //                                 {t('yes')}
  //                               </Button>
  //                             </Grid>
  //                           </Grid>
  //                         </Grid>
  //                       </AccordionDetails>
  //                     </Accordion>
  //                   </Box>
  //                 </CardContent>
  //               </Card>
  //             </Grid>
  //           </Grid>
  //         </Container>
  //       </Box>
  //     </Modal>
  //   );
  // }

  return (
    <Card id="verify-access-right" >
      <SearchAccessRightRequestComponent
        setUserDocumentClassList={setUserDocumentClassList}
        setAlertStatus={setAlertStatus}
        setServerErrorMsg={setServerErrorMsg}
        setShowMessage={setShowMessage}
        documentClassMaps={documentClassMaps}
        supportOrUnSupportSucceed={supportOrUnSupportSucceed}
        setSupportOrUnSupportSucceed={setSupportOrUnSupportSucceed}
        order={order}
        orderBy={orderBy}
      />
      <SupportRequestPopupComponent
        supportReuqestPopUp={supportReuqestPopUp}
        remarks={remarksSupport}
        setRemarks={setRemarksSupport}
        setSupportReuqestPopUp={setSupportReuqestPopUp}
        submitSupport={submitSupport}
      />
      <UnsupportRequestPopupComponent
        unsupportReuqestPopUp={unsupportReuqestPopUp}
        remarks={remarksUnsupport}
        setRemarks={setRemarksUnsupport}
        setUnsupportReuqestPopUp={setUnsupportReuqestPopUp}
        submitUnsupport={submitUnsupport}
      />
      <TableContainer>
        <Table>

          {/* <TableHead>
            <TableRow>
              {
                map(resultTableColumnsSorted, function (o) {
                  return (
                    <TableCell key={o.key}>
                      {o.name}
                    </TableCell>
                  )
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
              map(userDocumentClassList, (d, idx) => (
                <TableRow
                  hover
                  key={d.usdId}
                >
                  {map(resultTableColumnsSorted, function (o) {
                    if (o.key !== "action") {
                      return (
                        <TableCell key={o.key}>
                          <Typography
                            style={o.style}
                            variant="body1"
                            color="text.primary"
                            gutterBottom
                            noWrap
                          >
                            {getCellDisplay(d[o.key], o.type, o.key)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                          </Typography>
                        </TableCell>
                      );
                    }
                  })}

                  <TableCell align="left" sx={{ width: "100px" }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '30px 30px', marginRight: 6, alignItems: "center" }}>
                      {
                        <Tooltip title={t('view')} arrow>
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.primary.lighter
                              },
                              color: theme.palette.primary.main
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => viewRecord(d.usdId)}
                          >
                            <ContentPasteSearchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        sx={{ width: "60px" }}>{t('view')}</Typography>
                    </Box>
                    {d.usdStatus === "PENDING" ?
                      <Box sx={{ display: 'grid', gridTemplateColumns: '30px 30px', marginRight: 6, alignItems: "center" }}>
                        {
                          <Tooltip title={t('support')} arrow>
                            <IconButton
                              sx={{
                                '&:hover': {
                                  background: theme.colors.primary.lighter
                                },
                                color: theme.palette.primary.main
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => supportReuqest(d.usdId, d.updateTime)}
                            >
                              <CheckBoxOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          sx={{ width: "60px" }}>{t('support')}</Typography>
                        {
                          <Tooltip title={t('unsupport')} arrow>
                            <IconButton
                              sx={{
                                '&:hover': { background: theme.colors.error.lighter },
                                color: theme.palette.error.main
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => unsupportReuqest(d.usdId, d.updateTime)}
                            >
                              <CancelOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          sx={{ width: "60px" }}>{t('unsupport')}</Typography>
                      </Box>
                      :
                      null
                    }
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      {/* <SupportRequestPopup /> */}
      {/* <UnsupportRequestPopup /> */}
      {/* Alter Message Component */}
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

      <ViewAccessRightRequestPopup
        showViewEditAccessRightRequestPopUp={showViewEditAccessRightRequestPopUp}
        toggleViewEditAccessRightRequestPopup={toggleViewEditAccessRightRequestPopup}
        accessRightRequestViewResponse={accessRightRequestViewResponse}
      />
    </Card>
  );
};

export default VerifyAccessRightResultTable;

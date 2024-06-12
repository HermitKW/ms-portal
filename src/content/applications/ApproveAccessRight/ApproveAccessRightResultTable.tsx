import React, { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback } from 'react';
import './ApproveAccessRightResultTable.scss';
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
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { UserQueryResult } from 'src/models/User';
import { TableHeader } from 'src/components/Table';
import { UserSearchCriteriaContext } from './ApproveAccessRightCriteriaContext';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, USER_CONFIG_SERVICE_URL, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from "src/constants";
import { useNavigate, useLocation } from 'react-router';
import PageLoader from "src/components/PageLoader";
import { filter, findIndex, map, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { UserDocumentClassQueryResult, ApproveRightRequestViewResponse, emptyApproveRightRequestViewResponse } from 'src/models/UserDocumentClass';
import moment, { Moment } from 'moment';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import ViewAccessRightRequestPopup from "./ViewAccessRightRequestPopup";
import { keyBy } from 'lodash';
import SearchAccessRightRequestComponent from './ApproveAccessRightSearchTable';
import EnhancedTableHead from 'src/components/EnhancedTableHead';
import { Order, concatErrorMsgWithErrorFormHelperText } from 'src/utilities/Utils';
import ApproveRequestPopupComponent from './ApproveRequestPopup';
import RejectRequestPopupComponent from './RejectRequestPopup';

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


const ApproveAccessRightResultTable: FC<UserTableProp> = ({ }) => {
  const { t } = useTranslation('approveAccessRight')

  const [userDocumentClassList, setUserDocumentClassList] = useState<UserDocumentClassQueryResult[]>([]);
  const [documentClassMapsKeyByKey, setDocumentClassMapsKeyByKey] = useState<any>(null);

  const [approveReuqestPopUp, setApproveReuqestPopUp] = useState<boolean>(false);
  const [rejectReuqestPopUp, setRejectReuqestPopUp] = useState<boolean>(false);
  const [approveRequestId, setApproveRequestId] = useState<string>("");
  const [approveRequestUpdateDate, setApproveRequestUpdateDate] = useState<Moment | null>(null);
  const [rejectRequestId, setRejectRequestId] = useState<string>("");
  const [rejectRequestUpdateDate, setRejectRequestUpdateDate] = useState<Moment | null>(null);

  const [showViewEditAccessRightRequestPopUp, setShowViewEditAccessRightRequestPopUp] = useState<boolean>(false);
  const [accessRightRequestViewResponse, setAccessRightRequestViewResponse] = useState<ApproveRightRequestViewResponse>(emptyApproveRightRequestViewResponse);

  const [documentClassMaps, setDocumentClassMaps] = useState<DocumentClassMap[]>([]);
  const [approveOrRejectSucceed, setApproveOrRejectSucceed] = useState<boolean>(true);

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<any>("");
  const [serverErrorMsg, setServerErrorMsg] = useState("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const globalPageLoadSetter = useContext(SetPageLoaderContext);

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState("createTime");

  const [remarksApprove, setRemarksApprove] = useState<string>("");
  const [remarksReject, setRemarksReject] = useState<string>("");

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
        requestFrom: "approve-access-rights"
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

  const approveReuqest = (id, updateDate) => {
    console.log("approveReuqest-> updateTime: " + updateDate);
    if (approveRequestId !== id) {
      setRemarksApprove("");
    }
    setApproveRequestId(id);
    setApproveRequestUpdateDate(updateDate);
    setApproveReuqestPopUp(true);
  }

  function submitApprove() {
    approveAccessRightRequest();
  }

  const approveAccessRightRequest = () => {

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/approve-access-rights/approve`,
      {
        "usdId": approveRequestId,
        "updateTime": approveRequestUpdateDate,
        "remarksApprove": remarksApprove
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.data.message)
          setAlertStatus("success");
          setServerErrorMsg(response.data.message);
          setShowMessage(true);
          setApproveOrRejectSucceed(true);
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

  const toggleViewEditAccessRightRequestPopup: () => void = (t?: ApproveRightRequestViewResponse, index?: number | null | undefined) => {
    console.log("toggleAccessRightRequestPopup");
    // setAccessRightRequest({...t})
    setShowViewEditAccessRightRequestPopUp((prev) => {
      return !prev;
    })
  };

  const rejectReuqest = (id, updateDate) => {
    console.log("rejectReuqest-> updateTime: " + updateDate);
    if (rejectRequestId !== id) {
      setRemarksReject("");
    }
    setRejectRequestId(id);
    setRejectRequestUpdateDate(updateDate);
    setRejectReuqestPopUp(true);
  }

  function submitReject() {
    rejectAccessRightRequest();
  }

  const rejectAccessRightRequest = () => {

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/approve-access-rights/reject`,
      {
        "usdId": rejectRequestId,
        "updateTime": rejectRequestUpdateDate,
        "remarksReject": remarksReject
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.data.message)
          setAlertStatus("success");
          setServerErrorMsg(response.data.message);
          setShowMessage(true);
          setApproveOrRejectSucceed(true);
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

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/approve-access-rights/view`,
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

  // const ApproveRequestPopup = () => {
  //   return (
  //     <Modal
  //       open={approveReuqestPopUp}
  //       aria-labelledby="modal-modal-title"
  //       aria-describedby="modal-modal-description"
  //     >
  //       <Box
  //         display="flex"
  //         alignItems="center"
  //         justifyContent="center"
  //         height="100%"
  //       >
  //         <Container maxWidth={false}>
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
  //                         <Typography variant="h3">{t('confirmToApprove')}</Typography>
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
  //                                   setApproveReuqestPopUp(false);
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
  //                                   submitApprove();
  //                                   setApproveReuqestPopUp(false);
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

  // const RejectRequestPopup = () => {
  //   return (
  //     <Modal
  //       open={rejectReuqestPopUp}
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
  //                         <Typography variant="h3">{t('confirmToReject')}</Typography>
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
  //                                   setRejectReuqestPopUp(false);
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
  //                                   submitReject();
  //                                   setRejectReuqestPopUp(false);
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
    <Card id="approve-access-right" >
      <SearchAccessRightRequestComponent
        setUserDocumentClassList={setUserDocumentClassList}
        setAlertStatus={setAlertStatus}
        setServerErrorMsg={setServerErrorMsg}
        setShowMessage={setShowMessage}
        documentClassMaps={documentClassMaps}
        approveOrRejectSucceed={approveOrRejectSucceed}
        setApproveOrRejectSucceed={setApproveOrRejectSucceed}
        order={order}
        orderBy={orderBy}
      />
      <ApproveRequestPopupComponent
        approveReuqestPopUp={approveReuqestPopUp}
        remarks={remarksApprove}
        setRemarks={setRemarksApprove}
        setApproveReuqestPopUp={setApproveReuqestPopUp}
        submitApprove={submitApprove}
      />
      <RejectRequestPopupComponent
        rejectReuqestPopUp={rejectReuqestPopUp}
        remarks={remarksReject}
        setRemarks={setRemarksReject}
        setRejectReuqestPopUp={setRejectReuqestPopUp}
        submitReject={submitReject}
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
                    {d.usdStatus === "SUPPORTED" ?
                      <Box sx={{ display: 'grid', gridTemplateColumns: '30px 30px', marginRight: 6, alignItems: "center" }}>
                        {
                          <Tooltip title={t('approve')} arrow>
                            <IconButton
                              sx={{
                                '&:hover': {
                                  background: theme.colors.primary.lighter
                                },
                                color: theme.palette.primary.main
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => approveReuqest(d.usdId, d.updateTime)}
                            >
                              <CheckBoxOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          sx={{ width: "60px" }}>{t('approve')}</Typography>
                        {
                          <Tooltip title={t('reject')} arrow>
                            <IconButton
                              sx={{
                                '&:hover': { background: theme.colors.error.lighter },
                                color: theme.palette.error.main
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => rejectReuqest(d.usdId, d.updateTime)}
                            >
                              <CancelOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          sx={{ width: "60px" }}>{t('reject')}</Typography>
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
      {/* <ApproveRequestPopup />
      <RejectRequestPopup /> */}
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

export default ApproveAccessRightResultTable;

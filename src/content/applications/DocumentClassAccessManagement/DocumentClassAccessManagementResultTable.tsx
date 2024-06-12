import React, { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback } from 'react';
import './index.scss';
import './DocumentClassAccessManagementResultTable.scss';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import {
  Tooltip,
  Box,
  FormControl,
  InputLabel,
  Card,
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
  Container,
  Grid,
  TextField,
  Button,
  Modal,
  CardContent,
} from '@mui/material';
import { Check, DoDisturb, Save, ToggleOffTwoTone, Close } from "@mui/icons-material";
import { TableHeader } from 'src/components/Table';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from "src/constants";
import { useNavigate, useLocation } from 'react-router';
import PageLoader from "src/components/PageLoader";
import { filter, findIndex, map, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { UserDocumentClassQueryResult, AccessRightRequestViewResponse, emptyAccessRightRequestViewResponse, AccessRightRequestInput, emptyAccessRightRequestInput } from 'src/models/UserDocumentClass';
import moment, { Moment } from 'moment';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import AccessRightRequestPopup from "./AccessRightRequestPopup";
import ViewEditAccessRightRequestPopup from "./ViewEditAccessRightRequestPopup";
import SearchAccessRightRequestComponent from './DocumentClassAccessManagementSearchTable';
import { concatErrorMsg } from "src/utilities/Utils";
import { keyBy } from 'lodash';
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

interface RequestErrorMessage {
  accessDateFrom: any
  accessDateTo: any
  importDateFrom: any,
  importDateTo: any,
  documentClass: any
}

interface DocumentClassMap {
  key: any
  value: any
}

const DocumentClassAccessManagementResultTable: FC<UserTableProp> = ({ }) => {

  const [isSortDesc, setIsSortDesc] = useState<boolean>(false);

  const globalPageLoadSetter = useContext(SetPageLoaderContext);
  const { t } = useTranslation('documentClassAccessMgmnt')


  const [userDocumentClassList, setUserDocumentClassList] = useState<UserDocumentClassQueryResult[]>([]);
  const [accessRightRequestViewResponse, setAccessRightRequestViewResponse] = useState<AccessRightRequestViewResponse>(emptyAccessRightRequestViewResponse);

  const [accessRightRequest, setAccessRightRequest] = useState<AccessRightRequestInput>(emptyAccessRightRequestInput);

  const [documentClassMaps, setDocumentClassMaps] = useState<DocumentClassMap[]>([]);
  const [documentClassMapsKeyByKey, setDocumentClassMapsKeyByKey] = useState<any>(null);

  const [requestErrorMessage, setRequestErrorMessage] = useState<RequestErrorMessage>(null);
  const [disabledEdition, setDisabledEdition] = useState<boolean>(true);

  const [updateOrConfirmSucceed, setUpdateOrConfirmSucceed] = useState<boolean>(true);

  const [showAccessRightRequestPopUp, setShowAccessRightRequestPopUp] = useState<boolean>(false);
  const [showViewEditAccessRightRequestPopUp, setShowViewEditAccessRightRequestPopUp] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<any>("");
  const [serverErrorMsg, setServerErrorMsg] = useState("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState("createTime");

  const handleRequestSort = (_: unknown, property: string) => {
    const isAsc = orderBy === property && order !== "asc";
    const newOrder = isAsc ? "asc" : "desc";
    setOrder(newOrder);
    setOrderBy(property);
  }

  useEffect(() => {
    loadDocumentClassesMap();
  }, []);

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

  const viewRecord = (id) => {
    viewAccessRightRequest(id);
  }


  const comfirmRequest = () => {
    resetRequestErrorMessage();
    confirmAccessRightRequest();
  }

  const updateRequest = () => {
    resetRequestErrorMessage();
    updateAccessRightRequest();
  }

  const resetRequestErrorMessage = () => {
    setRequestErrorMessage(null);
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


  const loadDocumentClassesMap = () => {

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/document-classes/map`,
      {
        requestFrom: "access-right-requests"
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

  const confirmAccessRightRequest = () => {

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/access-right-requests/confirm`,
      {
        "usdDocClass": accessRightRequest.documentClassInput,
        "usdAccessStime": dateFormatterToYYYYMMDD(accessRightRequest.accessDateFromInput),
        "usdAccessEtime": dateFormatterToYYYYMMDD(accessRightRequest.accessDateToInput),
        "usdImportDateFrom": dateFormatterToYYYYMMDD(accessRightRequest.importDateFromInput),
        "usdImportDateTo": dateFormatterToYYYYMMDD(accessRightRequest.importDateToInput),
        "usdReason": accessRightRequest.requestReasonInput
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.data.message)
        }
        setAlertStatus("success");
        setServerErrorMsg(response.data.message);
        setShowMessage(true);
        setShowAccessRightRequestPopUp(false);
        setAccessRightRequest(emptyAccessRightRequestInput);
        setUpdateOrConfirmSucceed(true);
        console.log(response)
      }).catch((error) => {
        if (error.response.status === 530) {
          const messageResult = error.response.data.result;
          console.log("messageResult: " + messageResult);
          setRequestErrorMessage({
            ...requestErrorMessage, "accessDateFrom": (!!messageResult.accessDateFrom ? concatErrorMsg(messageResult.accessDateFrom) : ""),
            "accessDateTo": (!!messageResult.accessDateTo ? concatErrorMsg(messageResult.accessDateTo) : ""),
            "importDateFrom": (!!messageResult.importDateFrom ? concatErrorMsg(messageResult.importDateFrom) : ""),
            "importDateTo": (!!messageResult.importDateTo ? concatErrorMsg(messageResult.importDateTo) : ""),
            "documentClass": (!!messageResult.documentClass ? concatErrorMsgWithErrorFormHelperText(messageResult.documentClass) : "")
          });
          setDisabledEdition(false);
          setAlertStatus("error");
          setServerErrorMsg(error.response.data.message);
          setShowMessage(true);
          console.log(serverErrorMsg);
        } else {
          setAlertStatus("error");
          setServerErrorMsg(error.response.data.message);
          setShowMessage(true);
          console.log(serverErrorMsg);
        }

        globalPageLoadSetter(false)
        console.log(error)
      });
  }

  const updateAccessRightRequest = () => {

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/access-right-requests/update`,
      {
        "usdId": accessRightRequestViewResponse.usdId,
        "updateTime": accessRightRequestViewResponse.updateTime,
        "usdDocClass": accessRightRequestViewResponse.usdDocClass,
        "usdAccessStime": dateFormatterToYYYYMMDD(accessRightRequestViewResponse.usdAccessStime),
        "usdAccessEtime": dateFormatterToYYYYMMDD(accessRightRequestViewResponse.usdAccessEtime),
        "usdImportDateFrom": dateFormatterToYYYYMMDD(accessRightRequestViewResponse.usdImportDateFrom),
        "usdImportDateTo": dateFormatterToYYYYMMDD(accessRightRequestViewResponse.usdImportDateTo),
        "usdReason": accessRightRequestViewResponse.usdReason
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.data.message)
          setAlertStatus("success");
          setServerErrorMsg(response.data.message);
          setShowMessage(true);
          setShowViewEditAccessRightRequestPopUp(false);
          setDisabledEdition(true);
          setUpdateOrConfirmSucceed(true);
        }
        console.log(response)
      }).catch((error) => {
        console.log(" error: " + error);
        if (error.response.status === 530) {
          const messageResult = error.response.data.result;
          console.log("messageResult: " + messageResult);
          setRequestErrorMessage({
            ...requestErrorMessage, "accessDateFrom": (!!messageResult.accessDateFrom ? concatErrorMsg(messageResult.accessDateFrom) : ""),
            "accessDateTo": (!!messageResult.accessDateTo ? concatErrorMsg(messageResult.accessDateTo) : ""),
            "importDateFrom": (!!messageResult.importDateFrom ? concatErrorMsg(messageResult.importDateFrom) : ""),
            "importDateTo": (!!messageResult.importDateTo ? concatErrorMsg(messageResult.importDateTo) : ""),
            "documentClass": (!!messageResult.documentClass ? concatErrorMsg(messageResult.documentClass) : "")
          });
          setDisabledEdition(false);
          setAlertStatus("error");
          setServerErrorMsg(error.response.data.message);
          setShowMessage(true);
          console.log(serverErrorMsg);
        } else {
          setAlertStatus("error");
          setServerErrorMsg(error.response.data.message !== null ? error.response.data.message : "System Error");
          setShowMessage(true);
          console.log(serverErrorMsg);
        }
        globalPageLoadSetter(false)
        console.log(error)
      });
  }

  const viewAccessRightRequest = (id) => {

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/access-right-requests/view`,
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

  const clickSort = () => {
    setIsSortDesc(!isSortDesc)
  }

  const clickPopup = () => {
    setShowAccessRightRequestPopUp(true);
  }

  const toggleAccessRightRequestPopup: () => void = (t?: AccessRightRequestInput, index?: number | null | undefined) => {
    console.log("toggleAccessRightRequestPopup");
    // setAccessRightRequest({...t})
    setShowAccessRightRequestPopUp((prev) => {
      return !prev;
    })
  };

  const toggleViewEditAccessRightRequestPopup: () => void = (t?: AccessRightRequestViewResponse, index?: number | null | undefined) => {
    console.log("toggleAccessRightRequestPopup");
    // setAccessRightRequest({...t})
    resetRequestErrorMessage();
    setShowViewEditAccessRightRequestPopUp((prev) => {
      return !prev;
    })
  };



  return (
    <Card id="document-class-access-mgmnt" >
      <SearchAccessRightRequestComponent
        setUserDocumentClassList={setUserDocumentClassList}
        setAlertStatus={setAlertStatus}
        setServerErrorMsg={setServerErrorMsg}
        setShowMessage={setShowMessage}
        documentClassMaps={documentClassMaps}
        clickPopup={clickPopup}
        updateOrConfirmSucceed={updateOrConfirmSucceed}
        setUpdateOrConfirmSucceed={setUpdateOrConfirmSucceed}
        order={order}
        orderBy={orderBy}
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
                       {
                        o.key === "requestNo"
                          ?
                          <IconButton onClick={clickSort} size="small">
                            {
                              !isSortDesc ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />
                            }
                          </IconButton>
                          :
                          null
                      }
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
                  {<TableCell align="right" sx={{ width: "90px" }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '30px 30px 30px' }}>
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
                    </Box>
                  </TableCell>}

                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
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
      <AccessRightRequestPopup
        showAccessRightRequestPopUp={showAccessRightRequestPopUp}
        toggleAccessRightRequestPopup={toggleAccessRightRequestPopup}
        comfirmRequest={comfirmRequest}
        accessRightRequest={accessRightRequest}
        setAccessRightRequest={setAccessRightRequest}
        requestErrorMessage={requestErrorMessage}
        documentClassMaps={documentClassMaps}
      />
      <ViewEditAccessRightRequestPopup
        showViewEditAccessRightRequestPopUp={showViewEditAccessRightRequestPopUp}
        toggleViewEditAccessRightRequestPopup={toggleViewEditAccessRightRequestPopup}
        updateRequest={updateRequest}
        accessRightRequestViewResponse={accessRightRequestViewResponse}
        setAccessRightRequestViewResponse={setAccessRightRequestViewResponse}
        requestErrorMessage={requestErrorMessage}
        disabledEdition={disabledEdition}
        setDisabledEdition={setDisabledEdition}
      />
    </Card>
  );
};


export default DocumentClassAccessManagementResultTable;

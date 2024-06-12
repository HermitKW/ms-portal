import React, { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback } from 'react';
import './UserProfileResultTable.scss';
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
import { UserSearchCriteriaContext } from './UserProfileCriteriaContext';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, USER_CONFIG_SERVICE_URL, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from "src/constants";
import { useNavigate } from 'react-router';
import PageLoader from "src/components/PageLoader";
import { filter, findIndex, join, map, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { UserDocumentClassQueryResult, ApproveRightRequestViewResponse, emptyApproveRightRequestViewResponse } from 'src/models/UserDocumentClass';
import { AccountProfileQueryResult } from 'src/models/AccountProfile';
import { UserRole } from 'src/models/UserRole';
import moment, { Moment } from 'moment';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
// import ViewAccessRightRequestPopup from "./ViewAccessRightRequestPopup";
import { keyBy } from 'lodash';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import SearchUserProfileComponent from './UserProfileSearchTable';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import i18n from "src/i18n";
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

interface TeamMap {
  key: any
  value: any
}

interface RoleMap {
  key: any
  value: any
}


const UserProfileResultTable: FC<UserTableProp> = ({ }) => {
  const { t } = useTranslation('userProfile')

  const [userProfileSearchResultList, setUserProfileSearchResultList] = useState<AccountProfileQueryResult[]>([]);


  const [documentClassMaps, setDocumentClassMaps] = useState<DocumentClassMap[]>([]);
  const [documentClassMapsKeyByKey, setDocumentClassMapsKeyByKey] = useState<any>(null);
  const [teamMaps, setTeamMaps] = useState<TeamMap[]>([]);
  const [teamMapsKeyByKey, setTeamMapsKeyByKey] = useState<any>(null);
  const [roleMaps, setRoleMaps] = useState<RoleMap[]>([]);
  const [roleMapsKeyByKey, setRoleMapsKeyByKey] = useState<any>(null);

  const [alertStatus, setAlertStatus] = useState<any>("");
  const [serverErrorMsg, setServerErrorMsg] = useState("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const globalPageLoadSetter = useContext(SetPageLoaderContext);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState("accUi");

  const handleRequestSort = (_: unknown, property: string) => {
    const isAsc = orderBy === property && order !== "asc";
    const newOrder = isAsc ? "asc" : "desc";
    setOrder(newOrder);
    setOrderBy(property);
  }

  useEffect(() => {
    loadDocumentClassesMap();
    loadTeamsMap();
    loadRoleMap();
  }, []);

  const navigateWithLocale = useNavigateWithLocale();
  const navigate = useNavigate();

  const editUser = function (id: string) {
    return navigateWithLocale(`user-profile`)(id);
  }
  // , style: {whiteSpace: "break-spaces"}
  const resultTableColumns = [
    { name: t('ui'), key: 'accUi', seq: 1, type: 'string', style: {}, canOrder: true }
    , { name: t('name'), key: 'accName', seq: 2, type: 'string', canOrder: true }
    , { name: t('post'), key: 'accPost', seq: 4, type: 'string', canOrder: true }
    , { name: t('team'), key: 'teamName', seq: 5, type: 'string', canOrder: true }
    , { name: t('role'), key: 'role', seq: 6, type: 'string', style: {}, canOrder: false }
    , { name: t('documentClass'), key: 'documentClass', seq: 7, type: 'string', style: {}, canOrder: false }
    , { name: t('status'), key: 'accStatus', seq: 8, type: 'string', canOrder: true }
    , { name: t('action'), key: 'action', seq: 9, type: 'string', canOrder: false }
  ]

  const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });
  const sortableResultTableColumns = resultTableColumnsSorted.map(column => ({ id: column.key, label: column.name, canOrder: column.canOrder }));

  const getCellDisplay = (value, type, columnKey, item) => {
    if (type === 'date') return moment(value).format('yyyy-MM-DD')
    if (type === 'datetime') return moment(value).format('yyyy-MM-DD HH:mm:ss')
    if (columnKey === 'role') return getRoleNameList(item)
    if (columnKey === 'documentClass') return getDocumentClassList(item)
    if (columnKey === 'usdDocClass') return documentClassMapping(value);
    if (columnKey === 'accStatus') return statusMapping(value);
    return value
  }

  const getRoleNameList = (item) => {
    if (!item['roles']) return "";
    return join(map(item['roles'], function (i) { return i.usrRolId }), '\n')
  }

  const getDocumentClassList = (item) => {
    if (!item['roles']) return "";
    return join(map(item['roles'], function (i) { return i.usrDcId ? i.usrDcId : " " }), '\n')
  }

  const documentClassMapping = (documentClassKey) => {
    if (!documentClassKey || !documentClassMapsKeyByKey) return "";
    return documentClassMapsKeyByKey[documentClassKey]?.value;
  }

  const statusMapping = (statusCode) => {
    if (!statusCode) return "";

    if ("A" === statusCode){
      return "Active"
    }else if ("I" === statusCode){
      return "Inactive"
    }else{
      return "Unrecognized Status Code"
    }
  }

  const documentClassMapsKeyBy = (documentClassMaps) => {
    setDocumentClassMapsKeyByKey(keyBy(documentClassMaps, "key"));
  }

  const teamMapsKeyBy = (teamsMaps) => {
    setTeamMapsKeyByKey(keyBy(teamsMaps, "key"));
  }

  const roleMapsKeyBy = (rolesMaps) => {
    setRoleMapsKeyByKey(keyBy(rolesMaps, "key"));
  }

  const theme = useTheme();


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
    // globalPageLoadSetter(false);
  }

  const loadTeamsMap = () => {

    globalPageLoadSetter(true);

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/auth-service/teams/map`,
      {

      }).then((response) => {
        if (response.status === 200) {
          let teamMaps: TeamMap[] = map(response.data.result, function (i) {
            let teamMap: TeamMap = {
              key: i.key,
              value: i.value
            }
            return teamMap
          });
          console.log("setTeamMaps: " + teamMaps);
          setTeamMaps(teamMaps);
          teamMapsKeyBy(teamMaps);
        }
        console.log(response)
      }).catch((error) => {
        setAlertStatus("error");
        setServerErrorMsg(error.response.data.message);
        setShowMessage(true);
        console.log(serverErrorMsg);
        console.log(error)
      });
    // setShowLoader(false);
  }

  

  const loadRoleMap = () => {

    globalPageLoadSetter(true);

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/auth-service/role/map`,
      {

      }).then((response) => {
        if (response.status === 200) {
          let roleMaps: RoleMap[] = map(response.data.result, function (i) {
            let roleMap: RoleMap = {
              key: i.key,
              value: i.value
            }
            return roleMap
          });
          console.log("setRoleMaps: " + roleMaps);
          setRoleMaps(roleMaps);
          roleMapsKeyBy(roleMaps);
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


  return (
    <Card id="maintain-user-profile" >
      <SearchUserProfileComponent
        setUserProfileSearchResultList={setUserProfileSearchResultList}
        setAlertStatus={setAlertStatus}
        setServerErrorMsg={setServerErrorMsg}
        setShowMessage={setShowMessage}
        documentClassMaps={documentClassMaps}
        teamMaps={teamMaps}
        order={order}
        orderBy={orderBy}
        roleMaps={roleMaps}
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
              map(userProfileSearchResultList, (d, idx) => (
                <TableRow
                  hover
                  key={d.accId}
                >
                  {map(resultTableColumnsSorted, function (o) {
                    if (o.key !== "action") {
                      return (
                        <TableCell key={o.key}>
                          <Typography
                            style={o.style}
                            sx={{ whiteSpace: "break-spaces" }}
                            variant="body1"
                            color="text.primary"
                            gutterBottom
                            noWrap
                          >
                            {getCellDisplay(d[o.key], o.type, o.key, d)}
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
                        <Tooltip title="Edit" arrow>
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.primary.lighter
                              },
                              color: theme.palette.primary.main
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => { editUser(d.accId) }}
                          >
                            <EditTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        sx={{ width: "60px" }}></Typography>
                    </Box>
                  </TableCell>

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
    </Card>
  );
};

export default UserProfileResultTable;

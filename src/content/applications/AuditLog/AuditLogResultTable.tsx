import { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { orderBy as orderByLodash } from 'lodash';
import './AuditLogResultTable.scss';
import {
  TextareaAutosize,
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
  Radio,
  RadioGroup,
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
import { Check, DoDisturb, Save, ToggleOffTwoTone } from "@mui/icons-material";

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import { DocumentClassQueryResult } from 'src/models/DocumentClass';
import { TableHeader } from 'src/components/Table';
import { DatePicker } from '@mui/lab';
import moment, { Moment } from 'moment';
import { Search, Add } from '@mui/icons-material';
import { CATSLAS_BACKEND_SERVICE_URL, DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, SYSTEM_CONFIG_SERVICE_URL, USER_CONFIG_SERVICE_URL } from "src/constants";
import { useNavigate, useLocation } from 'react-router';
import PageLoader from "src/components/PageLoader";
import { filter, findIndex, map, sortBy } from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { timeout } from 'q';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import customAxios from '../../../utilities/CustomAxios';
import EnhancedTableHead from 'src/components/EnhancedTableHead';
import { Order, concatErrorMsg } from 'src/utilities/Utils';
import axios from 'axios';
import { GlobalSnackbarSetter } from 'src/components/GlobalSnackbar/GlobalSnackbarContext';

interface SearchErrorMessage {
  logDateFrom: any
  logDateTo: any
}
interface UserTableProp {
  className?: string;
}
// interface UserFootprintLogQueryResult{

// }

const AuditLogResultTable: FC<UserTableProp> = ({ }) => {
  const globalSnackbarSetter = useContext(GlobalSnackbarSetter);
  const { t } = useTranslation('enquiryActivitiesLog')
  const [checkedAll, setCheckedAll] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const [count, setCount] = useState<number>(0);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);


  const [dataTemp, setDataTemp] = useState<any>(null);

  const [logTypeList,setLogTypeList] = useState<any>(null)
  const [logType, setLogType] = useState<string>("All");
  const [accName, setAccName] = useState<string>("");
  const [accPost, setAccPost] = useState<string>("");
  const [logDateFrom,setLogDateFrom] = useState<string>("");
  const [logDateTo,setLogDateTo] = useState<string>("");

  const [showLoader, setShowLoader] = useState<boolean>(false);

  const globalPageLoadSetter = useContext(SetPageLoaderContext);

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<string>("logDate")

  const [searchErrorMessage, setSearchErrorMessage] = useState<SearchErrorMessage>(null);
  const theme = useTheme();

  const columns = [
    { name: t('logId'), key: 'id', seq: 1, type: 'string' },
    { name: t('ui'), key: 'ui', seq:2, type: 'string' },
    { name: t('name'), key: 'accName', seq: 3, type: 'string' },
    { name: t('post'), key: 'accPost', seq: 4, type: 'string' },
    { name: t('logDate'), key: 'logDate', seq: 5, type: 'datetime' },
    { name: t('logType'), key: 'type', seq: 6, type: 'string', width:"200px" },
    { name: t('actDescr'), key: 'actionDescr', seq: 7, type: 'string', width:"200px" },
    { name: t('logDetails'), key: 'logDetails', seq: 8, type: 'string', width:"200px" },
  ]

  const columnsSorted = sortBy(columns, function (o) { return o.seq });

  const header = columnsSorted.map((colunm) => {
    return {
      id: colunm.key,
      label: colunm.name,
      canOrder: !(colunm.key === "action"),
    }
  });
  const searchIntelligenceSharingReport = () => {
    setSearchErrorMessage(null)
    setPage(0);
    loadData(0, limit,orderBy,order);
  };

  
  function loadLogTypeList() {
    globalPageLoadSetter(true);
    axios.get(`${SYSTEM_CONFIG_SERVICE_URL}/api/v1/system-administration/user-footprint-log/log-type-list`).then((response: any) => {
        globalPageLoadSetter(true);
        console.log(response)
        const responseData = orderByLodash(response.data?.result,['logType'],['asc']);
        setLogTypeList([{id:0,logType:'All'},...responseData]);
      }).finally(() => globalPageLoadSetter(false))
        .catch((error) => {
        console.error('error: ' + error);
      });
  }
  function loadData(page, limit,orderBy,order) {
    console.log(orderBy)
    console.log(order)
    globalPageLoadSetter(true);
    axios.post(`${SYSTEM_CONFIG_SERVICE_URL}/api/v1/system-administration/user-footprint-log/search`,
      {
        logType: logType === "All" ? "ALL" : logType,
        accName: accName,
        accPost: accPost,
        logDateFrom: logDateFrom,
        logDateTo: logDateTo,
        orderBy: orderBy,
        order: order,
        limit: limit,
        offset: page * (limit - 1)
      }).then((response: any) => {
        globalPageLoadSetter(true);
        const responseData = response.data;
        setDataTemp(responseData.result?.searchUserFootprintLogResponse);
        setCount(responseData.result?.count);
      }).finally(() => globalPageLoadSetter(false))
        .catch((error) => {
          if (error.response.status === 530) {
            const messageResult = error.response.data.result;
            setSearchErrorMessage({
                ...searchErrorMessage, "logDateFrom": (!!messageResult.logDateFrom ? concatErrorMsg(messageResult.logDateFrom) : ""),
                "logDateTo": (!!messageResult.logDateTo ? concatErrorMsg(messageResult.logDateTo) : "")
            });
        } 
        globalPageLoadSetter(false)
        console.log(error)
      });
  }

  const emptyFields = () => {
    setLogType('All')
    setAccName('')
    setAccPost('')
    setLogDateFrom('')
    setLogDateTo('')
  }

  const getCellDisplay = (value, type, columnKey) => {
    if(type === 'datetime') return !!value ? moment(value).format("YYYY-MM-DD hh:mm:ss") : "--"
    if(type === 'jsonString') return "123"
    return value
  }

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
    console.log("set page to:" + newPage);
    loadData(newPage, limit,orderBy,order);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    console.log("set limit to: " + parseInt(event.target.value))
    loadData(page, parseInt(event.target.value),orderBy,order);
  };

  const clickResetButton = () => {
    emptyFields();
  }

  useEffect(() => {
    loadLogTypeList();
    loadData(0, limit,orderBy,order);
    // globalPageLoadSetter(true)
  }, [])

  const changeLogDateFrom = (newValue) => {
    setLogDateFrom(newValue);
};

const changeLogDateTo = (newValue) => {
  setLogDateTo(newValue);
};

function sortResult (e,p){
  setOrderBy(p);
  setOrder(order === "asc" ? 'desc': "asc");
  loadData(page, limit,p,order === "asc" ? 'desc': "asc");
}

  return (
    <Card id="maintain-document-class" >
      <PageLoader showLoader={showLoader}></PageLoader>
      <>
        <Container maxWidth={false} disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container'>
          <Grid container className='row'>
            <Grid className='field'>
            <FormControl variant="standard" sx={{ minWidth: 150 }}>
                <InputLabel>{t('logType')}</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={logType}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setLogType(e.target.value)}
                >
                  {map(logTypeList,function (d) {return (
                    <MenuItem key={d.id} value={d.logType}>{d.logType}</MenuItem>
                  )})}
                </Select>
              </FormControl>
            </Grid>
            <Grid className='field'>
              <TextField
                label={t('name')}
                placeholder={t('contain')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                value={accName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAccName((e.target.value))}
              />
            </Grid>
            <Grid className='field'>
              <TextField
                label={t('post')}
                placeholder={t('contain')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                value={accPost}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAccPost((e.target.value))}
              />
            </Grid>
            <Grid>
          <FormControl>
              <DatePicker
                  label={t("dateFrom")}
                  value={logDateFrom}
                  onChange={changeLogDateFrom}
                  mask="____-__-__"
                  inputFormat="YYYY-MM-DD"
                  renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!searchErrorMessage?.logDateFrom} helperText={searchErrorMessage?.logDateFrom} />}
              />
          </FormControl>
          </Grid>
          <Grid>
          <FormControl>
              <DatePicker
                  label={t("dateTo")}
                  value={logDateTo}
                  onChange={changeLogDateTo}
                  mask="____-__-__"
                  inputFormat="YYYY-MM-DD"
                  renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!searchErrorMessage?.logDateTo} helperText={searchErrorMessage?.logDateTo} />}
              />
          </FormControl>
          </Grid>
          </Grid>
        
          <Grid container className='row'>
            <Grid item marginLeft={"auto"}>
              <Button
                variant="outlined"
                sx={{ marginRight: 1 }}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  clickResetButton()
                }}
                size="medium"
              >
                {t('reset')}
              </Button>
              <Button
                variant="contained"
                startIcon={<Search fontSize="small" />}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                 searchIntelligenceSharingReport()
                }}
                size="medium"
              >
                {t('search')}
              </Button>
            </Grid>
          </Grid>
          <Grid container className='row' sx={{ marginTop: 1 }}>
            <Grid item sx={{ marginLeft: "auto" }}>
              <TablePagination
                component="div"
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                count={count}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_OPTIONS}
              />
            </Grid>
          </Grid>
        </Container>

        <TableContainer>
          <Table>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={(e, p) => {
              sortResult(e,p)
              
            }} headCells={header} />

            <TableBody>
              {
                map(dataTemp, (d, idx) => (
                  <TableRow
                    hover
                    key={d.id}
                  >
                    {map(columnsSorted, function (o) {
                      return (
                        <TableCell key={o.key} sx={{maxWidth: o.width??null, wordBreak:"break-word"}}>
                          <Typography
                            variant="body1"
                            color="text.primary"
                            gutterBottom
                          >
                            {getCellDisplay(d[o.key], o.type, o.key)}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </Card>
  );
};

export default AuditLogResultTable;

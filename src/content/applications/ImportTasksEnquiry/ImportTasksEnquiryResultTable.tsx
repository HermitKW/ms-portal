import { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import RefreshIcon from '@mui/icons-material/Refresh';
import PropTypes from 'prop-types';
import './ImportTasksEnquiryResultTable.scss';
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
import { CATSLAS_BACKEND_SERVICE_URL, DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, USER_CONFIG_SERVICE_URL } from "src/constants";
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
import { Order } from 'src/utilities/Utils';
import axios from 'axios';
import { GlobalSnackbarSetter } from 'src/components/GlobalSnackbar/GlobalSnackbarContext';

interface UserTableProp {
  className?: string;
}

const ImportTasksEnquiryTable: FC<UserTableProp> = ({ }) => {
  const globalSnackbarSetter = useContext(GlobalSnackbarSetter);
  const { t } = useTranslation('maintainDocumentClass')
  const [checkedAll, setCheckedAll] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const [count, setCount] = useState<number>(0);
  const [docId, setDocId] = useState<string>("");
  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  const [searchDocumentClass,setSearchDocumentClass] = useState<string>("");
  const [searchCode, setSearchCode] = useState<string>("");
  const [searchDescription, setSearchDescription] = useState<string>("");

  const [dataTemp, setDataTemp] = useState<DocumentClassQueryResult[]>(null);

  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [maxsize, setMaxsize] = useState<number>();
  const [retentionPeriod, setRetentionPeriod] = useState<number>();
  const [importingPath, setImportingPath] = useState<string>(null);
  const [defaultGrantedTimePeriod, setDefaultGrantedTimePeriod] = useState<number>();
  const [notificationBeforeRetentionPeriod, setNotificationBeforeRetentionPeriod] = useState<string>();
  const [notificationForSuccess, setNotificationForSuccess] = useState<string>();
  const [emailList, setEmailList] = useState<string>("");

  const [showLoader, setShowLoader] = useState<boolean>(false);

  const globalPageLoadSetter = useContext(SetPageLoaderContext);

  const [documentClass, setDocumentClass] = useState<any>("");
  const [managePage, setManagePage] = useState<boolean>(false);

  const [editMode, setEditMode] = useState<boolean>(false);

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<string>("update_Time")

  const [updateTime, setUpdateTime] = useState<Date>();

  const [docStatus,setDocStatus] = useState<boolean>(false);
  const [orderStatus,setOrderStatus] = useState<boolean>(false);

  const theme = useTheme();

  const columns = [
    { name: t('documentClass'), key: 'documentClass', seq: 1, type: 'string' }
    , { name: t('code'), key: 'code', seq: 2, type: 'string' },
    { name: t('description'), key: 'description', seq: 3, type: 'string' },
    { name: t('importStartTime'), key: 'lastImpStartTime', seq: 4, type: 'datetime' },
    { name: t('importEndTime'), key: 'lastImpEndTime', seq: 5, type: 'datetime' },
    { name: t('action'), key: 'action', seq: 6 },

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
    setPage(0);
    loadData(0, limit);
  };

  useEffect(() => {
    if (docId === "") {
      emptyFields();
    }
  }, [managePage, dataTemp, docId]);

  useEffect(() => {
    if (docStatus) {
      const doReload = async () => {
        await Promise.resolve();
        setDocId("");
        searchIntelligenceSharingReport();
      };
      doReload();
      setDocStatus(false)
    }
  }, [docStatus]);

 
  useEffect(() => {
    orderStatus && loadData(page, limit);
    setOrderStatus(false)
  }, [orderStatus]);
  
  function loadData(page, limit) {
    globalPageLoadSetter(true);
    customAxios.post(`${CATSLAS_BACKEND_SERVICE_URL}/api/v1/system-administration/document-classes/rerun-list`,
      {
        docName: searchDocumentClass,
        docId: searchCode,
        docDesc: searchDescription,
        orderByMapped: orderBy,
        orderMapped: order,
        limit: limit,
        offset: page * (limit - 1)
      }).then((response: any) => {
        globalPageLoadSetter(true);
        const responseData = response.data;
        let arr = responseData.result.data.map(item => ({
          code: item['docId'],
          documentClass: item['docName'],
          description: item['docDesc'],
          lastImpStartTime:item['lastImpStartTime'],
          lastImpEndTime:item['lastImpEndTime']
        }));
        setDataTemp(arr);
        setCount(responseData.result.total);
      }).finally(() => globalPageLoadSetter(false))
        .catch((error) => {
        console.error('error: ' + error);
      });
  }


  const emptyFields = function () {
    setName("");
    setCode("")
    setDescription("");
    setMaxsize(0);
    setRetentionPeriod(0);
    setImportingPath(null);
    setDefaultGrantedTimePeriod(0);
    setNotificationBeforeRetentionPeriod("N");
    setNotificationForSuccess("Y");
    setEmailList("");
  }

  const getCellDisplay = (value, type, columnKey) => {
    if(type === 'datetime') return !!value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : "--"
    return value
  }

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
    console.log("set page to:" + newPage);
    loadData(newPage, limit);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    console.log("set limit to: " + parseInt(event.target.value))
    loadData(page, parseInt(event.target.value));
  };

  const clickResetButton = () => {
    setSearchDocumentClass("");
    setSearchCode("");
    setSearchDescription("")
  }

  const rerunImportJob = ()=>{
    globalPageLoadSetter(true);
    axios.post(`${CATSLAS_BACKEND_SERVICE_URL}/api/v1/batch/rerun-by-doc-id`,
    {
      docId: documentClass.code,
    }).then((response: any) => {
      globalSnackbarSetter({
        showSnackbar: true,
        snackbarMsg: "job rerun successfully trigger",
        snackbarSeverity: "success",
      });
      const responseData = response.data;
      loadData(page, limit);
      console.log(response)
    }).finally(() => globalPageLoadSetter(false))
      .catch((error) => {
      console.error('error: ' + error);
    });
  }

  const Popup = () => {

    return (
      <Modal
        open={showPopUp}
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
                    >
                      <Accordion expanded={true} className="expand_disabled">
                        <AccordionSummary
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography variant="h3">{t('Confirm to rerun ')+ documentClass?.code + ' (' + documentClass?.documentClass  + ')?'}</Typography>
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
                                    setShowPopUp(false);
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
                                      setShowPopUp(false);
                                      rerunImportJob()
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

  useEffect(() => {
    globalPageLoadSetter(true)
    searchIntelligenceSharingReport()
    setDataTemp(filter(dataTemp, (i, idx) => { return idx < limit }))

    setTimeout(() => {
      globalPageLoadSetter(false)
    }, 1000)
  }, [])

  return (
    <Card id="maintain-document-class" >
      <PageLoader showLoader={showLoader}></PageLoader>
      <>
        <Container maxWidth={false} disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container'>
          <Grid container className='row'>
            <Grid className='field'>
              <TextField
                label={t('documentClass')}
                placeholder={t('contain')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                value={searchDocumentClass}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchDocumentClass(e.target.value)}
              />
            </Grid>
            <Grid className='field'>
              <TextField
                label={t('code')}
                placeholder={t('contain')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                value={searchCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchCode((e.target.value))}
              />
            </Grid>
            <Grid className='field'>
              <TextField
                label={t('description')}
                placeholder={t('contain')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                value={searchDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchDescription((e.target.value))}
              />
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
              setOrderBy(p);
              if (order === "asc") {
                setOrder('desc');
              } else {
                setOrder('asc');
              }
              setOrderStatus(true)
            }} headCells={header} />

            <TableBody>
              {
                map(dataTemp, (d, idx) => (
                  <TableRow
                    hover
                    key={d.code}
                  >
                    {map(columnsSorted.slice(0, -1), function (o) {
                      return (
                        <TableCell key={o.key}>
                          <Typography
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
                    })}
                    {<TableCell align="left" sx={{ width: "100px" }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '30px 30px', marginRight: 6 }}>
                        {
                          <Tooltip title="Rerun" arrow>
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
                                setDocumentClass(d)
                                setShowPopUp(true)
                              }}
                            >
                              <RefreshIcon fontSize="small" />
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
      </>
      <Popup />
    </Card>
  );
};

export default ImportTasksEnquiryTable;

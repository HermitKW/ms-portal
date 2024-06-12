import React, { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import './RetrieveRecordResultTable.scss';
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
import { Check, DoDisturb, Save, ToggleOffTwoTone, Close } from "@mui/icons-material";

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import { FileQueryResult } from 'src/models/File';
import { TableHeader } from 'src/components/Table';
import { DatePicker } from '@mui/lab';
import moment, { Moment } from 'moment';
import { Search } from '@mui/icons-material';
import { FileSearchContext } from './RetrieveRecordSearchContext';
import { FileSearchCriteriaContext } from './RetrieveRecordCriteriaContext';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, USER_CONFIG_SERVICE_URL } from "src/constants";
import { useNavigate, useLocation } from 'react-router';
import PageLoader from "src/components/PageLoader";
import { filter, findIndex, map, sortBy } from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { timeout } from 'q';
import { CATSLAS_BACKEND_SERVICE_URL, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from 'src/constants';
import axios, { AxiosError } from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface UserTableProp {
  className?: string;
}

interface dataTemp{
    id: number | string;
    fileName: string;
    fileFormat: string;
    fileSize: number;
    importDate: string;
    createDate: string;
    checked?: boolean ;
}
 
const RetrieveRecordResultTable: FC<UserTableProp> = ({  }) => {
  const {t} = useTranslation('retrieveRecord')
  const [checkedAll, setCheckedAll] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const [count, setCount] = useState<number>(0);
  
  const [dataTemp,setDataTemp] = useState<dataTemp[]>(null);

  const [searchFromImportDate, setSearchFromImportDate] = useState<Moment|null>(null);
  const [searchToImportDate, setSearchToImportDate] = useState<Moment|null>(null);
  const [searchFromCreateDate, setSearchFromCreateDate] = useState<Moment|null>(null);
  const [searchToCreateDate, setSearchToCreateDate] = useState<Moment|null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileFormat, setFileFormat] = useState<string>("all");
 
  const [showDeletePopUp, setShowDeletePopUp] = useState<boolean>(false);
  const [deleteName, setDeleteName] = useState<string|null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [documentClassOptions,setDocumentClassOptions] = useState<string[]>(null);
  
  const changeSearchFromImportDate = (newValue) => {
    setSearchFromImportDate(newValue);
  };

  const changeSearchFromCreateDate = (newValue) => {
    setSearchFromCreateDate(newValue);
  };

  const [fromDateError, setFromDateError] = useState<String>("");
  const [toDateError, setToDateError] = useState<String>("");

  const [searchTextError, setSearchTextError] = useState<string|null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const fileSearchContext = useContext(FileSearchContext);
  const fileSearchCriteriaContext = useContext(FileSearchCriteriaContext);
  const [loadSearchCriteriaContext, setLoadSearchCriteriaContext] = useState<boolean>(useLocation().state?.loadSearchCriteriaContext);

    const globalPageLoadSetter = useContext(SetPageLoaderContext);

  const [documentClass, setDocumentClass] = useState<number>(-1);
  const [selectedDocumentClass, setSelectedDocumentClass] = useState<number>(-1);

  const [alertStatus, setAlertStatus] = useState<any>("");
  const [serverErrorMsg, setServerErrorMsg] = useState("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

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

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const data: dataTemp[] = [];
  //const data: dataTemp[] = [{"id":1,"fileName":"name1","fileFormat":"Log","fileSize":1614,"importDate":"2023-09-11","createDate":"2023-02-21","checked":false},
  //{"id":2,"fileName":"name2","fileFormat":"Log","fileSize":1050,"importDate":"2023-03-08","createDate":"2022-12-14","checked":false},
  //{"id":3,"fileName":"name3","fileFormat":"Log","fileSize":1542,"importDate":"2023-01-24","createDate":"2022-11-13","checked":false},
  //{"id":4,"fileName":"name4","fileFormat":"Log","fileSize":1086,"importDate":"2023-03-17","createDate":"2022-10-01","checked":false}]

  const searchIntelligenceSharingReport = () => {
    setPage(0);
    loadDocumentClass();
    loadData(0, limit)
  };

  function loadDocumentClass() {
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/document-classes/get-all-document-class`,{
      requestFrom: "retrieve-record"
    }
  ).then((response) => {
    setDocumentClassOptions(response.data.result);
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response);
    });
  }

  function submitDelete(id) {
  }

  useEffect(() => {
    if(loadSearchCriteriaContext){
      loaUserListByClickBackButton();
      setLoadSearchCriteriaContext(false);
    }else{
      searchIntelligenceSharingReport();
    }
  }, []);

  function downloadFiles() {
    //console.log(dataTemp.filter(item => item.checked == true).map(item => item.id));
    var fileIDs = dataTemp.filter(item => item.checked == true).map(item => item.id);

    if (fileIDs.length == 0) {
      setAlertStatus("success");
      setServerErrorMsg("Please select at least one log file");
      setShowMessage(true);
      return;
    }

    globalPageLoadSetter(true)

    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/retrieve-record/export/download-log-files`,
    {
      "fileIDs" : fileIDs,
      "documentClass" : (selectedDocumentClass == -1)? null: documentClassOptions[selectedDocumentClass]
    }
    ,{
      responseType: 'arraybuffer',
      withCredentials: true
    }
    // ,{responseType: 'blob'}
    )
    .then((response) => {
      console.log(response)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = response.headers['filename'];
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      setAlertStatus("success");
      setServerErrorMsg("Please check your email to see the one-time password.");
      setShowMessage(true);
      globalPageLoadSetter(false)
    })
    // .then(({data: blob}) => {
    //   console.log(data);
    //   const link = document.createElement('a');
    //   const url = URL.createObjectURL(blob);
    //   console.log(url);
    //   link.href = url;
    
    //   link.download = moment().format('YYYYMMDDHHmmSS') + '.zip';
    //   link.click();

    //   setAlertStatus("success");
    //   setServerErrorMsg("Please check your email to see the one-time password.");
    //   setShowMessage(true);
    //   globalPageLoadContext.setShowGlobalPageLoader(false)
    // })
    .catch((error) => {
      setAlertStatus("error");
      setServerErrorMsg("Cannot download log files or send one-time password to your email. Please find your administrator.");
      //setServerErrorMsg(error.response.data.message);
      setShowMessage(true);
      globalPageLoadSetter(false)
    });
  }

  function loadData(page, limit) {
    if (selectedDocumentClass != -1) {
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/retrieve-record/get-log-files`,
    {
      "fileName" : (fileName.trim().length == 0)? null: fileName.trim(),
      "fileFormat" : (fileFormat == "all")? null: fileFormat,
      "documentClass" : (selectedDocumentClass == -1)? null: documentClassOptions[selectedDocumentClass],
      "importDateFrom" : (searchFromImportDate == null)? null: moment(searchFromImportDate.toDate()).format('YYYY-MM-DD'),
      "importDateTo": (searchToImportDate == null)? null: moment(searchToImportDate.toDate()).format('YYYY-MM-DD'),
      "createDateFrom": (searchFromCreateDate == null)? null: moment(searchFromCreateDate.toDate()).format('YYYY-MM-DD'),
      "createDateTo": (searchToCreateDate == null)? null: moment(searchToCreateDate.toDate()).format('YYYY-MM-DD'),
      "takenBy": null,
      "limit" : limit,
      "offset" : (page * limit)
    }).then((response) => {
          console.log(response.data.result);
          var newArray = JSON.parse(JSON.stringify(response.data.result.retrieveRecordSearchResponseList));
          newArray = map(newArray,function(obj){
            return {...obj, checked: false}
          })
          setDataTemp(newArray);
          //setHKPFUsers(response.data.result.hkpfUserManagementSearchResponseList);
          setCount(response.data.result.count);
          saveSearchCriteriaContext(response.data.result.count, newArray, limit, page);

      console.log(response)
    }).catch((error) => {
        globalPageLoadSetter(false)
      console.log(error)
    });
  }
  }

  const changeSearchToImportDate = (newValue) => {
    setSearchToImportDate(newValue);
  };

  const changeSearchToCreateDate = (newValue) => {
    setSearchToCreateDate(newValue);
  };

  const navigate =  useNavigate();
  const editUser = function(id: string){
    navigate(`/user-management/${id}`);
  }

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'failed',
      name: 'Failed'
    }
  ];

  const columns = [
    {name:  t('fileName'), key: 'fileName', seq: 1, type: 'string',style: {width: "300px"}}
    ,{name: t('fileFormat') , key: 'fileFormat', seq: 2, type: 'string'}
    ,{name: t('fileSize'), key: 'fileSize', seq: 3, type: 'string'}
    ,{name: t('importDate'), key: 'importDate', seq: 5, type: 'string'}
    ,{name: t('createDate'), key: 'createDate', seq: 6, type: 'string'}
]

const columnsSorted = sortBy(columns,function(o){return o.seq});

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

  const clickResetButton = () =>{
    setFileName("")
    setSearchFromImportDate(null)
    setSearchToImportDate(null)
    setSearchFromCreateDate(null)
    setSearchToCreateDate(null)
    setFileFormat("all")
    setCheckedAll(false)
  }

  const theme = useTheme();


  const loaUserListByClickBackButton = useCallback(function loaUserListByClickBackButton(){
    console.log("call context search function");
    readSearchCriteriaContext(fileSearchCriteriaContext.fileSearchCriteria);    
  }, [])
  
  const getCellDisplay = (value, type, columnKey) =>{
    // if(!value)return
    // if(columnKey === 'userGroupIdList') return join(map(value,(i)=>{return find(userGroupList,{id: i})['description']}),', ')
    // if(type === 'boolean') return value ? 'Yes' : 'No'
    if(columnKey === 'importDate' || columnKey === 'createDate') return moment(value).format('YYYY-MM-DD');
    return value
  }

  const editRecord = (id)=>{}

  const disableRecord = (id)=>{
    setShowDeletePopUp(true);
  }

  
  const saveSearchCriteriaContext = (rows : number, fileListAfterSearch : FileQueryResult[], limit : number, page: number) => {
    var searchCriteria = 
        {
          fileName: fileName,
          fileFormat: fileFormat,
          searchFromImportDate: (searchFromImportDate == null)? null: moment(searchFromImportDate.toDate()).format('YYYY-MM-DD'),
          searchToImportDate: (searchToImportDate == null)? null: moment(searchToImportDate.toDate()).format('YYYY-MM-DD'),
          searchFromCreateDate: (searchFromCreateDate == null)? null: moment(searchFromCreateDate.toDate()).format('YYYY-MM-DD'),
          searchToCreateDate: (searchToCreateDate == null)? null: moment(searchToCreateDate.toDate()).format('YYYY-MM-DD'),
          limit: limit,
          page: page,
          count: rows,
          fileList: fileListAfterSearch
        }
        //fileSearchCriteriaContext.setFileSearchCriteria(searchCriteria);
  }
  
  const readSearchCriteriaContext = (fileSearchCriteria : any) => {
    setFileName(fileSearchCriteria.fileName);
    setFileFormat(fileSearchCriteria.fileFormat);
    setSearchFromImportDate(fileSearchCriteria.searchFromImportDate);
    setSearchToImportDate(fileSearchCriteria.searchToImportDate);
    setSearchFromCreateDate(fileSearchCriteria.searchFromCreateDate);
    setSearchToCreateDate(fileSearchCriteria.searchToCreateDate);
    setLimit(fileSearchCriteria.limit);
    setPage(fileSearchCriteria.page);
    setCount(fileSearchCriteria.count);
    fileSearchContext.setFileQueryResultList(fileSearchCriteria.fileList)
  }


  const checkRecord = (checked, idx) =>{
    console.log(idx)
    console.log(checked)
   var newArray = JSON.parse(JSON.stringify(dataTemp));
   newArray[idx]["checked"] = checked
   setDataTemp(newArray)
  }


useEffect(()=>{
  var newArray = JSON.parse(JSON.stringify(dataTemp)) 
 setDataTemp(map(newArray,(i)=>{
  return {...i,checked: checkedAll}
}))
},[checkedAll])

useEffect(()=>{
  loadData(0, limit);
},[selectedDocumentClass])

  const DeletePopup = () => {
    return (
      <Modal
          open={showDeletePopUp}
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
                      component="form"
                      sx={{
                          '& .MuiTextField-root': { width: '90%' },
                          '& .MuiInputLabel-root': { ml: "1rem"},
                          '& .MuiInputBase-root': { ml: "1rem", mt: "0"}
                      }}
                      noValidate
                      autoComplete="off"
                      onSubmit={() => {}}
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
                                  <Button 
                                  type="button" 
                                  sx={{marginLeft: '10px'}}
                                  variant="contained"
                                  startIcon={<Check fontSize="small" />}
                                  onClick={() => {
                                      submitDelete(deleteId);
                                      setShowDeletePopUp(false);
                                  }}>
                                  {t('yes')}
                                  </Button>
                              </Grid>
                              <Grid item> 
                                  <Button type="button"
                                  sx={{marginLeft: '10px'}}
                                  variant="outlined"
                                  startIcon={<DoDisturb fontSize="small" />}
                                  onClick={() => {
                                      setShowDeletePopUp(false);
                                  }}
                                  >
                                  {t('no')}
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

  return (
    <Card id="retrieve-record" >
    <PageLoader showLoader={showLoader}></PageLoader>
      {(selectedDocumentClass == -1)? (
        <Container maxWidth={false} disableGutters sx={{paddingLeft: "27px", paddingRight: "10px"}} className='search-container'>
            <Grid container className='row'>
            <Grid className='field'>
             <FormControl variant="standard" sx={{ minWidth: 150 }}>
                <InputLabel>{t('documentClass')}</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={documentClass}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDocumentClass(parseInt(e.target.value))}
                >
                  {map(documentClassOptions,function (d) {return (
                    <MenuItem key={d} value={documentClassOptions.indexOf(d)}>{d}</MenuItem>
                  )})}
                </Select>
              </FormControl>
             </Grid>
          
             </Grid>
          
             <Grid container className='row'>
                  <Grid item marginLeft={"auto"}>
                      <Button
                              variant="outlined"
                              sx={{marginRight:1}}
                              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                setDocumentClass(-1)
                                setSelectedDocumentClass(-1)
                              }}
                              size="medium"
                            >
                            {t('reset')}
                          </Button>
                        <Button
                              variant="contained"
                              startIcon={<Search fontSize="small" />}
                              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                setSelectedDocumentClass(documentClass)
                              }}
                              size="medium"
                            >
                            {t('select')}
                          </Button>
                      </Grid>
             </Grid>
          </Container>
      ):(
        <Grid>
        <Container maxWidth={false} disableGutters sx={{paddingLeft: "27px", paddingRight: "10px"}} className='search-container'>
          <Grid container className='row'>
          <Grid className='field'>
            <TextField
              label={t('fileName')}
              placeholder={t('contain')}
              InputLabelProps={{
                shrink: true,
              }}
              variant="standard"
              value={fileName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFileName(e.target.value)}
            />
           </Grid>
           <Grid className='field'>
           <FormControl variant="standard" sx={{ minWidth: 150 }}>
              <InputLabel>{t('fileFormat')}</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={fileFormat}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFileFormat(e.target.value)}
              >
                <MenuItem value={"all"}>All</MenuItem>
                <MenuItem value={"txt"}>txt</MenuItem>
              </Select>
            </FormControl>
           </Grid>
        
           </Grid>
           <Grid container className='row'>
                  <Grid item>
                        <FormControl>
                            <DatePicker 
                              label={t('importDateFrom')}
                              value={searchFromImportDate}
                              onChange={changeSearchFromImportDate}
                              mask="____-__-__"               
                              inputFormat="YYYY-MM-DD"
                              renderInput={(params) => <TextField variant="standard" InputLabelProps={{shrink: true}} {...params} error={!!fromDateError} helperText={fromDateError} />}
                              />
                          </FormControl>
                  </Grid>
                 
                  <Grid item>
                         <FormControl >
                            <DatePicker
                              label={t('importDateTo')}
                              value={searchToImportDate}
                              onChange={changeSearchToImportDate}
                              mask="____-__-__"               
                              inputFormat="YYYY-MM-DD"
                              renderInput={(params) => <TextField InputLabelProps={{shrink: true}} variant="standard" {...params} error={!!toDateError} helperText={toDateError} />}
                              />
                          </FormControl>
                  </Grid>
           </Grid>
           <Grid container className='row'>
                  <Grid item>
                        <FormControl>
                            <DatePicker 
                              label={t('createDateFrom')}
                              value={searchFromCreateDate}
                              onChange={changeSearchFromCreateDate}
                              mask="____-__-__"               
                              inputFormat="YYYY-MM-DD"
                              renderInput={(params) => <TextField variant="standard" InputLabelProps={{shrink: true}} {...params} error={!!fromDateError} helperText={fromDateError} />}
                              />
                          </FormControl>
                  </Grid>
                 
                  <Grid item>
                         <FormControl >
                            <DatePicker
                              label={t('createDateTo')}
                              value={searchToCreateDate}
                              onChange={changeSearchToCreateDate}
                              mask="____-__-__"               
                              inputFormat="YYYY-MM-DD"
                              renderInput={(params) => <TextField InputLabelProps={{shrink: true}} variant="standard" {...params} error={!!toDateError} helperText={toDateError} />}
                              />
                          </FormControl>
                  </Grid>
                     <Grid item marginLeft={"auto"}>
                    <Button
                            variant="outlined"
                            sx={{marginRight:1}}
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                              clickResetButton()
                              // setPage(0);
                              // searchIntelligenceSharingReport(limit, 0);
                            }}
                            size="medium"
                          >
                          {t('reset')}
                        </Button>
                      <Button
                            variant="contained"
                            startIcon={<Search fontSize="small" />}
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                              setPage(0);
                              searchIntelligenceSharingReport();
                            }}
                            size="medium"
                          >
                          {t('search')}
                        </Button>
                    </Grid>
           </Grid>
           <Grid container className='row' sx={{marginTop:1}}>
            <Grid item>
              <Button
                  variant="contained"
                  onClick={downloadFiles}
                >
                  {t('download')}
              </Button>
            </Grid>
            <Grid item sx={{marginLeft: "auto"}}>
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
          
          <TableHead>
                    <TableRow>
                      <TableHeader>
                      <FormControlLabel
                        label=""
                        control={<Checkbox 
                          checked = {checkedAll}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckedAll(e.target.checked)}
                          />}
                      />
                      </TableHeader>
                        {
                            map(columnsSorted,function(o){
                                return(
                                    <TableCell key={o.key}>
                                        {o.name}
                                    </TableCell>   
                                )
                            })
                        }
                    </TableRow>
                </TableHead>
          <TableBody>
          {
                map(dataTemp,(d,idx) => (
                  <TableRow
                      hover
                      key={d.id}
                  >
                    <TableCell>
                    <FormControlLabel
                      label=""
                      control={
                        <Checkbox
                          // checked={checked[0] && checked[1]}
                          // indeterminate={checked[0] !== checked[1]}
                          checked={d.checked}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => checkRecord(e.target.checked,idx)}
                        />
                      }
                    />
                    </TableCell>
                      {map(columnsSorted, function (o) {
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
                      })}

                  </TableRow>
              ))
          }
          </TableBody>
        </Table>
      </TableContainer>
      </Grid>
      )}

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

export default RetrieveRecordResultTable;

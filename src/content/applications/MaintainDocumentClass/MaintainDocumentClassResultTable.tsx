import { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback } from 'react';
import React from "react";
import numeral from 'numeral';
import PropTypes from 'prop-types';
import './MaintainDocumentClassResultTable.scss';
import {
  TextareaAutosize,
  Tooltip,
  Divider,
  Box,
  FormControl,
  Alert,
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
  Snackbar,
  Modal,
  CardContent,
  FormHelperText,
  Input,
  FormControlLabel
} from '@mui/material';
import { Close } from "@mui/icons-material";
import { Check, DoDisturb, Save, ToggleOffTwoTone } from "@mui/icons-material";

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import { DocumentClassQueryResult } from 'src/models/DocumentClass';
import { TableHeader } from 'src/components/Table';
import { DatePicker } from '@mui/lab';
import moment, { Moment } from 'moment';
import { Search, Add } from '@mui/icons-material';
import { MaintainDocumentClassSearchContext } from './MaintainDocumentClassSearchContext';
import { MaintainDocumentClassSearchCriteriaContext } from './MaintainDocumentClassSearchCriteriaContext';
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

interface UserTableProp {
  className?: string;
}

const RetrieveRecordResultTable: FC<UserTableProp> = ({ }) => {
  const { t } = useTranslation('maintainDocumentClass')
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const [count, setCount] = useState<number>(0);
  const [docId, setDocId] = useState<string>("");


  const [searchDocumentClass,setSearchDocumentClass] = useState<string>("");
  const [searchCode, setSearchCode] = useState<string>("");
  const [searchDescription, setSearchDescription] = useState<string>("");

  const [dataTemp, setDataTemp] = useState<DocumentClassQueryResult[]>(null);

  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [maxsize, setMaxsize] = useState<number>(null);
  const [retentionPeriod, setRetentionPeriod] = useState<number>(null);
  const fixedPath = "/STAGING_01/in/";
  const [importingPath, setImportingPath] = useState<string>(fixedPath);
  const [defaultGrantedTimePeriod, setDefaultGrantedTimePeriod] = useState<number>(null);
  const [notificationBeforeRetentionPeriod, setNotificationBeforeRetentionPeriod] = useState<string>();
  const [notificationForSuccess, setNotificationForSuccess] = useState<string>();
  const [emailList, setEmailList] = useState<string>("");

  const [showLoader, setShowLoader] = useState<boolean>(false);

  const maintainDocumentClassSearchContext = useContext(MaintainDocumentClassSearchContext);
  const maintainDocumentClassSearchCriteriaContext = useContext(MaintainDocumentClassSearchCriteriaContext);

    const globalPageLoadSetter = useContext(SetPageLoaderContext);

  const [documentClass, setDocumentClass] = useState<string>("");
  const [managePage, setManagePage] = useState<boolean>(false);

  const [editMode, setEditMode] = useState<boolean>(false);

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<string>("update_Time")

  const [updateTime, setUpdateTime] = useState<Date>();

  const [docStatus,setDocStatus] = useState<boolean>(false);
  const [orderStatus,setOrderStatus] = useState<boolean>(false);

  const [showDocumentClassError, setShowDocumentClassError] = useState(false);
  const [documentClassErrorMsg, setDocumentClassErrorMsg] = useState<string>("");


  const [inputNameError, setInputNameError] = useState(false);
  const [inputCodeError, setInputCodeError] = useState(false);
  const [inputDescError, setInputDescError] = useState(false);
  const [inputMaxSizeError, setInputMaxSizeError] = useState(false);
  const [inputRetentionPeriodError, setInputRetentionPeriodError] = useState(false);
  const [inputPathError, setInputPathError] = useState(false);
  const [inputDefaultGrantedTimePeriodError, setInputDefaultGrantedTimePeriodError] = useState(false);

  const theme = useTheme();

  const handleSubmit = () => {
    if(name.trim() === ""){
      setInputNameError(true)
      return;
    }
    if(code.trim() === ""){
      setInputCodeError(true)
      return;
    }
    if(description.trim() === ""){
      setInputDescError(true)
      return;
    }
    if(maxsize === undefined || maxsize === null || maxsize <= 0){
      setInputMaxSizeError(true)
      return;
    }
    if(retentionPeriod === undefined || retentionPeriod === null || retentionPeriod <= 0){
      setInputRetentionPeriodError(true)
      return;
    }
    if (!isValidCustomPath(importingPath)) {
      setInputPathError(true)
      return;
    } 
    if(defaultGrantedTimePeriod === undefined || defaultGrantedTimePeriod === null || defaultGrantedTimePeriod <= 0){
      setInputDefaultGrantedTimePeriodError(true)
      return;
    }
    saveDocument();
  };

  function isValidCustomPath(input: string): boolean {
    const pattern: RegExp = /^\/STAGING_01\/in\/[^\/]+\/[^\/]+$/;

    if (!pattern.test(input)) {
        return false; 
    }

    if (input.includes('//')) {
        return false; 
    }
    if (input === fixedPath) { 
        return false;  
    }

    return true; 
}

    const handleInputChange = (event) => {
      const inputValue = event.target.value;
      setInputPathError(false);

      const slashCount = inputValue.split('/').length - 1;

      if (slashCount > 4) {
        return;
      }
      if (inputValue.startsWith(fixedPath) || inputValue.startsWith(importingPath).slice) {
        setImportingPath(inputValue); 
      } else {
        setImportingPath(fixedPath); 
      }
    };

  const columns = [
    { name: t('documentClass'), key: 'documentClass', seq: 1, type: 'string' }
    , { name: t('code'), key: 'code', seq: 2, type: 'string' },
    { name: t('description'), key: 'description', seq: 3, type: 'string' },
    { name: t('action'), key: 'action', seq: 4 },

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

  function saveDocument() {
    globalPageLoadSetter(true);

    let url: string;
    let data;

    if (docId != "") {
      url = `${CATSLAS_BACKEND_SERVICE_URL}/api/v1/document-classes/update`;
      data = {
        docId: code,
        docName: name,
        docDesc: description,
        docMaxSize: maxsize,
        docRetentPeriod: retentionPeriod,
        docPath: importingPath,
        docAccessTimeLimit: defaultGrantedTimePeriod,
        docRetentNoti: notificationBeforeRetentionPeriod,
        docSuccessNoti: notificationForSuccess,
        docEmailList: emailList,
        updateTime: updateTime
      }

    } else {
      url = `${CATSLAS_BACKEND_SERVICE_URL}/api/v1/document-classes/insert`;
      data = {
        docId: code,
        docName: name,
        docDesc: description,
        docMaxSize: maxsize,
        docRetentPeriod: retentionPeriod,
        docPath: importingPath,
        docAccessTimeLimit: defaultGrantedTimePeriod,
        docRetentNoti: notificationBeforeRetentionPeriod,
        docSuccessNoti: notificationForSuccess,
        docEmailList: emailList
      }
    }
    customAxios.post(url,data).then((response: any) => {
      if (response.status === 200) {
        setDocId("");
        setTimeout(() => {
          setDocStatus(true);
        }, 0);
        emptyFields();
        setEditMode(false);
        setManagePage(false);
        globalPageLoadSetter(false);
     }
    }).catch((error) => {
      if (error.response.status === 530) {
          const messageResult = error.response.data.message;
          if (messageResult) {
            setDocumentClassErrorMsg(messageResult);
            setShowDocumentClassError(true);
        }
      } else {
        console.error("Request error:", error);
    }
    })
  }

  useEffect(() => {
    orderStatus && loadData(page, limit);
    setOrderStatus(false)
  }, [orderStatus]);
  
  function loadData(page, limit) {
    customAxios.post(`${CATSLAS_BACKEND_SERVICE_URL}/api/v1/document-classes/search`,
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
          maxsize: item['docMaxSize'],
          retentionPeriod: item['docRetentPeriod'],
          importingPath: item['docPath'],
          defaultGrantedTimePeriod: item['docAccessTimeLimit'],
          notificationBeforeRetentionPeriod: item['docRetentNoti'],
          notificationForSuccess: item['docSuccessNoti'],
          emailList: item['docEmailList'],
          updateTime: item['updateTime']
        }));
        setDataTemp(arr);
        setCount(responseData.result.total);
      }).finally(() => globalPageLoadSetter(false))
        .catch((error) => {
        console.error('error: ' + error);
      });
  }

  const navigate = useNavigate();
  const editUser = function (id: string) {
    navigate(`/user-management/${id}`);
  }

  const loadDocumentClass = useCallback(function loadDocumentClass(docId) {
    customAxios.get(`${CATSLAS_BACKEND_SERVICE_URL}/api/v1/document-classes/${docId}`).then((response: any) => {
      setName(response.data.result.docName);
      setCode(response.data.result.docId);
      setDescription(response.data.result.docDesc);
      setMaxsize(response.data.result.docMaxSize);
      setRetentionPeriod(response.data.result.docRetentPeriod);
      setImportingPath(response.data.result.docPath);
      setDefaultGrantedTimePeriod(response.data.result.docAccessTimeLimit);
      setNotificationBeforeRetentionPeriod(response.data.result.docRetentNoti);
      setNotificationForSuccess(response.data.result.docSuccessNoti);
      const emailList = response.data.result.docEmailList;
      setEmailList(emailList === null || emailList === "" ? "-" : emailList);
      setUpdateTime(response.data.result.updateTime);
    })
  }, [docId])

  const emptyFields = function () {
    setName("");
    setCode("")
    setDescription("");
    setMaxsize(0);
    setRetentionPeriod(0);
    setImportingPath(fixedPath);
    setDefaultGrantedTimePeriod(0);
    setNotificationBeforeRetentionPeriod("Y");
    setNotificationForSuccess("Y");
    setEmailList("");
  }

  const getCellDisplay = (value, type, columnKey) => {
    return value
  }

  const saveSearchCriteriaContext = (rows: number, documentClassListAfterSearch: DocumentClassQueryResult[], limit: number, page: number) => {
    var searchCriteria =
    {
      docName: documentClass,
      docId: code,
      docDesc: description,
      limit: limit,
      page: page,
      count: rows,
      documentClassList: documentClassListAfterSearch
    }
    maintainDocumentClassSearchCriteriaContext.setDocumentClassSearchCriteria(searchCriteria);
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

  const handleClose = () => {
    setDocumentClassErrorMsg("")
    setShowDocumentClassError(false)
  };

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
      {(!managePage) ? (<>
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
            <Grid item marginLeft={"auto"}>
              <Button
                variant="contained"
                startIcon={<Add fontSize="small" />}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  setDocId("")
                  setManagePage(true);
                  setEditMode(true);
                }}
                size="medium"
              >
                {t('add')}
              </Button>
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
                          <Tooltip title="View" arrow>
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
                                setDocId(d.code);
                                loadDocumentClass(d.code);
                                if (d.documentClass != "") {
                                  setManagePage(true);
                                }
                              }}
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
      </>
      ) : (
        <Grid>
          <Container maxWidth={false} disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container'>
            <Grid container xs={12} justifyContent={'center'}>
             <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={showDocumentClassError}
                message={documentClassErrorMsg}
                autoHideDuration={6000}
                onClose={handleClose}
                key={"top_center_error"}
              >
                <Alert severity="error" sx={{ width: '100%' }}>
                  {documentClassErrorMsg}
                </Alert>
              </Snackbar>
            </Grid>
            <Grid container className='row'>
              <Typography variant="h4" component="h4" gutterBottom>
                {t('basicInformation')}
              </Typography>
              {!editMode ?
                <Grid item marginLeft={"auto"}>
                  <Button
                    variant="contained"
                    startIcon={<EditTwoToneIcon fontSize="small" />}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      setEditMode(true);
                      // searchIntelligenceSharingReport(limit, 0);
                    }}
                    size="medium"
                  >
                    {t('edit')}
                  </Button>
                </Grid>
                : <></>}

            </Grid>
            <Grid container className='row'>
              <Typography sx={{ width: 300 }} gutterBottom>
                {t('name')}
              </Typography>
              {!editMode ?
                <Typography sx={{ width: 300 }} gutterBottom>
                  {name}
                </Typography>
                :
                <Grid className='field'>
                  <TextField
                    style={{ width: "400px"   }}                 
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      style: {
                        color: inputNameError ? 'red' : 'inherit'
                      }
                    }}
                    variant="standard"
                    value={name.length <= 100 ? name : name.slice(0, 100)}
                    error={inputNameError}
                    helperText={inputNameError ? 'name cannot be empty' : ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>{setName(e.target.value);setInputNameError(false);}}/>
                </Grid>}
            </Grid>
            <Grid container className='row'>
              <Typography sx={{ width: 300 }} gutterBottom>
                {t('code')}
              </Typography>
              {!(editMode && docId == "") ?
                <Typography sx={{ width: 300 }} gutterBottom>
                  {code}
                </Typography>
                :
                <Grid className='field'>
                  <TextField
                                 FormHelperTextProps={{
                                   style: {
                                     fontSize: '12px'
                                   }
                                 }}
                                 variant="standard"
                                 value={code.length <= 5 ? code : code.slice(0, 5)}
                                  
                                 InputProps={{
                                   style: {
                                     color: inputCodeError ? 'red' : 'inherit'
                                   }
                                 }}
                                 error={inputCodeError}
                                 helperText={inputCodeError ? 'code cannot be empty' : ''}
                                 onChange={(e: ChangeEvent<HTMLInputElement>) =>{ setCode(e.target.value); setInputCodeError(false);}}/>
                </Grid>}
            </Grid>
            <Grid container className='row'>
              <Typography sx={{ width: 300 }} gutterBottom>
                {t('description')}
              </Typography>
              {!editMode ?
                <Typography sx={{ width: 300 }} gutterBottom>
                  {description}
                </Typography>
                :
                <Grid className='field'>
                  <TextareaAutosize
                    aria-label="Observations/analysis"
                    placeholder=""
                    minRows={6}
                    style={{ width: "400px", fontSize: "inherit", fontFamily: "arial", resize: "none", borderRadius: "10px"}}
                    value={description.length <= 100 ? description : description.slice(0, 100)}
                    onChange={e => {setDescription(e.target.value);setInputDescError(false);}}
                  />
                   {inputDescError && (
                    <FormHelperText style={{ color: 'red'}}>{'description cannot be empty'}</FormHelperText>
                  )}
                </Grid>}
            </Grid>
            <Grid container className='row'>
              <Typography sx={{ width: 300 }} gutterBottom>
                {t('maxsize')}
              </Typography>
              {!editMode ?
                <Typography sx={{ width: 300 }} gutterBottom>
                  {maxsize + " " + t('mb')}
                </Typography>
                :
                <><TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    maxLength: 11,
                    style: {
                      color: inputMaxSizeError ? 'red' : 'inherit'
                    }}}
                  variant="standard"
                  value={(maxsize == 0) ? "" : maxsize}
                  error={inputMaxSizeError}
                  helperText={inputMaxSizeError ? 'maxSize cannot be empty' : ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {setMaxsize(parseInt(e.target.value));setInputMaxSizeError(false)}}
                />
                  <Typography gutterBottom>
                    {t('mb')}
                  </Typography></>}
            </Grid>
            <Grid container className='row'>
              <Typography sx={{ width: 300 }} gutterBottom>
                {t('retentionPeriod')}
              </Typography>
              {!editMode ?
                <Typography sx={{ width: 300 }} gutterBottom>
                  {retentionPeriod + " " + t('month')}
                </Typography>
                :
                <><Grid className='field'>
                  <TextField
                      inputProps={{ 
                        maxLength: 11,
                        style: {
                          color: inputRetentionPeriodError ? 'red' : 'inherit'
                       }
                     }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                    value={(retentionPeriod == 0) ? "" : retentionPeriod}
                    error={inputRetentionPeriodError}
                    helperText={inputRetentionPeriodError ? 'retentionPeriod cannot be empty' : ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {setRetentionPeriod(parseInt(e.target.value));setInputRetentionPeriodError(false);}}
                  />
                </Grid>
                  <Typography gutterBottom>
                    {t('month')}
                  </Typography>
                </>}
            </Grid>
            <Grid container className='row'>
              <Typography sx={{ width: 300 }} gutterBottom>
                {t('importingPath')}
              </Typography>
              {!editMode ?
                <Typography sx={{ width: 300 }} gutterBottom>
                  {importingPath}
                </Typography>
                :
                <Grid className='field'>
                  <TextField
                    inputProps={{ maxLength: 100}}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                    value={importingPath}
                    InputProps={{
                      style: {
                        color: inputPathError ? 'red' : 'inherit'
                      }
                    }}
                    error={inputPathError}
                    helperText={inputPathError ? 'please enter the correct path format.' : ''}
                    onChange={handleInputChange}/>
                </Grid>}
            </Grid>
            <Grid container className='row'>
              <Typography sx={{ width: 300 }} gutterBottom>
                {t('defaultGrantedTimePeriod')}
              </Typography>
              {!editMode ?
                <Typography sx={{ width: 300 }} gutterBottom>
                  {defaultGrantedTimePeriod + " " + t('month')}
                </Typography>
                :
                <><Grid className='field'>
                  <TextField
                    inputProps={{ 
                      maxLength: 11,
                      style: {
                        color: inputDefaultGrantedTimePeriodError ? 'red' : 'inherit'
                     } 
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                    value={(defaultGrantedTimePeriod == 0) ? "" : defaultGrantedTimePeriod}
                    error={inputDefaultGrantedTimePeriodError}
                    helperText={inputDefaultGrantedTimePeriodError ? 'retentionPeriod cannot be empty' : ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {setDefaultGrantedTimePeriod(parseInt(e.target.value));setInputDefaultGrantedTimePeriodError(false)}}
                  />
                </Grid>
                  <Typography gutterBottom>
                    {t('month')}
                  </Typography></>}
            </Grid>
            <Grid container className='row'>
              <Typography sx={{ width: 300 }} gutterBottom>
                {t('notificationBeforeRetentionPeriod')}
              </Typography>
              {!editMode ?
                <Typography sx={{ width: 300 }} gutterBottom>
                  {(notificationBeforeRetentionPeriod == "Y") ? t('yes') : t('no')}
                </Typography>
                :
                <RadioGroup
                  aria-labelledby="user-group-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={notificationBeforeRetentionPeriod || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNotificationBeforeRetentionPeriod(e.target.value)}
                  row
                >
                  <FormControlLabel
                    key="1"
                    value="Y"
                    control={<Radio />}
                    label={t('yes')}
                  />
                  <FormControlLabel
                    key="2"
                    value="N"
                    control={<Radio />}
                    label={t('no')}
                  />
                </RadioGroup>}
            </Grid>
            <Grid container className='row'>
              <Typography sx={{ width: 300 }} gutterBottom>
                {t('notificationForSuccess')}
              </Typography>
              {!editMode ?
                <Typography sx={{ width: 300 }} gutterBottom>
                  {(notificationForSuccess == "Y") ? t('yes') : t('no')}
                </Typography>
                :
                <RadioGroup
                  aria-labelledby="user-group-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={notificationForSuccess || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNotificationForSuccess(e.target.value)}
                  row
                >
                  <FormControlLabel
                    key="1"
                    value="Y"
                    control={<Radio />}
                    label={t('yes')}
                  />
                  <FormControlLabel
                    key="2"
                    value="N"
                    control={<Radio />}
                    label={t('no')}
                  />
                </RadioGroup>}
            </Grid>
            <Grid container className='row'>
              <Typography sx={{ width: 300 }} gutterBottom>
                {t('emailList1')}<br />{t('emailList2')}
              </Typography>
              {!editMode ?
                <Typography sx={{ width: 300 }} gutterBottom>
                  {/* {emailList.replace("\n", ", ")} */}
                  {emailList}
                </Typography>
                :
                <Grid className='field'>
                  <TextareaAutosize
                    aria-label="Observations/analysis"
                    placeholder=""
                    minRows={6}
                    style={{ width: "400px", fontSize: "inherit", fontFamily: "arial", resize: "none", borderRadius: "10px" }}
                    value={emailList}
                    onChange={e => setEmailList(e.target.value)}
                  />
                </Grid>}
            </Grid>

            <Grid item container justifyContent="end">
              <Grid item>
                <Button
                  variant="outlined"
                  sx={{ marginRight: 1 }}
                  startIcon={<DoDisturb fontSize="small" />}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    setDocumentClass("")
                    setDocId("")
                    setManagePage(false)
                    setEditMode(false)
                    handleClose()

                    setInputCodeError(false);
                    setInputNameError(false);
                    setInputDescError(false);
                    setInputMaxSizeError(false);
                    setInputRetentionPeriodError(false);
                    setInputDefaultGrantedTimePeriodError(false);
                    setInputPathError(false)

                    // searchIntelligenceSharingReport(limit, 0);
                  }}
                  size="medium"
                >
                  {t('cancel')}
                </Button>
              </Grid>
              {editMode ?
                <Grid item>
                  <Button
                    variant="contained"
                    sx={{ marginRight: 1 }}
                    startIcon={<Check fontSize="small" />}
                    onClick={handleSubmit}
                    size="medium"
                  >
                    {t('confirm')}
                  </Button>
                </Grid> : <></>}
            </Grid>
          </Container>
        </Grid>
      )}
    </Card>
  );
};

export default RetrieveRecordResultTable;

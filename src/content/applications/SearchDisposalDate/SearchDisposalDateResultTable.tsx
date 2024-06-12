import { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback, useRef } from 'react';
import './index.scss';
import './SearchDisposalDateResultTable.scss';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableContainer,
  MenuItem,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  AccordionDetails,
  Modal,
  CardContent,
  Accordion,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
  ListSubheader
} from '@mui/material';
import { Check, DoDisturb } from "@mui/icons-material";

import moment from 'moment';
import { Search } from '@mui/icons-material';
import { CATSLAS_BACKEND_SERVICE_URL, DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, USER_CONFIG_SERVICE_URL } from "src/constants";
import { map, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import axios, { AxiosError } from 'axios';
import HookedDatePicker from 'src/components/HookedDatePicker';
import { useForm } from 'react-hook-form';
import HookedSelectField from 'src/components/HookedSelect';
import EnhancedTableHead from 'src/components/EnhancedTableHead';
import { CatslasReturn, Countable, Order } from 'src/utilities/Utils';
import { GlobalSnackbarSetter } from 'src/components/GlobalSnackbar/GlobalSnackbarContext';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';

interface UserTableProp {
  className?: string;
}

interface DataTemp {
  id: number;
  documentClass: string;
  fileName: string;
  fileFormat: string;
  fileSize: string;
  importDate: string;
  createDate: string;
  retentionPeriod: string;
  disposalDate: string;
  extendDisposalDate: string;
  updateTime?: string;
  isDisable?: boolean;
}


const defaultValues = {
  fileName: "",
  fileFormat: "",
  documentClass: "ALL",
  // why do we prefer to use Date than Moment?
  // there is an issue in react-hook-form -- @link github.com/react-hook-form/react-hook-form/issues/4704
  importDateFrom: null as Date,
  importDateTo: null as Date,
  createDateFrom: null as Date,
  createDateTo: null as Date,
}

const SearchDisposalDateResultTable: FC<UserTableProp> = ({ }) => {

  const globalSnackbarSetter = useContext(GlobalSnackbarSetter);
  const [checkedAll, setCheckedAll] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const [count, setCount] = useState<number>(0);
  const offset = page * limit;
  const [showExtendDisposalDatePopup, setExtendDisposalDatePopup] = useState(false);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("");

  const [dataTemp, setDataTemp] = useState<DataTemp[]>(null);
  const [documentClassData, setDocumentClassData] = useState<string[]>([]);

  const globalPageLoadSetter = useContext(SetPageLoaderContext);

  const { t } = useTranslation(["searchDisposalDate", "common"]);

  const [checkedRows, setCheckedRows] = useState<number[]>([]);

  const { control, getValues, handleSubmit, register, reset } = useForm({
    defaultValues
  });


  // const [classId, setClassId] = useState(["CERAL", "CERAU", "DBAUT", "DBSEL", "DBSQL", "DMSDM"]);

  const resultTableColumns = [
    { name: t('fileName'), key: 'fileName', seq: 1, type: 'string', style: { width: "140px" } }
    , { name: t('documentClass'), key: 'docClassCode', seq: 2, type: 'string' }
    , { name: t('fileFormat'), key: 'fileFormat', seq: 3, type: 'string' }
    , { name: t('fileSize'), key: 'fileSize', seq: 4, type: 'string' }
    , { name: t('importDate'), key: 'importDate', seq: 5, type: 'date' }
    , { name: t('createDate'), key: 'createDate', seq: 6, type: 'date' }
    , { name: t('retentionPeriod'), key: 'retentPeriod', seq: 7, type: 'string' }
    , { name: t('disposalDate'), key: 'disposalDate', seq: 8, type: 'date' }
    , { name: t('extendDisposalDate'), key: 'extendDisposalDate', seq: 9, type: 'date' }
  ]

  const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });
  const sortableResultTableColumns = resultTableColumnsSorted.map(column => ({ id: column.key, label: column.name, canOrder: true }));

  const handlePageChange = (_: unknown, newPage: number): void => {
    setPage(newPage);
    fetchArchivalRecord({ limit, offset: newPage * limit, order, orderBy })
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newLimit = parseInt(event.target.value)
    setLimit(newLimit);
    if (newLimit > limit) {
      fetchArchivalRecord({ offset: offset, limit: newLimit, order, orderBy });
    } else {
      setDataTemp(dataTemp.slice(offset, offset + newLimit));
    }
  };

  const clickResetButton = () => {
    reset();
    setPage(0);
  }

  const getCellDisplay = (value, type, columnKey) => {
    if (type === 'date') return moment(value).format('yyyy-MM-DD')
    if (type === 'dateTime') return moment(value).format('yyyy-MM-DD HH:mm:ss')
    return value
  }

  const fetchArchivalRecord = (
    pageOption: { limit?: number, offset?: number, order?: Order, orderBy?: string } = { limit: DEFAULT_ROWS_PER_PAGE, offset: 0, order: "asc", orderBy: "id" },
  ) => {
    globalPageLoadSetter(true);
    let postBody: any = { ...getValues() };
    postBody.importDateFrom = !!postBody.importDateFrom ? moment(postBody.importDateFrom).utc() : undefined;
    postBody.importDateTo = !!postBody.importDateTo ? moment(postBody.importDateTo).utc() : undefined;
    postBody.createDateFrom = !!postBody.createDateFrom ? moment(postBody.createDateFrom).utc() : undefined;
    postBody.createDateTo = !!postBody.createDateTo ? moment(postBody.createDateTo).utc() : undefined;
    axios.post<CatslasReturn<Countable<{ archivalRecord: DataTemp[] }>>>(`${CATSLAS_BACKEND_SERVICE_URL}/api/v1/archival-record/search`, {
      ...postBody,
      ...pageOption,
    }).then(res => {
      setCount(res.data.result.count);
      const data = res.data.result.archivalRecord.map(v => ({
        ...v,
        isDisable: !moment().isBetween(moment(v.disposalDate), moment(v.extendDisposalDate)),
      }));
      setDataTemp(data);
    }).finally(() => globalPageLoadSetter(false));
  }

  function loadDocumentClass() {
    axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/log-report/document-classes/get-all-document-class`,{
      requestFrom: "search-disposal-date"
    }
    ).then((response) => {
      setDocumentClassData(response.data.result);
    })
      .catch((error) => {
        console.log(error.response);
      });
  }

  useEffect(() => {
    globalPageLoadSetter(true);
    fetchArchivalRecord();
    loadDocumentClass();
  }, [])

  const handleSearch = () => {
    setPage(0);
    fetchArchivalRecord({ limit: limit, offset: 0 });
  }

  const extendDisposalDate = async () => {
    axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/archival-record/update`, {
      recordList: dataTemp.filter(v => checkedRows.findIndex(id => id === v.id) > -1),
    })
      .then(() => {
        globalSnackbarSetter({
          showSnackbar: true,
          snackbarMsg: "test",
          snackbarSeverity: "success",
        });
        fetchArchivalRecord();
      })
      .catch((e: AxiosError) => {
        globalSnackbarSetter({
          showSnackbar: (e.response.data as any)?.message || e.message,
          snackbarMsg: "test",
          snackbarSeverity: "error",
        });
      });
  }

  const handleRequestSort = (_: unknown, property: string) => {
    const isAsc = orderBy === property && order !== "asc";
    const newOrder = isAsc ? "asc" : "desc";
    fetchArchivalRecord({ offset, limit, order: newOrder, orderBy: property });
    setOrder(newOrder);
    setOrderBy(property);
  }


  const ExtendDisposalConfirm = () => {
    return (
      <Modal
        open={showExtendDisposalDatePopup}
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
                      component="div"
                      sx={{
                        '& .MuiTextField-root': { width: '90%' },
                        '& .MuiInputLabel-root': { ml: "1rem" },
                        '& .MuiInputBase-root': { ml: "1rem", mt: "0" }
                      }}
                    >
                      <Accordion expanded={true} className="expand_disabled">
                        <AccordionSummary
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography variant="h3">{"Confirm to extend"}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container>
                            <Grid item width="100%">
                              <List sx={{ overflow: "auto", maxHeight: "200px", width: "100%" }}>
                                <ListSubheader color="primary">File Name</ListSubheader>
                                {checkedRows.map(v => {
                                  const record = dataTemp.find(data => data.id === v);
                                  return (
                                    <ListItem key={v}>
                                      <ListItemText primary={record?.fileName} primaryTypographyProps={{
                                        variant: "body1",
                                        color: "text.primary"
                                      }} />
                                    </ListItem>
                                  )
                                })}
                              </List>
                            </Grid>
                            <Grid item container justifyContent="end">
                              <Grid item>
                                <Button
                                  type="button"
                                  sx={{ marginLeft: '10px' }}
                                  variant="contained"
                                  startIcon={<Check fontSize="small" />}
                                  onClick={() => {
                                    extendDisposalDate();
                                    setExtendDisposalDatePopup(false);
                                  }}>
                                  {t('yes')}
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button type="button"
                                  sx={{ marginLeft: '10px' }}
                                  variant="outlined"
                                  startIcon={<DoDisturb fontSize="small" />}
                                  onClick={() => {
                                    setExtendDisposalDatePopup(false);
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
    <Card id="document-class-access-mgmnt" >
      {(
        <Container maxWidth={false} disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container' component="form" onSubmit={handleSubmit(() => handleSearch())}>
          <Grid container className='row'>
            <Grid className='field'>
              <TextField
                {...register("fileName")}
                label={t("fileName")}
                placeholder={t('contain')}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid className='field'>
              <TextField
                {...register("fileFormat")}
                label={t("fileFormat")}
                placeholder={t('contain')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
              />
            </Grid>
            <Grid className='field'>
              <HookedSelectField control={control} name="documentClass" label={t("documentClass")} sx={{ minWidth: 150 }}>
                <MenuItem value={"ALL"}>ALL</MenuItem>
                {documentClassData.map(classId => <MenuItem value={classId} key={classId}>{classId}</MenuItem>)}
              </HookedSelectField>
            </Grid>

          </Grid>
          <Grid container className='row'>
            <Grid item>
              <HookedDatePicker
                label={t("importDateForm")}
                name='importDateFrom'
                mask="____-__-__"
                inputFormat="YYYY-MM-DD"
                control={control}
                rules={{
                  validate: {
                    max: (date) => {
                      const importDateTo = getValues("importDateTo");
                      if (!!importDateTo && !!date) {
                        return (date < importDateTo) || t("importDateFromMax");
                      }
                    },
                  },
                }}
              />
            </Grid>
            <Grid item>
              <HookedDatePicker
                label={t("importDateTo")}
                name='importDateTo'
                mask="____-__-__"
                inputFormat="YYYY-MM-DD"
                control={control}
                rules={{
                  validate: {
                    min: (date) => {
                      const importDateFrom = getValues("importDateFrom");
                      if (!!importDateFrom && !!date) {
                        return (date > importDateFrom) || t("importDateToMin");
                      }
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container className='row'>
            <Grid item>
              <HookedDatePicker
                label={t("createDateFrom")}
                name="createDateFrom"
                mask="____-__-__"
                inputFormat="YYYY-MM-DD"
                control={control}
                rules={{
                  validate: {
                    min: (date) => {
                      const createDateTo = getValues("createDateTo");
                      if (!!createDateTo && !!date) {
                        return (date < createDateTo) || t("crateDateFromMin");
                      }
                    },
                  },
                }}
              />
            </Grid>

            <Grid item>
              <HookedDatePicker
                label={t("createDateTo")}
                name="createDateTo"
                mask="____-__-__"
                inputFormat="YYYY-MM-DD"
                control={control}
                rules={{
                  validate: {
                    min: (date) => {
                      const createDateFrom = getValues("createDateFrom");
                      if (!!createDateFrom && !!date) {
                        return (date > createDateFrom) || t("createDateToMin");
                      }
                    },
                  },
                }}
              />
            </Grid>
            <Grid item marginLeft={"auto"}>
              <Button
                variant="outlined"
                sx={{ marginRight: 1 }}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  clickResetButton();
                }}
                size="medium"
              >
                {t('reset')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Search fontSize="small" />}
                size="medium"
              >
                {t('search')}
              </Button>
            </Grid>
          </Grid>

          <Grid container className='row' sx={{ marginTop: 1 }}>
            <Grid item>
              <Button
                disabled={checkedRows.length < 1}
                variant="contained"
                onClick={() => setExtendDisposalDatePopup(true)}
              >
                {t('extendDisposalDate')}
              </Button>
            </Grid>
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
      )}

      <TableContainer>
        <Table>
          <EnhancedTableHead
            headCells={sortableResultTableColumns}
            onRequestSort={handleRequestSort}
            onSelectAll={(checked) => {
              setCheckedAll(checked);
              if (checked) {
                setCheckedRows(dataTemp.filter(d => !d.isDisable).map(d => d.id));
              } else {
                setCheckedRows([]);
              }
            }}
            selectAll={checkedAll}
            order={order}
            orderBy={orderBy} />
          <TableBody>
            {
              map(dataTemp, (d) => {
                const isChecked = checkedRows.findIndex(id => id === d.id) > -1 && !d.isDisable;
                return (
                  <TableRow
                    hover
                    key={d.id}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isChecked}
                        disabled={d.isDisable}
                        onChange={(_, checked) => {
                          if (checked) {
                            setCheckedRows((rows) => [...rows, d.id]);
                            if (checkedRows.length > dataTemp.length - 1) {
                              setCheckedAll(true);
                            }
                          } else {
                            setCheckedRows((rows) => rows.filter(row => row !== d.id));
                          }
                        }}
                      />
                    </TableCell>
                    {map(resultTableColumnsSorted, function (o) {
                      return (
                        <TableCell key={o.key}>
                          <Typography
                            style={{ wordBreak: "break-word" }}
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
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
      <ExtendDisposalConfirm />
    </Card>
  );
};

export default SearchDisposalDateResultTable;

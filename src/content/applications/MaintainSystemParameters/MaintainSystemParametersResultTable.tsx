import { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback, useRef, MouseEventHandler } from 'react';
import { useForm } from "react-hook-form";
import './MaintainSystemParametersResultTable.scss';
import {
  Tooltip,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  Container,
  Grid,
  TextField,
  Button,
  AccordionDetails,
  Modal,
  CardContent,
  Accordion,
  AccordionSummary,
} from '@mui/material';
import { Check, DoDisturb } from "@mui/icons-material";

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { ParameterQueryResult } from 'src/models/Parameter';
import { Search } from '@mui/icons-material';
import { ParameterSearchContext } from './MaintainSystemParametersSearchContext';
import { ParameterSearchCriteriaContext } from './MaintainSystemParametersCriteriaContext';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, USER_CONFIG_SERVICE_URL } from "src/constants";
import { useLocation } from 'react-router';
import { filter, findIndex, map, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import axios from 'axios';
import { CatslasReturn, Countable, Order } from 'src/utilities/Utils';
import EnhancedTableHead from 'src/components/EnhancedTableHead';

interface UserTableProp {
  className?: string;
}

interface dataTemp {
  // id: number;
  sysId: string;
  description: string;
  value: string;
  checked?: boolean;
}
interface SystemParamsEntry {
  // id: number;
  sysDesc: string;
  sysClabel: string;
  sysElabel: string;
  sysId: string;
  sysValue: string;
  sysSeq: string;
  updateTime: Date;
}

interface SystemParamsResponse {
  sysParamList: SystemParamsEntry[];
}

const MaintainSystemParametersResultTable: FC<UserTableProp> = ({ }) => {
  const modelDataRef = useRef<Countable<SystemParamsResponse>>(null);
  const { t } = useTranslation('maintainSystemParameters')
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const [count, setCount] = useState<number>(0);
  const offset = limit * page;

  const [dataTemp, setDataTemp] = useState<dataTemp[]>(null);

  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  const [id, setId] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [valueError, setValueError] = useState<String>("")

  const parameterSearchContext = useContext(ParameterSearchContext);
  const parameterSearchCriteriaContext = useContext(ParameterSearchCriteriaContext);
  const [loadSearchCriteriaContext, setLoadSearchCriteriaContext] = useState<boolean>(useLocation().state?.loadSearchCriteriaContext);

  // order
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>();

  const setPageLoader = useContext(SetPageLoaderContext);

  const fetchSysParams = async (
    criteria?: Pick<SystemParamsEntry, "sysId" | "sysDesc">,
    pageOption: { limit?: number, offset?: number, order?: Order, orderBy?: string } = { limit: 100, offset: 0, order: "asc", orderBy: "id" },
  ) => {
    setPageLoader(true);
    axios.post<CatslasReturn<Countable<SystemParamsResponse>>>(
      `${USER_CONFIG_SERVICE_URL}/api/v1/system-administration/sys-params/search`,
      {
        ...criteria,
        ...pageOption,
      })
      .then(res => {
        const { count, sysParamList } = res.data.result;
        const resTransfer: dataTemp[] = sysParamList.map(sysParam => ({
          // id: sysParam.id,
          sysId: sysParam.sysId,
          description: sysParam.sysDesc,
          value: sysParam.sysValue,
          checked: false,
        }));
        setDataTemp(resTransfer);
        setCount(count);
        modelDataRef.current = res.data.result;
      })
      .finally(() => setPageLoader(false));
  }

  function submit() {
    const entryId = getValues("id");
    const newParamValue = getValues("paramValue");
    const originalData = modelDataRef.current.sysParamList.find(param => param.sysId === entryId);
    if (originalData) {
      const sysParam = {
        ...originalData,
        sysValue: newParamValue,
      };
      updateSysParam(sysParam);
    }
  }
  const updateSysParam = (newEntry: SystemParamsEntry) => {
    setPageLoader(true);
    axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/system-administration/sys-params/update`, { ...newEntry })
      .then(() => {
        fetchSysParams({ sysId: id, sysDesc: description }, { limit, offset, order, orderBy });
      })
      .finally(() => setPageLoader(false));
  }

  const clickSubmitValue = (val) => {
    if (!val) {
      setValueError(t('valueErrorMessage'))
      return false;
    } else {
      setValueError("")
      return true;
    }
  }

  interface IFormValue {
    id: string,
    paramValue: string
  }

  const defaultValues: IFormValue = {
    id: "",
    paramValue: ""
  };

  const { register, setValue, getValues } = useForm<IFormValue>({
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (loadSearchCriteriaContext) {
      loadParameterListByClickBackButton();
      setLoadSearchCriteriaContext(false);
    }
  }, []);

  const columns = [
    { name: t('id'), key: 'sysId', seq: 1, type: 'string', style: { width: "100px" } }
    , { name: t('description'), key: 'description', seq: 2, type: 'string' }
    , { name: t('value'), key: 'value', seq: 3, type: 'string' }
    , { name: t("changeValue"), key: "changeValue", type: 'string', seq: 4 }
  ] as const

  const columnsSorted = sortBy(columns, function (o) { return o.seq });
  const sortableColunmn = columnsSorted.map(head => ({ id: head.key, label: t(head.name), canOrder: !(head.key === "changeValue") }));

  const handlePageChange = (_: unknown, newPage: number): void => {
    setPage(newPage);
    console.log("set page to:" + newPage);
    fetchSysParams({ ...(!!id && { sysId: id }), ...(!!description && { sysDesc: description }) }, { offset: newPage * limit, limit: limit, order, orderBy });
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newLimit = parseInt(event.target.value)
    setLimit(newLimit);
    if (newLimit > limit) {
      fetchSysParams({ ...(!!id && { sysId: id }), ...(!!description && { sysDesc: description }) }, { offset: offset, limit: newLimit, order, orderBy });
    } else {
      setDataTemp(dataTemp.slice(offset, offset + newLimit));
    }
    console.log("set limit to: " + parseInt(event.target.value))
  };

  const clickResetButton = () => {
    setId("");
    setDescription("")
  }

  const theme = useTheme();


  const loadParameterListByClickBackButton = useCallback(function loadParameterListByClickBackButton() {
    console.log("call context search function");
    readSearchCriteriaContext(parameterSearchCriteriaContext.parameterSearchCriteria);
  }, [])

  const getCellDisplay = (value, type, columnKey) => {
    // if(!value)return
    // if(columnKey === 'userGroupIdList') return join(map(value,(i)=>{return find(userGroupList,{id: i})['description']}),', ')
    // if(type === 'boolean') return value ? 'Yes' : 'No'
    return value
  }

  const editRecord = (id, value) => {
    setValue("id", id)
    setValue("paramValue", value)
    setShowPopUp(true);
  }


  const saveSearchCriteriaContext = (rows: number, parameterListAfterSearch: ParameterQueryResult[], limit: number, page: number) => {
    var searchCriteria =
    {
      id: id,
      description: description,
      limit: limit,
      page: page,
      count: rows,
      parameterList: parameterListAfterSearch
    }
    parameterSearchCriteriaContext.setParameterSearchCriteria(searchCriteria);
  }

  const readSearchCriteriaContext = (parameterSearchCriteria: any) => {
    setId(parameterSearchCriteria.id);
    setDescription(parameterSearchCriteria.description);
    setLimit(parameterSearchCriteria.limit);
    setPage(parameterSearchCriteria.page);
    setCount(parameterSearchCriteria.count);
    parameterSearchContext.setParameterQueryResultList(parameterSearchCriteria.parameterList)
    // (userSearchCriteria.userList);
  }

  const handleRequestSort = (_: unknown, property: string) => {
    const isAsc = orderBy === property && order !== "asc";
    const newOrder = isAsc ? "asc" : "desc";
    fetchSysParams({ ...(!!id && { sysId: id }), ...(!!description && { sysDesc: description }) }, { offset, limit, order: newOrder, orderBy: property });
    setOrder(newOrder);
    setOrderBy(property);
  }


  useEffect(() => {
    fetchSysParams(null, { offset, limit, order, orderBy });
  }, [])
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
                          <Typography variant="h3">{t('changeNewValue')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container>
                            <Grid item container justifyContent="end">
                              <Grid className='field'
                                sx={{ width: 250 }}>
                                <TextField
                                  id="paramValue"
                                  variant="standard"
                                  {...register("paramValue")}
                                  error={!!valueError}
                                  helperText={valueError}
                                />
                              </Grid>
                              <Grid item>
                                <Button type="button"
                                  sx={{ marginLeft: '10px' }}
                                  variant="outlined"
                                  startIcon={<DoDisturb fontSize="small" />}
                                  onClick={() => {
                                    setValueError("")
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
                                    if (clickSubmitValue(getValues("paramValue"))) {
                                      submit();
                                      setValueError("")
                                      setShowPopUp(false);
                                    }
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

  const renderCellsByColunms = (data: dataTemp, headers: typeof columnsSorted) => {
    return map(headers, (header) => {
      return (<TableCell key={`${header.key}-${data.sysId}`}>
        <Typography
          style={(header as any).style}
          variant="body1"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {getCellDisplay(data[header.key], header.type, header.key)}
        </Typography>
      </TableCell>
      );
    });
  }

  const renderAction = (data: dataTemp) => {
    return <TableCell align="left" sx={{ width: "100px" }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '30px 30px', marginRight: 6 }}>
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
            onClick={() => editRecord(data.sysId, data.value)}
          >
            <EditTwoToneIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </TableCell>
  }

  return (
    <Card id="maintain-system-parameters" >
      {(
        <Container maxWidth={false} disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container'>
          <Grid container className='row'>
            <Grid className='field'>
              <TextField
                label={t('id')}
                placeholder={t('contain')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                value={id}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
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
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription((e.target.value))}
              />
            </Grid>
            <Grid item marginLeft={"auto"}>
              <Button
                variant="outlined"
                sx={{ marginRight: 1 }}
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
                  // todo: call api
                  // setPage(0);
                  // searchIntelligenceSharingReport(limit, 0);
                  fetchSysParams({ sysId: id, sysDesc: description }, { limit, offset: 0, order, orderBy });
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
      )}
      <TableContainer>
        <Table>

          <EnhancedTableHead order={order} orderBy={orderBy} headCells={sortableColunmn} onRequestSort={handleRequestSort} />
          <TableBody>
            {
              map(dataTemp, (d) => (
                <TableRow
                  hover
                  key={d.sysId}
                >
                  {renderCellsByColunms(d, columnsSorted.slice(0, -1))}
                  {renderAction(d)}
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Popup />
    </Card>
  );
};

export default MaintainSystemParametersResultTable;

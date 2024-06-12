import { Check, DoDisturb } from "@mui/icons-material";
import DatePicker from "@mui/lab/DatePicker";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Card, CardContent, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, TablePagination, } from "@mui/material";
import { FC, useEffect, useState, useContext, ChangeEvent, MouseEvent } from "react";

import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from "src/constants";
import { concatErrorMsg } from "src/utilities/Utils";
import axios from "axios";
import PageLoader from "src/components/PageLoader";
import { Search } from '@mui/icons-material';

interface SearchErrorMessage {
    accessDateFrom: any
    accessDateTo: any
    importDateFrom: any,
    importDateTo: any
}

type SearchAccessRightRequestPopupProps = {
    setUserDocumentClassList: any,
    setAlertStatus: any,
    setServerErrorMsg: any,
    setShowMessage: any,
    documentClassMaps: any,
    clickPopup: any,
    updateOrConfirmSucceed: any,
    setUpdateOrConfirmSucceed: any,
    order: any,
    orderBy: any,
}

const SearchAccessRightRequestComponent: FC<SearchAccessRightRequestPopupProps> =
    ({
        setUserDocumentClassList,
        setAlertStatus,
        setServerErrorMsg,
        setShowMessage,
        documentClassMaps,
        clickPopup,
        updateOrConfirmSucceed,
        setUpdateOrConfirmSucceed,
        order,
        orderBy,
    }) => {



        const { t } = useTranslation('documentClassAccessMgmnt')
        const globalPageLoadSetter = useContext(SetPageLoaderContext);
        const [showLoader, setShowLoader] = useState<boolean>(false);

        const [requestNo, setRequestNo] = useState<string>("");
        const [documentClass, setDocumentClass] = useState<String>("ALL");
        const [status, setStatus] = useState<String>("ALL");
        const [accessDateFrom, setAccessDateFrom] = useState<Moment | null>(null);
        const [accessDateTo, setAccessDateTo] = useState<Moment | null>(null);
        const [importDateFrom, setImportDateFrom] = useState<Moment | null>(null);
        const [importDateTo, setImportDateTo] = useState<Moment | null>(null);

        const [searchErrorMessage, setSearchErrorMessage] = useState<SearchErrorMessage>(null);
        const [requestNumberError, setRequestNumberError] = useState<String>("")

        const [page, setPage] = useState<number>(0);
        const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
        const [count, setCount] = useState<number>(0);



        useEffect(() => {
            searchAccessRightRequest();
        }, [order, orderBy]);


        useEffect(() => {
            if (updateOrConfirmSucceed) {
                searchAccessRightRequest();
                setUpdateOrConfirmSucceed(false);
            }
        }, [updateOrConfirmSucceed]);


        const dateFormatterToYYYYMMDD = (value) => {
            if (!value) return "";
            return moment(value).format('yyyy-MM-DD')
        }

        const dateFormatterToDateTime = (value) => {
            if (!value) return "";
            return moment(value).format('yyyy-MM-DD HH:mm:ss')
        }

        const clickResetButton = () => {
            console.log('re')
            setRequestNo("")
            setAccessDateFrom(null)
            setAccessDateTo(null)
            setImportDateFrom(null)
            setImportDateTo(null)
            setDocumentClass("ALL")
            setStatus("ALL")

            setSearchErrorMessage(null);
        }

        const changeAccessFromDate = (newValue) => {
            setAccessDateFrom(newValue);
        };

        const changeAccessToDate = (newValue) => {
            setAccessDateTo(newValue);
        };

        const changeImportFromDate = (newValue) => {
            setImportDateFrom(newValue);
        };

        const changeImportToDate = (newValue) => {
            setImportDateTo(newValue);
        };

        const searchAccessRightRequest = () => {
            resetSearchErrorMessage();
            setPage(0);
            loadAccessRightRequest(limit, 0);
        }

        const resetSearchErrorMessage = () => {
            setSearchErrorMessage(null);
        }

        const handlePageChange = (event: any, newPage: number): void => {
            setPage(newPage);
            console.log("set page to:" + newPage);
            loadAccessRightRequest(limit, newPage);
        };

        const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
            setLimit(parseInt(event.target.value));
            console.log("set limit to: " + parseInt(event.target.value))
            loadAccessRightRequest(parseInt(event.target.value), page);
        };


        const loadAccessRightRequest = (limit: number, page: number) => {

            globalPageLoadSetter(true)

            axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/access-right-requests`,
                {
                    "usdReqNo": requestNo,
                    "usdDocClass": documentClass,
                    "usdStatus": status,
                    "usdAccessStime": dateFormatterToYYYYMMDD(accessDateFrom),
                    "usdAccessEtime": dateFormatterToYYYYMMDD(accessDateTo),
                    "usdImportDateFrom": dateFormatterToYYYYMMDD(importDateFrom),
                    "usdImportDateTo": dateFormatterToYYYYMMDD(importDateTo),
                    "limit": limit,
                    "offset": (page * limit),
                    "order": order,
                    "orderBy": orderBy
                }).then((response) => {
                    if (response.status === 200) {
                        setUserDocumentClassList(response.data.result.searchUserDocumentClassResponses);
                        setCount(response.data.result.count);

                    }
                    console.log(response)
                }).catch((error) => {
                    if (error.response.status === 530) {
                        const messageResult = error.response.data.result;
                        console.log("searchErrorMessage: " + messageResult);
                        setSearchErrorMessage({
                            ...searchErrorMessage, "accessDateFrom": (!!messageResult.accessDateFrom ? concatErrorMsg(messageResult.accessDateFrom) : ""),
                            "accessDateTo": (!!messageResult.accessDateTo ? concatErrorMsg(messageResult.accessDateTo) : ""),
                            "importDateFrom": (!!messageResult.importDateFrom ? concatErrorMsg(messageResult.importDateFrom) : ""),
                            "importDateTo": (!!messageResult.importDateTo ? concatErrorMsg(messageResult.importDateTo) : "")
                        });
                    } else {
                        setAlertStatus("error");
                        setServerErrorMsg(error.response.data.message);
                        setShowMessage(true);
                        console.log("serverErrorMsg" + error.response.data.message);
                    }
                    globalPageLoadSetter(false)
                    console.log(error)
                });
        }

        return (
            <Container maxWidth={false} disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container'>
                <Grid container className='row'>
                    <Grid className='field'>
                        <TextField
                            label={t("requestNumber")}
                            placeholder={t('contain')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="standard"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setRequestNo(e.target.value)}
                            value={requestNo}
                            error={!!requestNumberError}
                            helperText={requestNumberError}
                        />
                    </Grid>
                    <Grid className='field'>
                        <FormControl variant="standard" sx={{ minWidth: 150 }}>
                            <InputLabel>{t("documentClass")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={documentClass}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setDocumentClass(e.target.value)}
                            >
                                <MenuItem value={"ALL"}>{t('all')}</MenuItem>
                                {
                                    documentClassMaps?.map((documentClass) => {
                                        return (
                                            <MenuItem key={documentClass.key} value={documentClass.key}>
                                                {documentClass.value}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid className='field'>
                        <FormControl variant="standard" sx={{ minWidth: 150 }}>
                            <InputLabel>{t("status")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={status}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
                            >
                                <MenuItem value={"ALL"}>{t('all')}</MenuItem>
                                <MenuItem value={"PENDING"}>Pending</MenuItem>
                                <MenuItem value={"SUPPORTED"}>Supported</MenuItem>
                                <MenuItem value={"UNSUPPORTED"}>Unsupported</MenuItem>
                                <MenuItem value={"APPROVED"}>Approved</MenuItem>
                                <MenuItem value={"REJECTED"}>Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>


                </Grid>
                <Grid container className='row'>
                    <Grid item>
                        <FormControl>
                            <DatePicker
                                label={t("dateFrom")}
                                value={accessDateFrom}
                                onChange={changeAccessFromDate}
                                mask="____-__-__"
                                inputFormat="YYYY-MM-DD"
                                renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!searchErrorMessage?.accessDateFrom} helperText={searchErrorMessage?.accessDateFrom} />}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl >
                            <DatePicker
                                label={t("dateTo")}
                                value={accessDateTo}
                                onChange={changeAccessToDate}
                                mask="____-__-__"
                                inputFormat="YYYY-MM-DD"
                                renderInput={(params) => <TextField InputLabelProps={{ shrink: true }} variant="standard" {...params} error={!!searchErrorMessage?.accessDateTo} helperText={searchErrorMessage?.accessDateTo} />}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item marginLeft={"auto"}>
                        <Button
                            variant="contained"
                            onClick={clickPopup}
                        >
                            {t('accesssRightRequest')}
                        </Button>
                    </Grid>
                </Grid>
                <Grid container className='row'>
                    <Grid item>
                        <FormControl>
                            <DatePicker
                                label={t("importDateFrom")}
                                value={importDateFrom}
                                onChange={changeImportFromDate}
                                mask="____-__-__"
                                inputFormat="YYYY-MM-DD"
                                renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!searchErrorMessage?.importDateFrom} helperText={searchErrorMessage?.importDateFrom} />}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl >
                            <DatePicker
                                label={t("importDateTo")}
                                value={importDateTo}
                                onChange={changeImportToDate}
                                mask="____-__-__"
                                inputFormat="YYYY-MM-DD"
                                renderInput={(params) => <TextField InputLabelProps={{ shrink: true }} variant="standard" {...params} error={!!searchErrorMessage?.importDateTo} helperText={searchErrorMessage?.importDateTo} />}
                            />
                        </FormControl>
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
                            variant="contained"
                            startIcon={<Search fontSize="small" />}
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                searchAccessRightRequest()
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
        );
    }


export default SearchAccessRightRequestComponent;
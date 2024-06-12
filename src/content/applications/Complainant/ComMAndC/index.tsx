import { Check, DoDisturb } from "@mui/icons-material";
import DatePicker from "@mui/lab/DatePicker";
import { IconButton, InputAdornment, Autocomplete, Box, Button, Card, CardContent, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, TablePagination, } from "@mui/material";
import { FC, useEffect, useState, useContext, ChangeEvent, MouseEvent } from "react";

import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from "src/constants";
import { concatErrorMsg } from "src/utilities/Utils";
import axios from "axios";
import PageLoader from "src/components/PageLoader";
import { Search } from '@mui/icons-material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

interface SearchErrorMessage {
    accessDateFrom: any
    accessDateTo: any
    importDateFrom: any,
    importDateTo: any
}

// type SearchAccessRightRequestPopupProps = {
//     setUserDocumentClassList: any,
//     setAlertStatus: any,
//     setServerErrorMsg: any,
//     setShowMessage: any,
//     documentClassMaps: any,
//     clickPopup: any,
//     updateOrConfirmSucceed: any,
//     setUpdateOrConfirmSucceed: any,
//     order: any,
//     orderBy: any,
// }

const ComMAndC  =
    ({
        // setUserDocumentClassList,
        // setAlertStatus,
        // setServerErrorMsg,
        // setShowMessage,
        // documentClassMaps,
        // clickPopup,
        // updateOrConfirmSucceed,
        // setUpdateOrConfirmSucceed,
        // order,
        // orderBy,
    }) => {



        const { t } = useTranslation('documentClassAccessMgmnt')
        const globalPageLoadSetter = useContext(SetPageLoaderContext);
        const [showLoader, setShowLoader] = useState<boolean>(false);

        const [anonymous, setAnonymous] = useState<string>("No");
        const [familyName, setFamilyName] = useState<string>("Chan");
        const [givenName, setGivenName] = useState<string>("Siu Ming");
        const [middleName, setMiddleName] = useState<string>("Peter");
        const [complainantName, setComplainantName] = useState<string>("陳小明");
        const [idType, setIdType] = useState<string>("HKID");
        const [age, setAge] = useState<string>("23(Current 25)");

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


        // useEffect(() => {
        //     searchAccessRightRequest();
        // }, [order, orderBy]);


        // useEffect(() => {
        //     if (updateOrConfirmSucceed) {
        //         searchAccessRightRequest();
        //         setUpdateOrConfirmSucceed(false);
        //     }
        // }, [updateOrConfirmSucceed]);


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
                    // "order": order,
                    // "orderBy": orderBy
                }).then((response) => {
                    if (response.status === 200) {
                        //setUserDocumentClassList(response.data.result.searchUserDocumentClassResponses);
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
                        // setAlertStatus("error");
                        // setServerErrorMsg(error.response.data.message);
                        // setShowMessage(true);
                        console.log("serverErrorMsg" + error.response.data.message);
                    }
                    globalPageLoadSetter(false)
                    console.log(error)
                });
        }

        return (
            <Container maxWidth={false} disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container'>
                <Grid item style={{ fontSize: "16px", font: "Roboto", lineHeight: "28px", fontWeight: "700", color: "#5B8197", marginBottom: "16px"  }}>
                    Area of Injury
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: "center" }}>
                    <Grid item style={{ fontSize: "16px", font: "Roboto", lineHeight: "28px", fontWeight: "700", color: "#5B8197", marginBottom: "16px"  }}>
                        <img
                            src={"https://s3-alpha-sig.figma.com/img/e7b6/5967/01262e48bcea777f3fdc704c291abd18?Expires=1716768000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TWvh0rmto2A3J3tWfI8uTNmhGhPL~0xuLXZB7HzDIE5frMuB24806-M2Ue8cMoHt6eMx4mmeU6fB3cSZ278Wd4tyjlQ~imnQsxUlboxVMKL~hbbcoTPWVMMUu9IJsIiT9HdDrz-0kb-MgvKbMw1r9pkE39VgIJbojJkItw1MN3lsPdjfxU9YDi01MZKK2UUjTZHHkVrAeUUfnatIg74Eh9F0fMZey3hQ195oDVAhOJxonBzNcldTD0Ks7PDbVEnIfG2RSmufnWpJFA9WMYq642tgFH478hGmHkC0GHnAEu99ZjZCOjLCSUfcku~eEz6JKlXMc6PwHx9oYJh3-qI1Ng__"}
                            loading="lazy"
                        />
                    </Grid>
                </Box>
                <Grid item style={{ fontSize: "16px", font: "Roboto", lineHeight: "28px", fontWeight: "700", color: "#5B8197", marginBottom: "16px"  }}>
                    Medical Findings
                </Grid>
                <Grid container className='row'>                   
                    <Grid container className='row'>
                        <Grid item className='field' xs={3.6}>
                            <FormControl variant="standard">
                                <InputLabel>{t("Receive medical treatment")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={" "}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
                                >
                                    <MenuItem value={" "}></MenuItem>
                                    <MenuItem value={"HKID"}>HKID</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item className='field' xs={3.6}>
                            <FormControl variant="standard">
                                <InputLabel>{t("Hospital")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={" "}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
                                >
                                    <MenuItem value={" "}></MenuItem>
                                    <MenuItem value={"HKID"}>HKID</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item className='field' xs={3.6}>
                            <FormControl variant="standard">
                                <TextField
                                    label={t("Clinic")}
                                    placeholder={t('contain')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="standard"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRequestNo(e.target.value)}
                                    value={" "}
                                    error={!!requestNumberError}
                                    helperText={requestNumberError}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container className='row'>
                        <Grid item className='field' xs={3.6}>
                            <FormControl variant="standard">
                                <InputLabel>{t("Injury Found")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={" "}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
                                >
                                    <MenuItem value={" "}></MenuItem>
                                    <MenuItem value={"HKID"}>HKID</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item className='field' xs={3.6}>
                            <FormControl variant="standard">
                                <TextField
                                    label={t("Injury Observed by")}
                                    placeholder={t('contain')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="standard"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRequestNo(e.target.value)}
                                    value={" "}
                                    error={!!requestNumberError}
                                    helperText={requestNumberError}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item className='field' xs={3.6}>
                            <FormControl variant="standard">
                                <TextField
                                    label={t("Type of Injury")}
                                    placeholder={t('contain')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="standard"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRequestNo(e.target.value)}
                                    value={" "}
                                    error={!!requestNumberError}
                                    helperText={requestNumberError}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container className='row'>
                        <Grid item className='field' xs={5.5}>
                            <FormControl variant="standard">
                                <DatePicker
                                    label={t("Admission Date/Time")}
                                    value={importDateTo}
                                    onChange={changeImportToDate}
                                    mask="____-__-__"
                                    inputFormat="YYYY-MM-DD"
                                    renderInput={(params) => <TextField InputLabelProps={{ shrink: true }} variant="standard" {...params} error={!!searchErrorMessage?.importDateTo} helperText={searchErrorMessage?.importDateTo} />}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item className='field' xs={5.5}>
                            <FormControl variant="standard">
                                <DatePicker
                                    label={t("Discharge Date/Time")}
                                    value={importDateTo}
                                    onChange={changeImportToDate}
                                    mask="____-__-__"
                                    inputFormat="YYYY-MM-DD"
                                    renderInput={(params) => <TextField InputLabelProps={{ shrink: true }} variant="standard" {...params} error={!!searchErrorMessage?.importDateTo} helperText={searchErrorMessage?.importDateTo} />}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container className='row'>
                        <Grid item className='field' xs={5.5}>
                            <FormControl variant="standard">
                                <TextField
                                    multiline
                                    rows={1.5}
                                    label={t("Upload Pol. 42")}
                                    placeholder={t('contain')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="standard"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRequestNo(e.target.value)}
                                    value={" "}
                                    error={!!requestNumberError}
                                    helperText={requestNumberError}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    variant="contained"
                                                    style={{ marginBottom: "8px", backgroundColor: "#094880" }}
                                                    startIcon={<AddTwoToneIcon fontSize="small" />}
                                                >
                                                    {t('Upload')}
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item className='field' xs={5.5}>
                            <FormControl variant="standard">
                                <TextField
                                    multiline
                                    rows={1.5}
                                    label={t("Upload Medical Certificate")}
                                    placeholder={t('contain')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="standard"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRequestNo(e.target.value)}
                                    value={" "}
                                    error={!!requestNumberError}
                                    helperText={requestNumberError}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    variant="contained"
                                                    style={{ marginBottom: "8px", backgroundColor: "#094880" }}
                                                    startIcon={<AddTwoToneIcon fontSize="small" />}
                                                >
                                                    {t('Upload')}
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        );
    }


export default ComMAndC;
import { Check, DoDisturb } from "@mui/icons-material";
import DatePicker from "@mui/lab/DatePicker";
import { Autocomplete, Box, Button, Card, CardContent, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, TablePagination, } from "@mui/material";
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

const ComContactMean  =
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
                    Address
                </Grid>
                <Grid container className='row'>
                    <Grid item className='field' xs={12}>
                        <Card variant="outlined" style={{ borderColor: "#094880", paddingLeft: "15px", paddingRight: "15px" }}>
                            <Grid container className='row'>
                                <Grid item className='field' xs={3.6}>
                                    <FormControl variant="standard">
                                        <TextField
                                            label={t("Unit/Flat/Room")}
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
                                            label={t("Floor")}
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
                                            label={t("Block")}
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
                                    <FormControl>
                                        <TextField
                                            label={t("Shop Name")}
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
                                <Grid item className='field' xs={7.6}>
                                    <FormControl>
                                        <TextField
                                            label={t("Building/Facility Name")}
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
                                        <TextField
                                            label={t("Estate")}
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
                                <Grid item className='field' xs={5.5}>
                                    <FormControl variant="standard">
                                        <TextField
                                            label={t("Village")}
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
                                        <TextField
                                            label={t("Phase Name/No.")}
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
                                            label={t("Street No.")}
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
                                            label={t("Street Name")}
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
                                        <TextField
                                            label={t("Junction")}
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
                                            label={t("Region")}
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
                                            label={t("District")}
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
                                        <TextField
                                            label={t("Division")}
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
                                            label={t("Beat")}
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
                                            label={t("Rail Line")}
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
                                <Grid item className='field' xs={12}>
                                    <FormControl variant="standard">
                                        <TextField
                                            label={t("Remark")}
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
                        </Card>
                    </Grid>   
                    
                    <Grid className='field' xs={12}>
                        <TextField
                            label={t("Postal Address")}
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
                    </Grid>
                    <Grid container className='row'>
                        <Grid item className='field' xs={5.5}>
                            <TextField
                                label={t("Mobile Phone No.")}
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
                        </Grid>
                        <Grid item className='field' xs={5.5}>
                            <TextField
                                label={t("Others Telephone No.")}
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
                        </Grid>
                    </Grid>
                    <Grid container className='row'>
                        <Grid item className='field' xs={5.5}>
                            <TextField
                                label={t("e-mail Address")}
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
                        </Grid>
                        <Grid item className='field' xs={5.5}>
                            <FormControl variant="standard">
                                <InputLabel>{t("Preferred Mean of Contact")}</InputLabel>
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
                    </Grid>
                </Grid>
            </Container>
        );
    }


export default ComContactMean;
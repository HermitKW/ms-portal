import { Check, DoDisturb } from "@mui/icons-material";
import DatePicker from "@mui/lab/DatePicker";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Card, CardContent, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, TablePagination, } from "@mui/material";
import { FC, useEffect, useState, useContext, ChangeEvent, MouseEvent } from "react";

import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from "src/constants";
import axios from "axios";
import PageLoader from "src/components/PageLoader";
import { Search, Add } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router';
import { Navigate, useNavigate } from "react-router";
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import i18n from "src/i18n";
import { UserSearchContext } from "./UserProfileSearchContext";

type SearchUserProfilePopupProps = {
    setUserProfileSearchResultList: any,
    setAlertStatus: any,
    setServerErrorMsg: any,
    setShowMessage: any,
    documentClassMaps: any,
    teamMaps: any,
    order: any,
    orderBy: any,
    roleMaps: any,
}

const SearchUserProfileComponent: FC<SearchUserProfilePopupProps> =
    ({
        setUserProfileSearchResultList,
        setAlertStatus,
        setServerErrorMsg,
        setShowMessage,
        documentClassMaps,
        teamMaps,
        order,
        orderBy,
        roleMaps,

    }) => {

        const navigateWithLocale = useNavigateWithLocale();

        const { t } = useTranslation('userProfile')
        const globalPageLoadSetter = useContext(SetPageLoaderContext);
        const [showLoader, setShowLoader] = useState<boolean>(false);

        const [name, setName] = useState<string>("");
        const [ui, setUI] = useState<string>("");
        const [team, setTeam] = useState<string>("ALL");
        const [role, setRole] = useState<string>("ALL");
        const [documentClass, setDocumentClass] = useState<String>("ALL");
        const [status, setStatus] = useState<String>("ALL");

        const [page, setPage] = useState<number>(0);
        const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
        const [count, setCount] = useState<number>(0);


        const userSearchContext = useContext(UserSearchContext);



        useEffect(() => {
            searchUserProfile();
            if (userSearchContext?.userAction?.limit) {
                setLimit(userSearchContext.userAction.limit);
            }
        }, [order, orderBy]);

        useEffect(() => {
            searchUserProfile();
            if (userSearchContext?.userAction?.limit) {
                setLimit(userSearchContext.userAction.limit);
            }
        }, []);

        useEffect(() => {
            if (userSearchContext) {
                userSearchContext.setUserAction({ limit: limit });
                console.log("userSearchContext.setUserAction limit: " + limit);
            }
        }, [limit]);

        const clickResetButton = () => {
            console.log('re')
            setName("");
            setUI("");
            setTeam("ALL");
            setRole("ALL");
            setDocumentClass("ALL")
            setStatus("ALL")
        }

        const hook = useNavigate();
        const addUser = () => {
            // const path = "user-profile";
            // return hook(`/${i18n.language}/${path}/0`);
            return navigateWithLocale(`user-profile`)("0");
        }


        const searchUserProfile = () => {
            setPage(0);
            loadAccessRightRequest(limit, 0);
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

            axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/auth-service/user-profile/search`,
                {
                    "accName": name,
                    "accUi": ui,
                    "teamId": team,
                    "usrRolId": role,
                    "usrDcId": documentClass,
                    "accStatus": status,
                    "limit": limit,
                    "offset": (page * limit),
                    "order": order,
                    "orderBy": orderBy
                }).then((response) => {
                    if (response.status === 200) {
                        setUserProfileSearchResultList(response.data.result.searchAccountProfileResponseList);
                        setCount(response.data.result.count);

                    }
                    console.log(response)
                }).catch((error) => {
                    if (error.response.status === 530) {
                        const messageResult = error.response.data.result;
                        console.log("searchErrorMessage: " + messageResult);
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
                            label={t("name")}
                            placeholder={t('contain')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="standard"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            value={name}
                        />
                    </Grid>
                    <Grid className='field'>
                        <TextField
                            label={t("ui")}
                            placeholder={t('exact')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="standard"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUI(e.target.value)}
                            value={ui}
                        />
                    </Grid>
                    <Grid className='team'>
                        <FormControl variant="standard" sx={{ minWidth: 150 }}>
                            <InputLabel>{t("team")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={team}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTeam(e.target.value)}
                            >
                                <MenuItem value={"ALL"}>{t("all")}</MenuItem>
                                {
                                    teamMaps?.map((team) => {
                                        return (
                                            <MenuItem key={team.key} value={team.key}>
                                                {team.value}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container className='row'>
                    <Grid className='team'>
                        <FormControl variant="standard" sx={{ minWidth: 210 }}>
                            <InputLabel>{t("role")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={role}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
                            >
                                <MenuItem value={"ALL"}>{t("all")}</MenuItem>
                                {
                                    roleMaps?.map((role) => {
                                        return (
                                            <MenuItem key={role.key} value={role.key}>
                                                {role.value}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
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
                                <MenuItem value={"ALL"}>{t("all")}</MenuItem>
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
                    <Grid className='team'>
                        <FormControl variant="standard" sx={{ minWidth: 150 }}>
                            <InputLabel>{t("status")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={status}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
                            >
                                <MenuItem value={"ALL"}>{t("all")}</MenuItem>
                                <MenuItem value={"A"}>Active</MenuItem>
                                <MenuItem value={"I"}>Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item marginLeft={"auto"}>
                        <Button
                            variant="contained"
                            sx={{ marginRight: 1 }}
                            startIcon={<Add fontSize="small" />}
                            onClick={() => { addUser() }}
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
                                clickResetButton();
                            }}
                            size="medium"
                        >
                            {t('reset')}
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ marginRight: 1 }}
                            startIcon={<Search fontSize="small" />}
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                searchUserProfile()
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


export default SearchUserProfileComponent;
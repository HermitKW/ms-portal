import {
    Box, Button, Container, FormControl, FormHelperText, Grid, IconButton, MenuItem, Select, TableCell, TableRow, TextField, Typography, TablePagination,
    Tooltip,
    Table,
    TableBody,
    TableHead,
    TableContainer,
    useTheme,
    Modal,
    Card,
    AccordionSummary, Accordion, CardContent, AccordionDetails
} from "@mui/material";
import { TableHeader } from 'src/components/Table';
import axios, { AxiosError } from "axios";
import React, { useEffect, ChangeEvent, useState, MouseEvent, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Navigate } from "react-router";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { Check, DoDisturb, Save, Close } from "@mui/icons-material";
import { DEFAULT_ROWS_PER_PAGE_OPTIONS, INTELLIGENCE_SHARING_RPT_SERVICE_URL, DEFAULT_ROWS_PER_PAGE } from "src/constants";
import { ENV_NAME, USER_CONFIG_SERVICE_URL } from "src/constants";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SetPageLoaderContext } from "src/components/GlobalPageLoader/GlobalPageLoaderContext";
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import moment, { Moment } from 'moment';
import { map, repeat, sortBy } from 'lodash';
import { UserRole, UserRoleDisplay } from 'src/models/UserRole';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { keyBy } from 'lodash';
import { UserProfileError, emptyUserProfileError } from "src/models/AccountProfile";
import i18n from "src/i18n";
import { concatErrorMsgWithErrorFormHelperText } from "src/utilities/Utils";
import { makeStyles } from "@mui/styles";
import PageLoader from "src/components/PageLoader";
import '../UserProfileResultTable.scss';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


interface DocumentClassMap {
    key: any
    value: any
}

interface TeamMap {
    key: any
    value: any
}

type UserEditParams = {
    id: string
};

interface RoleMap {
    key: any
    value: any
}

function UserProfileEdit() {
    const navigate = useNavigate();
    const navigateWithLocale = useNavigateWithLocale();



    const { t } = useTranslation("userProfile");

    const params = useParams<UserEditParams>();

    const [documentClassMaps, setDocumentClassMaps] = useState<DocumentClassMap[]>([]);
    const [documentClassMapsKeyByKey, setDocumentClassMapsKeyByKey] = useState<any>(null);
    const [teamMaps, setTeamMaps] = useState<TeamMap[]>([]);
    const [teamMapsKeyByKey, setTeamMapsKeyByKey] = useState<any>(null);
    const [roleMaps, setRoleMaps] = useState<RoleMap[]>([]);

    const [alertStatus, setAlertStatus] = useState<any>("");
    const [serverErrorMsg, setServerErrorMsg] = useState("");
    const [showMessage, setShowMessage] = useState<boolean>(false);


    const [showSnackbarSuccessPopup, setshowSnackbarSuccessPopup] = useState<boolean>(false);
    const [snackbarSuccessMsg, setsnackbarSuccessMsg] = useState<String>('');
    const [showSnackbarFailedPopup, setshowSnackbarFailedPopup] = useState<boolean>(false);
    const [snackbarFailedMsg, setsnackbarFailedMsg] = useState<String>('');
    const [errorMessage, setErrorMessage] = useState<UserProfileError>(emptyUserProfileError);


    const [title, setTitle] = useState<string>("");
    const [addOrEdit, setAddOrEdit] = useState<string>("");
    const [isEdit, setIsEdit] = useState<boolean>(false);


    const globalPageLoadSetter = useContext(SetPageLoaderContext);




    const theme = useTheme();

    const [ui, setUi] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [post, setPost] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [team, setTeam] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [updateTime, setUpdateTime] = useState<string>("");
    const [accId, setAccId] = useState<string>("");

    const [roleSelected, setRoleSelected] = useState<string>("");
    const [documentClassSelected, setDocumentClassSelected] = useState<string>("");

    const [userRoleList, setUserRoleList] = useState<UserRoleDisplay[]>([]);
    const [addUserRolePopUp, setAddUserRolePopUp] = useState<boolean>(false);

    const [userRoleSelectedError, setUserRoleSelectedError] = useState<String>("")
    const [documentClassSelectedError, setDocumentClassSelectedError] = useState<String>("")

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
    const [count, setCount] = useState<number>(0);

    const [reloadPage, setReloadPage] = useState<boolean>(true);

    useEffect(() => {
        if (reloadPage) {
            console.log("start create or edit user profile");
            globalPageLoadSetter(true);
            loadDocumentClassesMap();
            loadTeamsMap();
            loadRoleMap();
            setIsEdit(params.id !== '0');
            if (params.id !== '0') {
                console.log("Edit User Profile: " + params.id);
                viewUserProfile(params.id);
                setTitle(t('editUserProfile'))
                setAddOrEdit("Edit")
            } else {
                setTitle(t('addUserProfile'))
                setAddOrEdit("Add")

            }
            setReloadPage(false)
        }
    }, [params.id, reloadPage])


    const resultTableColumns = [
        { name: t('role'), key: 'usrRolId', seq: 1, type: 'string', style: {} }
        , { name: t('documentClass'), key: 'usrDcId', seq: 2, type: 'string', style: {} }
    ]

    const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });

    const getCellDisplay = (value, type, columnKey) => {
        if (type === 'date') return moment(value).format('yyyy-MM-DD')
        if (type === 'datetime') return moment(value).format('yyyy-MM-DD HH:mm:ss')
        return value
    }

    const documentClassMapsKeyBy = (documentClassMaps) => {
        setDocumentClassMapsKeyByKey(keyBy(documentClassMaps, "key"));
    }

    const teamMapsKeyBy = (teamsMaps) => {
        setTeamMapsKeyByKey(keyBy(teamsMaps, "key"));
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
        console.log("set page to:" + newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
        console.log("set limit to: " + parseInt(event.target.value))
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

    const loadDocumentClassesMap = () => {

        globalPageLoadSetter(true);

        axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/document-classes/map/admin`,
            {

            }).then((response) => {
                if (response.status === 200) {
                    let documentClassMaps: DocumentClassMap[] = map(response.data.result, function (i) {
                        let documentClassMap: DocumentClassMap = {
                            key: i.key,
                            value: i.value
                        }
                        return documentClassMap
                    });
                    console.log("documentClassMaps: " + documentClassMaps);
                    setDocumentClassMaps(documentClassMaps);
                    documentClassMapsKeyBy(documentClassMaps);
                }
                console.log(response)
            }).catch((error) => {
                setAlertStatus("error");
                setServerErrorMsg(error.response.data.message);
                setShowMessage(true);
                console.log(serverErrorMsg);
                console.log(error)
            });
        // setShowLoader(false);
    }


    const loadTeamsMap = () => {

        globalPageLoadSetter(true);

        axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/auth-service/teams/map`,
            {

            }).then((response) => {
                if (response.status === 200) {
                    let teamMaps: TeamMap[] = map(response.data.result, function (i) {
                        let teamMap: TeamMap = {
                            key: i.key,
                            value: i.value
                        }
                        return teamMap
                    });
                    console.log("setTeamMaps: " + teamMaps);
                    setTeamMaps(teamMaps);
                    teamMapsKeyBy(teamMaps);
                }
                console.log(response)
            }).catch((error) => {
                setAlertStatus("error");
                setServerErrorMsg(error.response.data.message);
                setShowMessage(true);
                console.log(serverErrorMsg);
                console.log(error)
            });
        // setShowLoader(false);
    }

    const loadRoleMap = () => {

        globalPageLoadSetter(true);

        axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/auth-service/role/map`,
            {

            }).then((response) => {
                if (response.status === 200) {
                    let roleMaps: RoleMap[] = map(response.data.result, function (i) {
                        let roleMap: RoleMap = {
                            key: i.key,
                            value: i.value
                        }
                        return roleMap
                    });
                    console.log("setRoleMaps: " + roleMaps);
                    setRoleMaps(roleMaps);
                }
                console.log(response)
            }).catch((error) => {
                setAlertStatus("error");
                setServerErrorMsg(error.response.data.message);
                setShowMessage(true);
                console.log(serverErrorMsg);
                console.log(error)
            });
    }


    const handleCloseError = () => {
        setServerErrorMsg("");
        setShowMessage(false);
    }

    const reloadUserProfile = () => {
        viewUserProfile(params.id);
    }

    const comfirmButtonClick = () => {
        resetErrorMessage();
        if (isEdit) {
            updateUserProfile(params.id);
        } else {
            createUserProfile();
        }
    }

    const createUserProfile = () => {
        globalPageLoadSetter(true);
        let data = axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/auth-service/user-profile/create`,
            {
                accUi: ui,
                accName: name,
                accPost: post,
                teamId: team,
                accEmail: email,
                accStatus: status,
                userRoleList: userRoleList,

            }).then((response: any) => {
                if (response?.status === 200) {

                    setAlertStatus("success");
                    setServerErrorMsg("Create User Profile successfully");
                    setShowMessage(true);
                    setTimeout(() => {
                        returnToUserProfilePage();
                    }, 1000);
                }
            }).catch((error) => {
                console.log("error: " + error);
                if (error?.response?.status === 530) {
                    const messageResult = error.response.data.result;
                    console.log("messageResult: " + messageResult);

                    const rightError = !!messageResult.rightLimit ? messageResult.rightLimit : "";
                    if (rightError) {
                        setServerErrorMsg(rightError);
                    } else {
                        setErrorMessage({
                            ...errorMessage,
                            "ui": (!!messageResult.ui ? concatErrorMsgWithErrorFormHelperText(messageResult.ui) : ""),
                            "name": (!!messageResult.name ? concatErrorMsgWithErrorFormHelperText(messageResult.name) : ""),
                            "post": (!!messageResult.post ? concatErrorMsgWithErrorFormHelperText(messageResult.post) : ""),
                            "team": (!!messageResult.team ? concatErrorMsgWithErrorFormHelperText(messageResult.team) : ""),
                            "email": (!!messageResult.email ? concatErrorMsgWithErrorFormHelperText(messageResult.email) : ""),
                            "status": (!!messageResult.status ? concatErrorMsgWithErrorFormHelperText(messageResult.status) : ""),
                            "userRole": (!!messageResult.userRole ? concatErrorMsgWithErrorFormHelperText(messageResult.userRole) : "")
                        });
                        setServerErrorMsg(error.response.data.message);
                    }


                    //   setDisabledEdition(false);
                    setAlertStatus("error");

                    setShowMessage(true);
                    console.log(serverErrorMsg);
                } else {
                    setAlertStatus("error");
                    if (!error.response.data) {
                        setServerErrorMsg("System Error");
                    } else {
                        setServerErrorMsg(error.response.data.message);
                    }

                    setShowMessage(true);
                    console.log(serverErrorMsg);
                }
            });
        // setShowLoader(false);
    }

    const updateUserProfile = (id) => {
        globalPageLoadSetter(true);
        let data = axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/auth-service/user-profile/${id}/update`,
            {
                accUi: ui,
                accName: name,
                accPost: post,
                teamId: team,
                accEmail: email,
                accStatus: status,
                userRoleList: userRoleList,
                updateTime: updateTime,
                accId: accId

            }).then((response: any) => {
                if (response?.status === 200) {

                    setAlertStatus("success");
                    setServerErrorMsg("Update User Profile successfully");
                    setShowMessage(true);
                    setReloadPage(true)
                }
            }).catch((error) => {
                console.log("error: " + error);
                if (error?.response?.status === 530) {
                    const messageResult = error.response.data.result;
                    console.log("messageResult: " + messageResult);

                    setErrorMessage({
                        ...errorMessage,
                        "ui": (!!messageResult.ui ? concatErrorMsgWithErrorFormHelperText(messageResult.ui) : ""),
                        "name": (!!messageResult.name ? concatErrorMsgWithErrorFormHelperText(messageResult.name) : ""),
                        "post": (!!messageResult.post ? concatErrorMsgWithErrorFormHelperText(messageResult.post) : ""),
                        "team": (!!messageResult.team ? concatErrorMsgWithErrorFormHelperText(messageResult.team) : ""),
                        "email": (!!messageResult.email ? concatErrorMsgWithErrorFormHelperText(messageResult.email) : ""),
                        "status": (!!messageResult.status ? concatErrorMsgWithErrorFormHelperText(messageResult.status) : ""),
                        "userRole": (!!messageResult.userRole ? concatErrorMsgWithErrorFormHelperText(messageResult.userRole) : "")
                    });

                    //   setDisabledEdition(false);
                    setAlertStatus("error");
                    setServerErrorMsg(error.response.data.message);
                    setShowMessage(true);
                    console.log(serverErrorMsg);
                } else {
                    setAlertStatus("error");
                    if (!error.response.data) {
                        setServerErrorMsg("System Error");
                    } else {
                        setServerErrorMsg(error.response.data.message);
                    }

                    setShowMessage(true);
                    console.log(serverErrorMsg);
                }
            });
        // setShowLoader(false);
    }

    const viewUserProfile = (id) => {
        globalPageLoadSetter(true);
        let data = axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/auth-service/user-profile/${id}`,
            {

            }).then((response: any) => {
                if (response?.status === 200) {
                    setUserProfile(response.data.result);
                    setCount(response.data.result.userRoleSize)
                }
            }).catch((error) => {
                console.log("error: " + error);
                if (error?.response?.status === 530) {
                    setAlertStatus("error");
                    setServerErrorMsg(error.response.data.message);
                    setShowMessage(true);
                    console.log(serverErrorMsg);
                } else {
                    setAlertStatus("error");
                    if (!error.response.data) {
                        setServerErrorMsg("System Error");
                    } else {
                        setServerErrorMsg(error.response.data.message);
                    }

                    setShowMessage(true);
                    console.log(serverErrorMsg);
                }
            });
        // setShowLoader(false);
    }

    const setUserProfile = (userProfile) => {
        setUi(userProfile.accUi);
        setName(userProfile.accName);
        setPost(userProfile.accPost);
        setTeam(userProfile.teamId);
        setEmail(userProfile.accEmail);
        setStatus(userProfile.accStatus);
        setUserRoleList(sortBy(userProfile.userRoleList, function (o) { return o.usrRolId }));
        setUpdateTime(userProfile.updateTime);
        setAccId(userProfile.accId)
    }

    const hideSnackbarSucess = () => {
        setshowSnackbarSuccessPopup(false);
        setsnackbarSuccessMsg('');
    }
    const hideSnackbarFailed = () => {
        setshowSnackbarFailedPopup(false);
        setsnackbarFailedMsg('');
    }


    const deleteRecord = (key) => {
        console.log("deleteRecord: " + key);
        const newUserRoleList = userRoleList.filter((userRole) => (userRole.usrRolId + userRole.usrDcId + userRoleList.indexOf(userRole)) !== key);
        setUserRoleList(newUserRoleList);
        setCount(newUserRoleList.length);
    }

    const clickBackButton = () => {
        console.log("back button click");
        returnToUserProfilePage();
    }

    const returnToUserProfilePage = () => {
        console.log("return To User Profile Page");
        navigateWithLocale("user-profile")();
        // navigate(`/${i18n.language}/user-profile`);
    }

    const resetErrorMessage = () => {
        setErrorMessage(null);
    }


    const resetPopupValues = () => {
        setRoleSelected("");
        setDocumentClassSelected("");
        setUserRoleSelectedError("");
        setDocumentClassSelectedError("");
    }

    const clickAddRoleButton = () => {
        resetPopupValues();
        setAddUserRolePopUp(true);
    }

    const clickAddUserRolePopupConfirmButtonValidation = () => {
        console.log("run clickAddUserRolePopupConfirmButtonValidation");
        if (!roleSelected) {
            setUserRoleSelectedError("role is mandatory");
        }

        const isAdmin = "ADMIN" === roleSelected;

        if (!isAdmin && !documentClassSelected) {
            setDocumentClassSelectedError("document class is mandatory, if role is not Administrator");
        }
        return roleSelected && (isAdmin || documentClassSelected);
    }

    const clickAddUserRolePopupConfirmButton = () => {
        let UserRole: UserRoleDisplay = {
            usrRolId: roleSelected,
            usrDcId: documentClassSelected
        }
        userRoleList.push(UserRole);
        setAddUserRolePopUp(false);
        setCount(userRoleList.length);
    }


    const AddUserRolePopup = () => {
        return (
            <Modal
                open={addUserRolePopUp}
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
                                                '& .MuiInputLabel-root': { ml: "1rem" },
                                                '& .MuiInputBase-root': { ml: "1rem", mt: "0" }
                                            }}
                                            noValidate
                                            autoComplete="off"
                                            onSubmit={() => { }}
                                        >
                                            <Accordion expanded={true} className="expand_disabled">
                                                <AccordionSummary
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    <Typography variant="h3">{t('roleAssignment')}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container display={"grid"} gridTemplateColumns={"repeat(auto-fill, 80px 250px)"} alignItems={"baseline"}>
                                                        <Grid item>
                                                            <Typography variant="h5" >{t('role')}: </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                                                                <Select
                                                                    labelId="demo-simple-select-standard-label"
                                                                    id="user-role-selector"
                                                                    value={roleSelected}
                                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRoleSelected(e.target.value)}
                                                                    error={!!userRoleSelectedError}
                                                                >
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
                                                                {
                                                                    !!userRoleSelectedError ?
                                                                        <FormHelperText error style={{ paddingLeft: "10px" }}>{userRoleSelectedError}</FormHelperText>
                                                                        : null
                                                                }
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="h5" >{t('documentClass')}: </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                                                                <Select
                                                                    labelId="demo-simple-select-standard-label"
                                                                    id="document-classes-selector"
                                                                    value={documentClassSelected}
                                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDocumentClassSelected(e.target.value)}
                                                                    error={!!documentClassSelectedError}
                                                                    disabled={"ADMIN" === roleSelected}
                                                                >
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
                                                                {
                                                                    !!documentClassSelectedError ?
                                                                        <FormHelperText error style={{ paddingLeft: "10px" }}>{documentClassSelectedError}</FormHelperText>
                                                                        : null
                                                                }
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container>
                                                        <Grid item container justifyContent="end">
                                                            <Grid item>
                                                                <Button type="button"
                                                                    sx={{ marginLeft: '10px' }}
                                                                    variant="outlined"
                                                                    startIcon={<DoDisturb fontSize="small" />}
                                                                    onClick={() => {
                                                                        setAddUserRolePopUp(false);
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
                                                                        if (clickAddUserRolePopupConfirmButtonValidation()) {
                                                                            clickAddUserRolePopupConfirmButton();
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

    return (
        <Card>
            <Helmet>
                <title>{ENV_NAME}CATSLAS - {addOrEdit} User Profile</title>
            </Helmet>

            <PageTitleWrapper>

                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="h3" component="h3" gutterBottom marginRight="10px">
                            {title}
                        </Typography>
                    </Grid>
                    <Grid container item xs={8} justifyContent={"flex-end"}>
                        <Grid item>
                            <Button
                                variant="outlined"
                                onClick={clickBackButton}
                            >
                                {t('back')}
                            </Button>
                            <Button
                                sx={{ marginLeft: '10px' }}
                                variant="contained"
                                startIcon={<Check fontSize="small" />}
                                type="submit"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                    comfirmButtonClick();
                                }}
                                form="hook-form"
                            >
                                {t('confirm')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

            </PageTitleWrapper>

            <Container maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item xs={12}>

                        <Card id="edit-user-profile">
                            <Container maxWidth="lg" disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container'>
                                <Grid container display={"grid"} gridTemplateColumns={"repeat(auto-fill, 80px 40%)"} alignItems={"baseline"} maxWidth={"100%"} >
                                    <Grid item >
                                        <Typography variant="h5" >{t('ui')}: </Typography>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            variant="standard"
                                            value={ui}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUi(e.target.value)}
                                            error={!!errorMessage?.ui}
                                            helperText={errorMessage?.ui}
                                            disabled={isEdit}
                                            style={{ width: "85%" }}
                                        />
                                    </Grid>


                                    <Grid item >
                                        <Typography variant="h5" >{t('name')}: </Typography>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            variant="standard"
                                            value={name}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                            error={!!errorMessage?.name}
                                            helperText={errorMessage?.name}
                                            style={{ width: "85%" }}
                                        />
                                    </Grid>


                                    <Grid item>
                                        <Typography variant="h5" >{t('post')}: </Typography>
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            variant="standard"
                                            value={post}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPost(e.target.value)}
                                            error={!!errorMessage?.post}
                                            helperText={errorMessage?.post}
                                            style={{ width: "85%" }}
                                        />
                                    </Grid>


                                    <Grid item >
                                        <Typography variant="h5" >{t('team')}: </Typography>
                                    </Grid>
                                    <Grid item >
                                        <FormControl variant="standard" style={{ minWidth: "85%" }}>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={team}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTeam(e.target.value)}
                                                error={!!errorMessage?.team}
                                            >
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
                                            {
                                                !!errorMessage?.team ?
                                                    errorMessage.team
                                                    : null
                                            }
                                        </FormControl>
                                    </Grid>

                                    <Grid item >
                                        <Typography variant="h5" >{t('email')}: </Typography>
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            variant="standard"
                                            value={email}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            error={!!errorMessage?.email}
                                            helperText={errorMessage?.email}
                                            style={{ width: "85%" }}
                                        />
                                    </Grid>


                                    <Grid item>
                                        <Typography variant="h5" >{t('status')}: </Typography>
                                    </Grid>
                                    <Grid item >
                                        <FormControl variant="standard" style={{ width: "85%" }}>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={status}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
                                                error={!!errorMessage?.status}
                                            >
                                                <MenuItem value={"A"}>Active</MenuItem>
                                                <MenuItem value={"I"}>Inactive</MenuItem>

                                            </Select>
                                            {
                                                !!errorMessage?.status ?
                                                    errorMessage.status
                                                    : null
                                            }
                                        </FormControl>
                                    </Grid>
                                </Grid>


                                <Grid container >
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                clickAddRoleButton();
                                            }}
                                            form="hook-form"
                                        >
                                            {t("addRole")}
                                        </Button>
                                    </Grid>
                                    <Grid item sx={{ marginTop: 'auto', paddingLeft: '10px' }}>
                                        {
                                            !!errorMessage?.userRole ?
                                                errorMessage?.userRole
                                                : null
                                        }
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
                                    <TableHead>
                                        <TableRow >
                                            {
                                                map(resultTableColumnsSorted, function (o) {
                                                    return (
                                                        <TableCell key={o.key}>
                                                            {o.name}
                                                        </TableCell>
                                                    )
                                                })
                                            }
                                            {
                                                <TableCell>
                                                    {t('action')}
                                                </TableCell>
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            map(userRoleList, (d, idx) => (
                                                <TableRow
                                                    hover
                                                    key={d.usrRolId + d.usrDcId + idx}
                                                >
                                                    {map(resultTableColumnsSorted, function (o) {
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
                                                    <TableCell align="left" sx={{ width: "100px" }}>
                                                        <Box sx={{ display: 'grid', gridTemplateColumns: '30px 30px', marginRight: 6, alignItems: "center" }}>
                                                            {
                                                                <Tooltip title="Delete" arrow>
                                                                    <IconButton
                                                                        sx={{
                                                                            '&:hover': { background: theme.colors.error.lighter },
                                                                            color: theme.palette.error.main
                                                                        }}
                                                                        color="inherit"
                                                                        size="small"
                                                                        onClick={() => deleteRecord(d.usrRolId + d.usrDcId + idx)}
                                                                    >
                                                                        <DeleteTwoToneIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }
                                                        </Box>
                                                    </TableCell>

                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>


                        </Card>
                    </Grid>
                </Grid>
            </Container>


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
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={showSnackbarSuccessPopup} onClose={() => hideSnackbarSucess()} autoHideDuration={6000} >
                    <Alert severity="success" sx={{ width: '100%' }}>
                        {snackbarSuccessMsg}
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            sx={{ marginLeft: "20px" }}
                            onClick={() => hideSnackbarSucess()}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    </Alert>
                </Snackbar>
                <Snackbar open={showSnackbarFailedPopup} onClose={() => hideSnackbarFailed()} autoHideDuration={6000} >
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {snackbarFailedMsg}
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            sx={{ marginLeft: "20px" }}
                            onClick={() => hideSnackbarFailed()}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    </Alert>
                </Snackbar>
            </Stack>
            <AddUserRolePopup />
        </Card>
    );
}

export default UserProfileEdit;
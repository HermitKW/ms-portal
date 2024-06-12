import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Checkbox, Container, FormControl, FormControlLabel, Grid, Input, IconButton, InputLabel, MenuItem, Modal, Select, TableCell, TableRow, TextField, Typography, FormHelperText } from "@mui/material";
import axios, { AxiosError } from "axios";
import React, { useEffect, ChangeEvent, useState,MouseEvent, useContext, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, FieldErrorsImpl, Resolver, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import i18n from "src/i18n";
import { User } from "src/models/User";
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { Check, DoDisturb, Save, Close } from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import { ENV_NAME, USER_CONFIG_SERVICE_URL } from "src/constants";
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SetPageLoaderContext } from "src/components/GlobalPageLoader/GlobalPageLoaderContext";
import customAxios from "src/utilities/CustomAxios";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type UserEditParams = {
    id: string
};

interface IFormValue {
    name: string,
    userName: string,
    newPassword: string,
    newPasswordReType: string,
    uniqueId: string,
    staffName: string,
    staffEmail: string,
    staffPhoneNumber: string,
    role: string,
    age: number,
    userGroup: number | string,
    corpId: number | string
}

const defaultValues: IFormValue = {
    name: "",
    userName: "",
    newPassword: "",
    newPasswordReType: "",
    uniqueId: "",
    staffName: "",
    staffEmail: "",
    staffPhoneNumber: "",
    role: "CORP_USER",
    age: 10,
    userGroup: '',
    corpId: ''
};

const resolver: Resolver<IFormValue> = async (values) => {


    let errors: FieldErrorsImpl<IFormValue> = {};

    if(!values.userName){
        errors.userName = {
            type: 'required',
            message: "Username is required"
        };
    }

    if(!values.staffName){
        errors.staffName = {
            type: 'required',
            message: "Staff Name is required"
        };
    }

    if(!values.staffEmail){
        errors.staffEmail = {
            type: 'required',
            message: "Staff Email is required"
        };
    }

    if(!values.staffPhoneNumber){
        errors.staffPhoneNumber = {
            type: 'required',
            message: "Staff Phone Number is required"
        };
    }

    if(!values.role){
        errors.role = {
            type: 'required',
            message: "Role is required"
        };
    }

    if(!values.newPassword){
        errors.newPassword = {
            type: 'required',
            message: "Password is required"
        };
    }

    if(!values.newPasswordReType){
        errors.newPasswordReType = {
            type: 'required',
            message: "Re-Type Password is required"
        };
    }

    if(!values.corpId){
        errors.corpId = {
            type: 'required',
            message: "Corporate is required"
        };
    }

    if(!values.userGroup){
        errors.userGroup = {
            type: 'required',
            message: "User Group is required"
        };
    }

    return {
      values: !errors ? values : {},
      errors: errors
        ? errors
        : {},
    };
};

function UserEdit(){
    const navigate = useNavigate();
    
    const { handleSubmit, reset, control, register, formState: { errors }, setValue, getValues} = useForm<IFormValue>({ 
        defaultValues: defaultValues,
        resolver: resolver
       });

    const onSubmit = (data) => {
        submitPassword(false);
     };

    const { t } = useTranslation();

    const [user, setUser] = useState<User>({} as User);
    const [openPasswordPopUp, setOpenPasswordPopUp] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<String>("");
    const [newPasswordReType, setNewPasswordReType] = useState<String>("");
    const [passwordPattern, setPasswordPattern] = useState<String>("");
    const params = useParams<UserEditParams>();

    const [username, setUsername] = useState<string|null>(null);
    const [staffName, setStaffName] = useState<string|null>(null);
    const [staffEmail, setStaffEmail] = useState<string|null>(null);
    const [staffPhoneNumber, setStaffPhoneNumber] = useState<string|null>(null);

    const [alertStatus, setAlertStatus] = useState<any>("");
    const [serverErrorMsg, setServerErrorMsg] = useState("");
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const [corporateList, setCorporateList] = useState<any[]>([]);

    const [activeUserCount, setActiveUserCount] = useState<number>();
    const [activeManagerCount, setActiveManagerCount] = useState<number>();
    const [maxUserCount, setMaxUserCount] = useState<number>();
    const [maxManagerCount, setMaxManagerCount] = useState<number>();
    const [toggleEnable, setToggleEnable] = useState<boolean>(false);
    const [showSnackbarSuccessPopup, setshowSnackbarSuccessPopup] = useState<boolean>(false);
    const [snackbarSuccessMsg, setsnackbarSuccessMsg] = useState<String>('');
    const [showSnackbarFailedPopup, setshowSnackbarFailedPopup] = useState<boolean>(false);
    const [snackbarFailedMsg, setsnackbarFailedMsg] = useState<String>('');
    //const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>(null);

    //const [checked, setChecked] = useState<boolean>(false);

    const [title, setTitle] = useState<string>("");

    const [config, setConfig] = useState("");
      const globalPageLoadSetter = useContext(SetPageLoaderContext);

    /*
    const alertMessage = {
        "success": (params.id !== '0')?"Update successful":"Create successful",
        "error": (params.id !== '0')?"Update failed":"Create failed"
    }
    */

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        //setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
    }

    //console.log(params.id);

    interface UserGroup {
        corporateUserInd: string
        description: string
        id: number
        type: string
    }

    interface ErrorMessage {
        email: string
        password: string
        passwordReType: string
        phoneNumber: string
        username: string
    }

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

    
    const loadUserAccountCount = useCallback((corpId, corpList) => {
        globalPageLoadSetter(true);

        axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/user-managements/user-counts`, 
            {corpId: corpId}, {withCredentials: true})
            .then(function(res){
                console.log(res);
                
                setActiveUserCount(res.data.result.activeUserCount);
                setActiveManagerCount(res.data.result.activeManagerCount);

                console.log("yyyyyyyyyyyyyyyy")
                console.log(corpList)
                let selectedCorporate = corpList.find((corp) => {
                    return corp.code === corpId;
                })

                setMaxManagerCount(selectedCorporate.managerAccountAllow);
                setMaxUserCount(selectedCorporate.userAccountAllow);
                globalPageLoadSetter(false);
            })
    }, [])

    const loadUserAccountCountOnChange = (event) => {
        if(!event.target.value){
            return;
        }

        loadUserAccountCount(event.target.value, corporateList);   
    }

    const handleCloseError = () => {
        setServerErrorMsg("");
        setShowMessage(false);
    }

    const [userGroup, setUserGroup] = useState([]);

    function submitPassword(isPasswordOnly) {
        if ( newPassword.trim() == "" || newPasswordReType.trim() == "") {
            setErrorMessage({...errorMessage, "password":"Please input password",
                                              "passwordReType":"Please input re-type password"});
        } else if (newPassword.trim() != newPasswordReType.trim()) {
            setErrorMessage({...errorMessage, "password":"Password and re-type password are not same",
                                              "passwordReType":"Password and re-type password are not same"});
        } else {
            submitForm(isPasswordOnly);
        }
    }

    function submitForm(isPasswordOnly) {
        if (staffEmail != "" && 
            staffName != "" &&
            staffPhoneNumber != "" &&
            username != "" && 
            (!isPasswordOnly || newPassword != "" && newPasswordReType != "")) {
                
            console.log("password submit");
          
            let action = "";

            if(params.id !== '0'){
                action = "/update";
            } else {
                action = "/create";
            }

            var userOrManager = userGroup.find((ug) => {
                return ug.id === getValues().userGroup;
                
            }).corporateUserInd? "User": "Manager";

            let data = axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/user-managements` + action, 
            {
                id:user.id,
                staffName:(isPasswordOnly?user.staffName:staffName),
                userName:(isPasswordOnly?user.username:username),
                email:(isPasswordOnly?user.staffEmail:staffEmail),
                phoneNumber:(isPasswordOnly?user.staffPhoneNo:staffPhoneNumber),
                password:(params.id != "0" && !isPasswordOnly?null:newPassword),
                corpId: getValues().corpId,
                type:userOrManager,
                userGroupIdList: [getValues().userGroup]
            }).then((response: any) => {
                if (response?.data?.code === 200) {
                    setErrorMessage({...errorMessage, "password":"",
                                                      "passwordReType":""});
                    
                    setAlertStatus("success");

                    if (isPasswordOnly) {
                        setOpenPasswordPopUp(false);
                        setServerErrorMsg("Update password successfully");
                        setShowMessage(true);
                    } else {
                        setServerErrorMsg("Update profile successfully");
                        setShowMessage(true);
                        setTimeout(() => {
                            navigate('/user-management'); 
                        }, 1000);
                    }
                }
            }).catch((error) => {
                console.log("error: " + error);
                if (error?.response?.status === 530) { 
                    const messageResult = error.response.data.result;

                    setErrorMessage({...errorMessage, "email":(!!messageResult.email?messageResult.email[0]:""),
                                                      "password":(!!messageResult.password?messageResult.password[0]:""),
                                                      "passwordReType":(!!messageResult.password?messageResult.password[0]:""),
                                                      "phoneNumber":(!!messageResult.phoneNumber?messageResult.phoneNumber[0]:""),
                                                      "username":(!!messageResult.username?messageResult.username[0]:"")});

                    if (!!messageResult.quota) {
                        setAlertStatus("error");
                        setServerErrorMsg(messageResult.quota[0]);
                        setShowMessage(true);
                    } else if (!!messageResult.userGroupId) {
                        setAlertStatus("error");
                        setServerErrorMsg(messageResult.userGroupId[0]);
                        setShowMessage(true);
                    }
                }
            });
        }
    }

    const toggleUserEnable = (isEnabled, user)=>{
        
        globalPageLoadSetter(true);
        axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/user-managements/${user.id}/disabled`, {disabled: isEnabled ? 0 : 1}, {withCredentials: true})
        .then(function(requestRes){
          console.log(requestRes)
          setToggleEnable(isEnabled);
          setshowSnackbarSuccessPopup(true);
          setsnackbarSuccessMsg(requestRes.data.message)
        })
        .catch((err)=>{
            console.log(err)
            if(err?.response?.status === 530){
                setshowSnackbarFailedPopup(true);
                setsnackbarFailedMsg(err?.response?.data?.message)
            }
         
        })
    }

    const hideSnackbarSucess = () =>{
        setshowSnackbarSuccessPopup(false);
        setsnackbarSuccessMsg('');
      }
      const hideSnackbarFailed = () =>{
        setshowSnackbarFailedPopup(false);
        setsnackbarFailedMsg('');
      }
    

    useEffect(() => {
        globalPageLoadSetter(true);
        customAxios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/user-managements/config`, 
        {
        configKey:"VALIDATE_PASSWORD",
        configType:"USER_MANAGEMENT_VALIDATE"
        }).then((response: any) => {
        console.log(response?.data?.result?.remark2);
        setConfig(response?.data?.result?.remark2);
        }).catch((error) => {
        console.log("error: " + error);
        });
        
        const fetchUser = (id: string) => {
            return customAxios.get(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/user-managements/${id}`)
                .then((response) => {
                    //console.log(response.data.result);
                    let user : User = {
                        id: response.data.result.id,
                        username: response.data.result.userName,
                        password: "",
                        staffName: response.data.result.staffName,
                        staffEmail: response.data.result.email,
                        staffPhoneNo: response.data.result.phoneNumber,
                        corpId: response.data.result.corpId
                    }
                    setUser(user);
                    reset({...user,
                        name: "",
                        userName: user.username,
                        newPassword: "",
                        newPasswordReType: "",
                        uniqueId: "",
                        staffName: user.staffName,
                        staffEmail: user.staffEmail,
                        staffPhoneNumber: user.staffPhoneNo,
                        role: "",
                        age: 10,
                        corpId: user.corpId
                    })                

                    let userGroup = response.data.result.userGroupList[0];
                    reset({
                        ...getValues(),
                        userGroup: userGroup?.id
                    })
                    setStaffName(user.staffName);
                    setUsername(user.username);
                    setStaffEmail(user.staffEmail);
                    setStaffPhoneNumber(user.staffPhoneNo);
                    setToggleEnable(response.data.result.disabled ? false : true);
                    //setValue('password', user.password);
                    return user;
                }).catch((error) => {
                    console.log("error: " + JSON.stringify(error.response.data));
                    return null;
                });
        }
        
       

        const fetchUserGroup = async () => {
            await customAxios.get(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/user-managements/user-group`)
            .then((response) => {
                setUserGroup(response.data.result);
            }).catch((error) => {
                console.log("error: " + JSON.stringify(error.response.data));
            });
        }

        const fetchCorporateList = () => {
            return customAxios.get(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/master-data/corporates`)
                .then((response) => {
                    setCorporateList(response.data.result);                
             
                    return response.data.result;
                }).catch((error) => {
                    console.log("error: " + JSON.stringify(error.response.data));
               
                    return null;
                });
        }

        if(params.id !== '0'){
          
            axios.all([fetchUser(params.id), fetchCorporateList(), fetchUserGroup()])
                .then(function([user, corpList ]){
                    loadUserAccountCount(user.corpId, corpList);                    
                })
            setTitle("Staff Management - Edit")
        } else {
            axios.all([fetchCorporateList(), fetchUserGroup()])
            .then(function([user, corpList ]){
                globalPageLoadSetter(false);                  
            })
            //  fetchUserGroup();
            //  fetchCorporateList();
            setTitle("Staff Management - Create")
   
        }
    }, [params.id, setValue])

    return (
        <>
            
            <Helmet>
                <title>{ENV_NAME}CATSLAS - Staff Management - Edit</title>
            </Helmet>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="h3" component="h3" gutterBottom marginRight="10px">
                        {title}
                        </Typography>
                    </Grid>
                    <Grid container item xs={8} justifyContent={"flex-end"}>        
                        {
                            getValues().corpId ?
                            <Grid item sx={{marginRight: "10px"}}>
                                <Typography>
                                    Number Of Active Manager Account: {activeManagerCount} / {maxManagerCount}<br/>
                                    Number Of Active User Account: {activeUserCount} / {maxUserCount}
                                </Typography>
                                
                            </Grid>   
                            : null
                        }
                        <Grid item>
                            <Button
                            variant="outlined"
                            startIcon={<ChevronLeft fontSize="small" />}
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                // navigate()
                                navigate('/user-management', {state: {loadSearchCriteriaContext: true}})
                            }}
                            >
                            Back
                            </Button>
                            <Button
                            sx={{marginLeft: '10px'}}
                            variant="contained"
                            startIcon={<Check fontSize="small" />}
                            type="submit"
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                if(params.id != '0'){
                                    submitForm(false);
                                }
                            }}
                            form="hook-form"
                            >
                            Confirm
                            </Button>
                        </Grid>
                    </Grid>
                    </Grid>
                    {
                        params.id !== '0' ? 
                        <Grid container justifyContent="flex-end" alignItems="center">
                        <Grid sx={{display: 'flex', alignItems: "center"}}>
                            <Typography>Disable</Typography> 
                               <Switch onChange={
                                    (event) => {                            
                                        toggleUserEnable(event.target.checked, user);
                                    }
                              } checked={toggleEnable}></Switch> 
                             <Typography style={{marginRight:"10px"}}>Enable</Typography> 
                        </Grid>
                    </Grid>
                    :
                    null
                    }
                  
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
                    <Card>              
                        <CardContent>
                        <Box
                            id="hook-form"
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: "1rem", width: '90%' },
                                '& .MuiFormControl-fullWidth': { m: "1rem", width: '95%' },
                                '& .MuiSelect-select': {whiteSpace: 'normal'},
                                '& .MuiInputLabel-root': { m: "1rem"}
                            }}
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit(onSubmit)}
                            >
                                 <Accordion expanded={true} className="expand_disabled">
                                    <AccordionDetails>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={6} alignItems="center">
                                            <Grid item xs={12} sx={{paddingTop: 0}}>
                                                <InputLabel htmlFor="username" sx={{display: 'inline'}}>
                                                    Corporate
                                                </InputLabel>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    control={control}
                                                    name={`corpId`}
                                                    render={({ field: { onChange, value } }) => (
                                                        <FormControl sx={{
                                                        paddingTop: 0,
                                                        minWidth: '200px', 
                                                        marginLeft: '15px'}}>
                                                            <>
                                                                <Select onChange={(event) => {loadUserAccountCountOnChange(event); onChange(event)}} error={!!errors.corpId} value={value}>
                                                                    <MenuItem key='' value=''/>
                                                                    {
                                                                        corporateList.map((corporate) => {
                                                                            return (
                                                                                <MenuItem key={corporate.code} value={corporate.code}>
                                                                                    {corporate.description}
                                                                                </MenuItem>            
                                                                            );
                                                                        })
                                                                    }
                                                                </Select>
                                                                {errors.corpId? <FormHelperText error>{errors.corpId.message}</FormHelperText>: null}
                                                            </>
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={6} alignItems="center">
                                        <InputLabel htmlFor="username" sx={{display: 'inline'}}>
                                            Username
                                        </InputLabel>
                                        {(params.id == "0") ?  
                                        <TextField 
                                            id="username"
                                            {...register("userName")}
                                            variant="standard"
                                            error={!!errors?.userName || !!errorMessage?.username}
                                            helperText={errors?.userName?.message || errorMessage?.username}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                        /> : 
                                        <InputLabel>
                                            {username}
                                        </InputLabel>
                                        }
                                        </Grid>

                                        <Grid item xs={12} sm={6} alignItems="center">
                                        <InputLabel htmlFor="staffName" sx={{display: 'inline'}}>
                                            Staff Name
                                        </InputLabel>
                                        <TextField 
                                            id="staffName"
                                            {...register("staffName")} 
                                            variant="standard"
                                            error={!!errors?.staffName}
                                            helperText={errors?.staffName?.message}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setStaffName(e.target.value)}

                                        />
                                        </Grid>      

                                        <Grid item xs={12} sm={6} alignItems="center">
                                        <InputLabel htmlFor="staffEmail" sx={{display: 'inline'}}>
                                            Staff Email
                                        </InputLabel>
                                        <TextField 
                                            id="staffEmail"
                                            {...register("staffEmail")} 
                                            variant="standard"
                                            error={!!errors?.staffEmail || !!errorMessage?.email}
                                            helperText={errors?.staffEmail?.message || errorMessage?.email}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setStaffEmail(e.target.value)}
                                        
                                        />
                                        </Grid>      

                                        <Grid item xs={12} sm={6} alignItems="center">
                                        <InputLabel htmlFor="staffPhoneNumber" sx={{display: 'inline'}}>
                                            Staff Phone Number
                                        </InputLabel>
                                        <TextField 
                                            id="staffPhoneNumber"
                                            {...register("staffPhoneNumber")} 
                                            variant="standard"
                                            error={!!errors?.staffPhoneNumber || !!errorMessage?.phoneNumber}
                                            helperText={errors?.staffPhoneNumber?.message || errorMessage?.phoneNumber}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setStaffPhoneNumber(e.target.value)}
                                        
                                        />
                                        </Grid>      
                                        <Grid item xs={12} sm={6} alignItems="center">
                                            <Grid item xs={12} sx={{paddingTop: 0}}>
                                                <InputLabel htmlFor="userGroup" sx={{display: 'inline'}}>
                                                    User Group
                                                </InputLabel>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    control={control}
                                                    name={`userGroup`}
                                                    render={({ field: { onChange, value } }) => (
                                                        <FormControl sx={{
                                                        paddingTop: 0,
                                                        minWidth: '200px', 
                                                        marginLeft: '15px'}}>
                                                            <>
                                                                <Select onChange={onChange} error={!!errors.userGroup} value={value}>
                                                                    <MenuItem key='' value=''/>
                                                                    {
                                                                        userGroup.map((ug) => {
                                                                            return (
                                                                                <MenuItem key={ug.id} value={ug.id}>
                                                                                    {ug.description}
                                                                                </MenuItem>            
                                                                            );
                                                                        })
                                                                    }
                                                                </Select>
                                                                {errors.userGroup? <FormHelperText error>{errors.userGroup.message}</FormHelperText>: null}
                                                            </>
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    { params.id != '0'?  
                                            <Grid container item xs={12} sm={6} alignItems="center">
                                                <Grid item xs={12}> 
                                                    <Button 
                                                    type="button" 
                                                    sx={{marginLeft: '10px'}}
                                                    variant="outlined"
                                                    startIcon={<Check fontSize="small" />}
                                                    onClick={() => {
                                                        setNewPassword("");
                                                        setNewPasswordReType("");
                                                        setOpenPasswordPopUp(true);
                                                        }}>
                                                    Change Password
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        
                                     : null 
                                    }
                                    </Grid>

                                    
                                    { params.id == '0'? 
                                        <Grid container>
                                            <Grid container item xs={12} sm={6} alignItems="center">
                                                <InputLabel htmlFor="newCaseAmountInvolved" sx={{ display: 'inline' }}>
                                                    New Password
                                                </InputLabel>
                                                <Grid container item xs={12}>
                                                    <Grid item>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            type="password"
                                                            id="newPassword"
                                                            {...register("newPassword")}
                                                            variant="standard"
                                                            error={!!errors?.newPassword || !!errorMessage?.password}
                                                            helperText={errors?.newPassword?.message || errorMessage?.password}
                                                            onChange={(e: ChangeEvent<HTMLInputElement>) => { setNewPassword(e.target.value); } }>

                                                        </TextField>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid container item xs={12} sm={6} alignItems="center">
                                                <InputLabel htmlFor="newCasePeriod" sx={{ display: 'inline' }}>
                                                    Re-Type Password :
                                                </InputLabel>
                                                <Grid container item xs={12}>
                                                    <TextField
                                                        type="password"
                                                        id="newPasswordReType"
                                                        {...register("newPasswordReType")}
                                                        variant="standard"
                                                        error={!!errors?.newPasswordReType || !!errorMessage?.passwordReType}
                                                        helperText={errors?.newPasswordReType?.message || errorMessage?.passwordReType}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => { setNewPasswordReType(e.target.value); } }>

                                                    </TextField>
                                                </Grid>
                                            </Grid>
                                            <Grid container item xs={12} sm={12} alignItems="center">
                                                <Grid item xs={12}>
                                                {
                                                    config != ""? 
                                                    <Grid item xs={5} sx={{display: "flex", alignItems:"center"}}>
                                                    <Typography dangerouslySetInnerHTML={{__html: config}} variant="h5" component="h5" gutterBottom marginRight="10px">
                                                    
                                                    </Typography>
                                                    </Grid>: null
                                                }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        : null
                                    }
                                    </AccordionDetails>
                                </Accordion>

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                </Grid>
            </Container>
            <Modal
                open={openPasswordPopUp}
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
                                <Typography variant="h3">Change Password</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid item container>
                                        <Grid container item xs={12} sm={6} alignItems="center">
                                            <Grid item xs={12}>
                                                <InputLabel htmlFor="newCaseAmountInvolved" sx={{display: 'inline'}}>
                                                    New Password
                                                </InputLabel>
                                            </Grid>
                                            <Grid container item xs={12}>
                                                <Grid item>
                                                </Grid>
                                                <Grid item xs={12}>
                                                <TextField
                                                    type="password"
                                                    id="newPassword"
                                                    error={!!errors?.newPassword || !!errorMessage?.password}
                                                    helperText={errors?.newPassword?.message || errorMessage?.password}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setNewPassword(e.target.value); } }>

                                                </TextField>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid container item xs={12} sm={6} alignItems="center">
                                            <Grid item xs={12}>
                                                <InputLabel htmlFor="newCasePeriod" sx={{display: 'inline'}}>
                                                Re-Type Password :
                                                </InputLabel>
                                            </Grid>
                                            <Grid container item xs={12}>
                                                <TextField
                                                    type="password"
                                                    id="newPasswordReType"
                                                    error={!!errors?.newPasswordReType || !!errorMessage?.passwordReType}
                                                    helperText={errors?.newPasswordReType?.message || errorMessage?.passwordReType}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setNewPasswordReType(e.target.value); } }>

                                                </TextField>
                                            </Grid>
                                        </Grid>

                                        {/*
                                        <Grid item container>
                                            <InputLabel htmlFor="newCasePeriod" sx={{display: 'inline'}}>
                                                Password should contain:<br />
                                                At least 1 alphabet<br />
                                                At least 1 digit<br />
                                                At least 1 special character
                                            </InputLabel>
                                        </Grid>
                                        */}
                                        {
                                            config != ""? 
                                            <Grid item xs={5} sx={{display: "flex", alignItems:"center"}}>
                                            <Typography dangerouslySetInnerHTML={{__html: config}} variant="h5" component="h5" gutterBottom marginRight="10px">
                                            
                                            </Typography>
                                            </Grid>: null
                                        }
                                        
                                        <Grid item container justifyContent="end">
                                            <Grid item> 
                                                <Button 
                                                type="button" 
                                                sx={{marginLeft: '10px'}}
                                                variant="outlined"
                                                startIcon={<DoDisturb fontSize="small" />}
                                                onClick={() => {
                                                    setNewPassword("");
                                                    setNewPasswordReType("");
                                                    setErrorMessage({...errorMessage, "password":"",
                                                                                      "passwordReType":""});
                                                    setOpenPasswordPopUp(false);
                                                    }}>
                                                Cancel
                                                </Button>
                                            </Grid>
                                            <Grid item> 
                                                <Button type="button"
                                                sx={{marginLeft: '10px'}}
                                                variant="contained"
                                                startIcon={<Check fontSize="small" />}
                                                onClick={() => {
                                                    submitPassword(true);
                                                }}
                                                >
                                                Confirm
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
            {/*
            <Snackbar open={open}>
                <Alert severity={alertStatus} sx={{ width: '100%' }} style={{whiteSpace: "pre"}} onClick={handleClose}>
                    {errorMessage == ""? alertMessage[alertStatus]: errorMessage}
                </Alert>
            </Snackbar>
            */}
            <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={showSnackbarSuccessPopup} onClose={() => hideSnackbarSucess()} autoHideDuration={6000} >
                <Alert severity="success" sx={{ width: '100%'}}>
                  {snackbarSuccessMsg}
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    sx={{marginLeft: "20px"}}
                    onClick={() => hideSnackbarSucess()}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Alert>
            </Snackbar>
            <Snackbar open={showSnackbarFailedPopup} onClose={() => hideSnackbarFailed()} autoHideDuration={6000} >
                <Alert severity="error" sx={{ width: '100%'}}>
                  {snackbarFailedMsg}
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    sx={{marginLeft: "20px"}}
                    onClick={() => hideSnackbarFailed()}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Alert>
            </Snackbar>
          </Stack>
        </>
    );
}

export default UserEdit;
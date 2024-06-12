import { FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
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
  AccordionSummary
} from '@mui/material';
import { Check, DoDisturb, Save } from "@mui/icons-material";

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import { UserQueryResult } from 'src/models/User';
import { TableHeader } from 'src/components/Table';
import { DatePicker } from '@mui/lab';
import { Moment } from 'moment';
import { Search } from '@mui/icons-material';
import { UserSearchContext } from './UserSearchContext';
import { UserSearchCriteriaContext } from './UserSearchCriteriaContext';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, USER_CONFIG_SERVICE_URL } from "src/constants";
import axios, { AxiosResponse } from "axios";
import { useNavigate, useLocation } from 'react-router';
import PageLoader from "src/components/PageLoader";

interface UserTableProp {
  className?: string;
}

const UserResultTable: FC<UserTableProp> = ({  }) => {

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const [count, setCount] = useState<number>(0);


  const [searchFromDate, setSearchFromDate] = useState<Moment|null>(null);
  const [searchToDate, setSearchToDate] = useState<Moment|null>(null);

  const [username, setUsername] = useState<string>("");
  const [staffName, setStaffName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [showDeletePopUp, setShowDeletePopUp] = useState<boolean>(false);
  const [deleteName, setDeleteName] = useState<string|null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const changeSearchFromDate = (newValue) => {
    setSearchFromDate(newValue);
  };

  const [searchTextError, setSearchTextError] = useState<string|null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const userSearchContext = useContext(UserSearchContext);
  const userSearchCriteriaContext = useContext(UserSearchCriteriaContext);
  const [loadSearchCriteriaContext, setLoadSearchCriteriaContext] = useState<boolean>(useLocation().state?.loadSearchCriteriaContext);

  const searchIntelligenceSharingReport = () => {
    setPage(0);
    loadData(0, limit);
    //console.log(localStorage);
  };

  function submitDelete(id) {
    // setShowLoader(true);
    // let loadUserData = axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/user-managements/delete`,
    //     {
    //       id: id
    //     }).then((response) => {
    //         console.log("delete:" + JSON.stringify(response.data));
    //         if (response.data.code == "200") {
    //           setPage(0);
    //           loadData(0, limit);
    //           setShowLoader(false);
    //         }
    //     }).catch((error) => {
    //         console.log("error: " + JSON.stringify(error.response.data));
    //         setShowLoader(false);
    //     });
  }

  useEffect(() => {
    if(loadSearchCriteriaContext){
      loaUserListByClickBackButton();
      setLoadSearchCriteriaContext(false);
    }else{
      searchIntelligenceSharingReport();
    }
  }, []);

  function loadData(page, limit) {
    // setShowLoader(true);
    // let loadUserData = axios.post(`${USER_CONFIG_SERVICE_URL}/api/v1/internal/user-managements`,
    //     {
    //         "username" : username,
    //         "staffName" : staffName,
    //         "email" : email,
    //         "limit" : limit,
    //         "offset" : (page * limit)
    //     }).then((response) => {
    //         console.log("done:" + JSON.stringify(response.data));
    //         let data = response.data.result.internalUserList.map((user) => {
    //             return {
    //               id: user.id,
    //               username: user.userName,
    //               staffName: user.staffName,
    //               staffEmail: user.email,
    //               staffPhoneNo: user.phoneNumber,
    //               locked: user.locked,
    //               corpName: user.corpName,
    //               disabled: user.disabled
    //             };
    //         });
    //         userSearchContext.setUserQueryResultList(data);
    //         setCount(response.data.result.count);
    //         setShowLoader(false);
    //         saveSearchCriteriaContext(response.data.result.count, data, limit, page);
    //     }).catch((error) => {
    //         console.log("error: " + JSON.stringify(error.response.data));
    //         setShowLoader(false);
    //     });
  }

  const changeSearchToDate = (newValue) => {
    setSearchToDate(newValue);
  };

  const navigate =  useNavigate();
  const editUser = function(id: string){
    navigate(`/user-management/${id}`);
  }

  const deleteUser = function(id: string, username: string){
    setDeleteName(username);
    setDeleteId(id);
    setShowDeletePopUp(true);
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
    setUsername("");
    setStaffName("");
    setEmail("");
  }

  const theme = useTheme();

  const loaUserListByClickBackButton = useCallback(function loaUserListByClickBackButton(){
    console.log("call context search function");
    readSearchCriteriaContext(userSearchCriteriaContext.userSearchCriteria);    
  }, [])
  
  
  const saveSearchCriteriaContext = (rows : number, userListAfterSearch : UserQueryResult[], limit : number, page: number) => {
    var searchCriteria = 
        {
          username: username,
          staffName: staffName,
          staffEmail: email,
          limit: limit,
          page: page,
          count: rows,
          userList: userListAfterSearch
        }
        userSearchCriteriaContext.setUserSearchCriteria(searchCriteria);
  }
  
  const readSearchCriteriaContext = (userSearchCriteria : any) => {
    setUsername(userSearchCriteria.username);
    setStaffName(userSearchCriteria.staffName);
    setEmail(userSearchCriteria.staffEmail);
    setLimit(userSearchCriteria.limit);
    setPage(userSearchCriteria.page);
    setCount(userSearchCriteria.count);
    userSearchContext.setUserQueryResultList(userSearchCriteria.userList)
    // (userSearchCriteria.userList);
  }

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
                          <Typography variant="h3">Confirm to delete the user '{deleteName}'?</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                          <Grid container>
                          <Grid item container justifyContent="end">
                              <Grid item> 
                                  <Button 
                                  type="button" 
                                  sx={{marginLeft: '10px'}}
                                  variant="outlined"
                                  startIcon={<Check fontSize="small" />}
                                  onClick={() => {
                                      submitDelete(deleteId);
                                      setShowDeletePopUp(false);
                                  }}>
                                  Yes
                                  </Button>
                              </Grid>
                              <Grid item> 
                                  <Button type="button"
                                  sx={{marginLeft: '10px'}}
                                  variant="contained"
                                  startIcon={<DoDisturb fontSize="small" />}
                                  onClick={() => {
                                      setShowDeletePopUp(false);
                                  }}
                                  >
                                  No
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
      <PageLoader showLoader={showLoader}></PageLoader>
      { (
        <Container maxWidth="lg" disableGutters sx={{paddingLeft: "27px", paddingRight: "10px"}} >
          <Grid container alignItems="center">
            <Grid container item xs={6}>
              <Grid item xs={1} minWidth="120px">
                <InputLabel htmlFor='searchUsername' sx={{ fontSize: "16px", marginRight: "5px", whiteSpace: "normal"}}>
                  Username
                </InputLabel>
              </Grid>
              <Grid item flexGrow={3} paddingRight="50px">
                <FormControl variant="outlined" fullWidth>
                  <TextField autoComplete="off" id="searchUsername" value={username} fullWidth onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}>
                    
                  </TextField>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container item xs={6}>
              <Grid item xs={1} minWidth="120px">
                <InputLabel htmlFor='searchStaffName' sx={{fontSize: "16px", whiteSpace: "normal"}}>
                  Staff Name
                </InputLabel>
              </Grid>
              <Grid item flexGrow={3} paddingRight="50px">
                <FormControl variant="outlined" fullWidth>
                  <TextField autoComplete="off" id="searchStaffName" value={staffName} fullWidth onChange={(e: ChangeEvent<HTMLInputElement>) => setStaffName(e.target.value)}>
                    
                  </TextField>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container item xs={12} justifyContent={"space-between"}>
              <Grid container item xs={6}>
                <Grid item xs={1} minWidth="120px">
                  <InputLabel htmlFor='searchEmail' sx={{fontSize: "16px", whiteSpace: "normal"}}>
                    Staff Email
                  </InputLabel>
                </Grid>
                <Grid item flexGrow={3} paddingRight="50px">
                  <FormControl variant="outlined" fullWidth>
                    <TextField autoComplete="off" id="searchEmail" value={email} fullWidth onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}>
                      
                    </TextField>
                  </FormControl>
                </Grid>
              </Grid>         
              <Grid container item xs={4} justifyContent='flex-end' >
                <Grid item sx={{marginRight: "20px"}}>
                    <Button
                      variant="contained"
                      onClick={(e: MouseEvent<HTMLButtonElement>) => {
                          clickResetButton();
                      }}
                      size="large"
                    >
                      Clear Search
                    </Button>
                  </Grid>
                  <Grid item >
                    <Button
                      variant="contained"
                      startIcon={<Search fontSize="small" />}
                      onClick={(e: MouseEvent<HTMLButtonElement>) => {
                          searchIntelligenceSharingReport();
                      }}
                      size="large"
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
            </Grid>
          </Grid>
        </Container>
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>User Name</TableHeader>
              <TableHeader>Staff Name</TableHeader>
              <TableHeader>Staff Email</TableHeader>
              <TableHeader>Staff Phone Number</TableHeader>
              <TableHeader>Locked</TableHeader>
              <TableHeader>Disabled</TableHeader>
              <TableHeader>Bank</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {
                userSearchContext.userQueryResultList.map((user) => {
                  return (
                    <TableRow
                      hover
                      key={user.id}                  
                    >        
                      <TableCell>
                          {user.username}
                      </TableCell>
                      <TableCell>
                          {user.staffName}
                      </TableCell>
                      <TableCell>
                          {user.staffEmail}
                      </TableCell>   
                      <TableCell>
                          {user.staffPhoneNo}
                      </TableCell>   
                      <TableCell>
                          {user.locked ? 'Locked' : 'Not locked'}
                      </TableCell>
                      <TableCell>
                          {user.disabled ? 'Disabled':'Enabled'}
                      </TableCell>     
                      <TableCell>
                          {user.corpName}
                      </TableCell>        
                                                  
                      <TableCell align="right">
                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <Tooltip title="Edit User" arrow>
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.primary.lighter
                              },
                              color: theme.palette.primary.main
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => editUser(user.id)}
                          >
                            <EditTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User" arrow>
                          <IconButton
                            sx={{
                              '&:hover': { background: theme.colors.error.lighter },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => deleteUser(user.id, user.username)}
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        </Box>
                     
                      </TableCell>
                    </TableRow>
                  );
              }) 
              }
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
              count={count}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_OPTIONS}
        />
      </Box>
    <DeletePopup/>
    </Card>
  );
};

export default UserResultTable;

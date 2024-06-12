import {
    Tooltip,
    Box,
    FormControl,
    InputLabel,
    Card,
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
    Container,
    Grid,
    TextField,
    Button,
    Modal,
    CardContent,
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Theme, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import React, { useRef, FC, ChangeEvent, useEffect, useState, MouseEvent, useContext, useCallback, useImperativeHandle } from 'react';
import { CasePrimaryResponse, emptyCasePrimaryResponse } from 'src/models/CasePrimary';
import moment, { Moment } from 'moment';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS, INTELLIGENCE_SHARING_RPT_SERVICE_URL } from "src/constants";
import './index.scss';
import './CaseDetailsResultTable.scss';
import _ from 'lodash';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
PaperProps: {
    style: {
    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    width: 250,
    alignItems: 'flex-start',
    },
},
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
return {
    fontWeight:
    personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
};
}

const CaseDetails = React.forwardRef((_, ref) => {
    const { t } = useTranslation('documentClassAccessMgmnt');
    const theme = useTheme();
    const casePrimaryFormRef = useRef(null);

    const [casePrimary, setCasePrimary] = useState<CasePrimaryResponse>(emptyCasePrimaryResponse);
    const [personName, setPersonName] = useState<string[]>([]);
    const [requestNumberError, setRequestNumberError] = useState<String>("");
    const [incidentDate, setIncidentDate] = useState<Moment | null>(moment('2023-01-01', 'YYYY-MM-DD'));
    
    const names = [
        'Parallel Investigation by Other Agencie',
        'IM Related',
        'JR/Civil Suit Related',
        'Press Interest',
        'Vice Related',
        'Sensitive Location Involved',
        'Sensitive Location Involved',
        'MIP Related'
    ];

    const handleMOIChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const changeIncidentDate = (newValue) => {
        setCasePrimary({
            ...casePrimary,
            incidentDate: newValue
        })
    };

    const changeLodgeDate = (newValue) => {
        setCasePrimary({
            ...casePrimary,
            lodgeDate: newValue
        })
    };

    useEffect(() => {
        const loadCaseDetailsInfo = async () => {
        const res = await axios.get(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/case-primary/map`,
        ).then((response) => {
            if (response.status === 200) {
                setCasePrimary(response.data.data);
            }
        }).catch((error) => {
            // setAlertStatus("error");
            // setServerErrorMsg(error.response.data.message);
            // setShowMessage(true);
            console.log(error)
        });  
        }
        loadCaseDetailsInfo();
    }, []);

    React.useImperativeHandle(ref,()=>({
        saveCaseDetailsInfo : async () => {
            // 获取表单数据进行保存操作
            const casePrimaryFormData = getCaseDetailsInfo();
            // 在这里进行保存操作， 发送http请求
            console.log('saveing case details data...', casePrimaryFormData);
            const res = axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/case-primary/save`,casePrimaryFormData).then(r =>{
                console.log("save success!",r);
                
            })
        }
    }));

    const getCaseDetailsInfo = () => {
        //遍历参数
        // personName.map(moi=>{
        //     console.log("MOI:",moi);
        // })
        
        // 模拟获取表单数据
        return {
            caseRefNum: "test017",
            codeCaseStatus: casePrimary.codeCaseStatus,
            incidentDate: moment(casePrimary.incidentDate).format('YYYY-MM-DD HH:mm:ss'),
            lodgeDate: moment(casePrimary.lodgeDate).format('YYYY-MM-DD HH:mm:ss'),
            iniRptDate: moment(casePrimary.iniRptDate).format('YYYY-MM-DD HH:mm:ss'),
            codeInvTeam: casePrimary.codeInvTeam,
            codeEnqUnit: casePrimary.codeEnqUnit,
            codeRptMtd: casePrimary.codeRptMtd,
            codeComOption: casePrimary.codeComOption
        };
    };

    return (
        <>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    style={{color:'#5B8197',font:'Roboto',fontWeight:'700',fontSize:'16px', marginLeft: "27px" }}
                >
                    Case Details
                </AccordionSummary>
                <AccordionDetails>
                    {/* <CaseDetailsForm/> */}
                    <Box id="case-details-mgmnt" style={{ margin: "15px" }}>
                        <Container ref={casePrimaryFormRef} maxWidth={false} disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container'>
                            <Grid container className='row'>
                                <Grid item className='field' xs={3}>
                                    <TextField
                                        disabled
                                        label={t("RN")}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="standard"
                                        value={casePrimary.caseRefNum}
                                        error={!!requestNumberError}
                                        helperText={requestNumberError}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCasePrimary(casePrimary => ({
                                            ...casePrimary,
                                            caseRefNum: e.target.value
                                        }))}
                                        // InputProps={{
                                        //     readOnly: true,
                                        // }}
                                    />
                                </Grid>
                                <Grid item className='field' xs={3}>
                                    <TextField
                                        disabled
                                        label={t("Categorization")}
                                        //placeholder={t('contain')}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="standard"
                                        // onChange={(e: ChangeEvent<HTMLInputElement>) => setCasePrimary(casePrimary => ({
                                        //     ...casePrimary,
                                        //     categarization: e.target.value
                                        // }))}
                                        value={casePrimary.categarization}
                                        error={!!requestNumberError}
                                        helperText={requestNumberError}
                                    />
                                </Grid>

                                <Grid item className='field' xs={3}>
                                    <FormControl variant="standard" sx={{ minWidth: 150 }}>
                                        <TextField
                                            label={t("Case Status")}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="standard"
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCasePrimary(casePrimary => ({
                                                ...casePrimary,
                                                codeCaseStatus:e.target.value
                                            }))}
                                            value={casePrimary.codeCaseStatus}
                                            error={!!requestNumberError}
                                            helperText={requestNumberError}
                                            //placeholder={t('contain')}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            
                            <Grid container className='row'>
                                <Grid item className='field' xs={2.6}>
                                    <FormControl variant="standard">
                                        <DatePicker
                                            label={t("Incident Date")}
                                            value={moment(casePrimary.incidentDate, 'yyyy-MM-DD')}
                                            format="YYYY-MM-DD"
                                            onChange={changeIncidentDate}
                                            //mask="____-__-__"
                                            //renderInput={(params) => <TextField style={{ width: "200px" }} variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!searchErrorMessage?.accessDateFrom} helperText={searchErrorMessage?.accessDateFrom} />}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item className='field' xs={2.6}>
                                    <FormControl variant="standard">
                                        <DatePicker
                                            label={t("Lodge Complaint Date Find")}
                                            value={moment(casePrimary.lodgeDate, 'yyyy-MM-DD')}
                                            format="YYYY-MM-DD"
                                            onChange={changeLodgeDate}
                                            //mask="____-__-__"
                                            //inputFormat="YYYY-MM-DD"
                                            //renderInput={(params) => <TextField style={{ width: "200px" }} InputLabelProps={{ shrink: true }} variant="standard" {...params} error={!!searchErrorMessage?.accessDateTo} helperText={searchErrorMessage?.accessDateTo} />}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item className='field' xs={2.6}>
                                    <TextField
                                        disabled
                                        label={t("Case Create Date")}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="standard"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCasePrimary(casePrimary => ({
                                            ...casePrimary,
                                            iniRptDate: e.target.value
                                        }))}
                                        value={"2023-06-06"}
                                        error={!!requestNumberError}
                                        helperText={requestNumberError}
                                    />
                                </Grid>
                                <Grid item className='field' xs={2.6}>
                                    <TextField
                                        disabled
                                        label={t("IPCC Endorsement Date")}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="standard"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCasePrimary(casePrimary => ({
                                            ...casePrimary,
                                            caseRefNum: e.target.value
                                        }))}
                                        value={"2023-06-06"}
                                        error={!!requestNumberError}
                                        helperText={requestNumberError}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container className='row'>
                                <Grid item className='field' xs={3}>
                                    <FormControl variant="standard" sx={{ minWidth: 150 }}>
                                        <InputLabel>{t("OC Team")}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={"Team 1a CAPO K"}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCasePrimary(casePrimary => ({
                                                ...casePrimary,
                                                codeInvTeam: e.target.value
                                            }))}
                                        >
                                            <MenuItem value={"Team 1a CAPO K"}>{t('Team 1a CAPO K')}</MenuItem>
                                            <MenuItem value={"PENDING"}>Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item className='field' xs={3}>
                                    <FormControl variant="standard" sx={{ minWidth: 150 }}>
                                        <InputLabel>{t("Enquiry Team(NC)")}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={"RC U 1 a KW"}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCasePrimary(casePrimary => ({
                                                ...casePrimary,
                                                codeEnqUnit: e.target.value
                                            }))}
                                        >
                                            <MenuItem value={"RC U 1 a KW"}>{t('RC U 1 a KW')}</MenuItem>
                                            <MenuItem value={"PENDING"}>Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item className='field' xs={3}>
                                    <FormControl variant="standard" sx={{ minWidth: 150 }}>
                                        <InputLabel>{t("Reporting Method")}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={"CAPO Hotline"}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCasePrimary(casePrimary => ({
                                                ...casePrimary,
                                                codeRptMtd: e.target.value
                                            }))}
                                        >
                                            <MenuItem value={"CAPO Hotline"}>{t('CAPO Hotline')}</MenuItem>
                                            <MenuItem value={"PENDING"}>Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container className='row'>
                                <Grid item className='field' xs={3}>
                                    <FormControl variant="standard" sx={{ minWidth: 150 }}>
                                        <InputLabel>{t("COM’s Option")}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={"Full"}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCasePrimary(casePrimary => ({
                                                ...casePrimary,
                                                codeComOption: e.target.value
                                            }))}
                                        >
                                            <MenuItem value={"Full"}>{t('Full')}</MenuItem>
                                            <MenuItem value={"PENDING"}>Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item className='field' xs={3}>
                                    <TextField
                                        disabled
                                        label={t("Serious/Minor Complaint")}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="standard"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCasePrimary(casePrimary => ({
                                            ...casePrimary,
                                            complaintType: e.target.value
                                        }))}
                                        value={casePrimary.complaintType}
                                        error={!!requestNumberError}
                                        helperText={requestNumberError}
                                    />
                                </Grid>
                                <Grid item className='field' xs={5}>
                                    <FormControl variant="standard" sx={{ minWidth: 150 }}>
                                        <InputLabel>{t("Matter of Interest")}</InputLabel>
                                        {/* <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={matterofInterest}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
                                        >
                                            <MenuItem value={"Serious"}>{t('Serious')}</MenuItem>
                                        </Select> */}

                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            multiple
                                            displayEmpty
                                            value={personName}
                                            onChange={handleMOIChange}
                                            renderValue={(selected) => {
                                                // if (selected.length === 0) {    
                                                //     return <em>Placeholder</em>;
                                                // }
                                                
                                                return selected.join(', ');
                                            }}
                                            MenuProps={MenuProps}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                        {names.map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name}
                                                style={getStyles(name, personName, theme)}
                                                >
                                                {name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                        <Box>
                                        {
                                            personName.map((name)=>(
                                                <Button key={name} size="small" style={{ color: "#000000", backgroundColor: '#9FF1CA', marginTop: "5px", marginRight: "5px"}}>{name}</Button>
                                            ))
                                        }
                                        </Box>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Container>
                        </Box>
                </AccordionDetails>
            </Accordion>
        </>
    );
});

export default CaseDetails;
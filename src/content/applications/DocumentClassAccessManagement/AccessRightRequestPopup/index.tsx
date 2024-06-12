import { Check, DoDisturb } from "@mui/icons-material";
import DatePicker from "@mui/lab/DatePicker";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Card, CardContent, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { cloneDeep } from "lodash";
import { FC, useEffect, useState, useContext, ChangeEvent } from "react";
import { Controller, FieldErrors, Resolver, useForm } from "react-hook-form";
import { Transaction, TransactionData, TransactionError } from "src/models/IntelligenceSharingReport";
import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { AccessRightRequestInput } from 'src/models/UserDocumentClass';

type AutoCompleteOption = {
    id: string,
    label: string
}

type TransactionDataDisplay = TransactionData & {
    bank?: AutoCompleteOption
}


type AccessRightRequestPopupProps = {
    showAccessRightRequestPopUp: boolean,
    toggleAccessRightRequestPopup: (c: any) => void,
    comfirmRequest: any,
    accessRightRequest: AccessRightRequestInput,
    setAccessRightRequest: any,
    requestErrorMessage: any,
    documentClassMaps: any,
}

const AccessRightRequestPopup: FC<AccessRightRequestPopupProps> =
    ({
        showAccessRightRequestPopUp,
        toggleAccessRightRequestPopup,
        comfirmRequest,
        accessRightRequest,
        setAccessRightRequest,
        requestErrorMessage,
        documentClassMaps: documentClassMaps,
    }) => {

        const { t } = useTranslation('documentClassAccessMgmnt')

        return (
            <Modal
                open={showAccessRightRequestPopUp}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    "&.MuiCard-root": {
                        overflow: "scroll"
                    }
                }}
            >
                <Box
                    display="flex-item"
                    alignItems="center"
                    justifyContent="center"
                    id="access-right-request-form"
                    component="form"
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
                                                '& .MuiInputLabel-root': { ml: "0rem" },
                                                '& .MuiInputBase-root': { ml: "0rem", mt: "0" },
                                                '& .MuiFormHelperText-root': { ml: "0rem" }

                                            }}
                                        // onSubmit={submitDisable}
                                        >
                                            <Grid container sx={{ width: 500 }}>

                                                <Grid item container xs={12}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="h3" >{t('accesssRightRequest')}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={4}>
                                                        <Typography variant="h5" >{t('documentClass')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <FormControl variant="standard" sx={{ minWidth: 270 }}>
                                                            <Select
                                                                labelId="demo-simple-select-standard-label"
                                                                id="demo-simple-select-standard"
                                                                value={accessRightRequest.documentClassInput}
                                                                onChange={(e) => { setAccessRightRequest({ ...accessRightRequest, documentClassInput: e.target.value }) }}
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
                                                                !!requestErrorMessage?.documentClass ?
                                                                    requestErrorMessage?.documentClass
                                                                    : null
                                                            }
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={4}>
                                                        <Typography variant="h5" >{t('dateFrom')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <FormControl sx={{ minWidth: 300 }}>
                                                            <DatePicker
                                                                value={accessRightRequest.accessDateFromInput}
                                                                onChange={(newValue: any) => { setAccessRightRequest({ ...accessRightRequest, accessDateFromInput: !!newValue ? newValue.format('YYYY-MM-DD') : null }) }}
                                                                mask="____-__-__"
                                                                inputFormat="YYYY-MM-DD"
                                                                renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!requestErrorMessage?.accessDateFrom} helperText={requestErrorMessage?.accessDateFrom} />}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>

                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={4}>
                                                        <Typography variant="h5" >{t('dateTo')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <FormControl sx={{ minWidth: 300 }}>
                                                            <DatePicker
                                                                value={accessRightRequest.accessDateToInput}
                                                                onChange={(newValue: any) => { setAccessRightRequest({ ...accessRightRequest, accessDateToInput: !!newValue ? newValue.format('YYYY-MM-DD') : null }) }}
                                                                mask="____-__-__"
                                                                inputFormat="YYYY-MM-DD"
                                                                renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!requestErrorMessage?.accessDateTo} helperText={requestErrorMessage?.accessDateTo} />}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={4}>
                                                        <Typography variant="h5" >{t('importDateFrom')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <FormControl sx={{ minWidth: 300 }}>
                                                            <DatePicker
                                                                value={accessRightRequest.importDateFromInput}
                                                                onChange={(newValue: any) => { setAccessRightRequest({ ...accessRightRequest, importDateFromInput: !!newValue ? newValue.format('YYYY-MM-DD') : null }) }}
                                                                mask="____-__-__"
                                                                inputFormat="YYYY-MM-DD"
                                                                renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!requestErrorMessage?.importDateFrom} helperText={requestErrorMessage?.importDateFrom} />}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={4}>
                                                        <Typography variant="h5" >{t('importDateTo')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <FormControl sx={{ minWidth: 300 }}>
                                                            <DatePicker
                                                                value={accessRightRequest.importDateToInput}
                                                                onChange={(newValue: any) => { setAccessRightRequest({ ...accessRightRequest, importDateToInput: !!newValue ? newValue.format('YYYY-MM-DD') : null }) }}
                                                                mask="____-__-__"
                                                                inputFormat="YYYY-MM-DD"
                                                                renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!requestErrorMessage?.importDateTo} helperText={requestErrorMessage?.importDateTo} />}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={4}>
                                                        <Typography variant="h5" >{t('reason')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <TextField
                                                            placeholder={t('reason')}
                                                            variant="standard"
                                                            onChange={(e) => { setAccessRightRequest({ ...accessRightRequest, requestReasonInput: e.target.value }) }}
                                                            value={accessRightRequest.requestReasonInput}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Grid item container justifyContent="end">
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            sx={{ marginLeft: '10px' }}
                                                            variant="outlined"
                                                            startIcon={<DoDisturb fontSize="small" />}
                                                            onClick={() => {
                                                                toggleAccessRightRequestPopup(false);
                                                            }}
                                                        >
                                                            {t('cancel')}
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            sx={{ marginLeft: '10px' }}
                                                            variant="contained"
                                                            startIcon={<Check fontSize="small" />}
                                                            type="button"
                                                            onClick={() => {
                                                                comfirmRequest();
                                                            }}
                                                        >
                                                            {t('confirm')}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
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


export default AccessRightRequestPopup;
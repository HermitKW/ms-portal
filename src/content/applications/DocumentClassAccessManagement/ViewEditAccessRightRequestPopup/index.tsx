import { Check, DoDisturb } from "@mui/icons-material";
import DatePicker from "@mui/lab/DatePicker";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Card, CardContent, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, Tooltip } from "@mui/material";
import { FC, useEffect, useState, useContext, ChangeEvent } from "react";

import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import { AccessRightRequestViewResponse } from 'src/models/UserDocumentClass';

type ViewEditAccessRightRequestPopupProps = {
    showViewEditAccessRightRequestPopUp: boolean,
    toggleViewEditAccessRightRequestPopup: (c: any) => void,
    updateRequest: any,
    accessRightRequestViewResponse: AccessRightRequestViewResponse,
    setAccessRightRequestViewResponse: any,
    requestErrorMessage: any,
    disabledEdition: any,
    setDisabledEdition: any,
}

const ViewEditAccessRightRequestPopup: FC<ViewEditAccessRightRequestPopupProps> =
    ({
        showViewEditAccessRightRequestPopUp,
        toggleViewEditAccessRightRequestPopup,
        updateRequest,
        accessRightRequestViewResponse,
        setAccessRightRequestViewResponse,
        requestErrorMessage,
        disabledEdition,
        setDisabledEdition,
    }) => {

        const { t } = useTranslation('documentClassAccessMgmnt')

        const [fromDateError, setFromDateError] = useState<String>("");
        const [toDateError, setToDateError] = useState<String>("");
        // const [disabledEdition, setDisabledEdition] = useState<boolean>(true);

        const dateFormatter = (value) => {
            if (!value) return "";
            return moment(value).format('yyyy-MM-DD HH:mm:ss')
        }

        const editRecord = () => {
            setDisabledEdition(false);
        }

        const confirmRecord = () => {
            updateRequest();
        }

        return (
            <Modal
                open={showViewEditAccessRightRequestPopUp}
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
                    id="view-edit-access-right-request-form"
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
                                            <Grid container sx={{ width: 600 }}>

                                                <Grid item container xs={12}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="h3" >{t('accesssRightRequest')}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                        <Typography variant="h5" >{t('documentClass')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <TextField
                                                            variant="standard"
                                                            disabled={true}
                                                            value={accessRightRequestViewResponse.usdDocClass}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                        <Typography variant="h5" >{t('dateFrom')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <FormControl>
                                                            <DatePicker
                                                                value={accessRightRequestViewResponse.usdAccessStime}
                                                                onChange={(newValue: any) => { setAccessRightRequestViewResponse({ ...accessRightRequestViewResponse, usdAccessStime: !!newValue ? newValue.format('YYYY-MM-DD') : null }) }}
                                                                disabled={disabledEdition}
                                                                mask="____-__-__"
                                                                inputFormat="YYYY-MM-DD"
                                                                renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!requestErrorMessage?.accessDateFrom} helperText={requestErrorMessage?.accessDateFrom} />}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                        <Typography variant="h5" >{t('dateTo')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <FormControl >
                                                            <DatePicker
                                                                value={accessRightRequestViewResponse.usdAccessEtime}
                                                                onChange={(newValue: any) => { setAccessRightRequestViewResponse({ ...accessRightRequestViewResponse, usdAccessEtime: !!newValue ? newValue.format('YYYY-MM-DD') : null }) }}
                                                                disabled={disabledEdition}
                                                                mask="____-__-__"
                                                                inputFormat="YYYY-MM-DD"
                                                                renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!requestErrorMessage?.accessDateTo} helperText={requestErrorMessage?.accessDateTo} />}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                        <Typography variant="h5" >{t('importDateFrom')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <FormControl>
                                                            <DatePicker
                                                                value={accessRightRequestViewResponse.usdImportDateFrom}
                                                                onChange={(newValue: any) => { setAccessRightRequestViewResponse({ ...accessRightRequestViewResponse, usdImportDateFrom: !!newValue ? newValue.format('YYYY-MM-DD') : null }) }}
                                                                disabled={disabledEdition}
                                                                mask="____-__-__"
                                                                inputFormat="YYYY-MM-DD"
                                                                renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!requestErrorMessage?.importDateFrom} helperText={requestErrorMessage?.importDateFrom} />}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                        <Typography variant="h5" >{t('importDateTo')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <FormControl >
                                                            <DatePicker
                                                                value={accessRightRequestViewResponse.usdImportDateTo}
                                                                onChange={(newValue: any) => { setAccessRightRequestViewResponse({ ...accessRightRequestViewResponse, usdImportDateTo: !!newValue ? newValue.format('YYYY-MM-DD') : null }) }}
                                                                disabled={disabledEdition}
                                                                mask="____-__-__"
                                                                inputFormat="YYYY-MM-DD"
                                                                renderInput={(params) => <TextField variant="standard" InputLabelProps={{ shrink: true }} {...params} error={!!requestErrorMessage?.importDateTo} helperText={requestErrorMessage?.importDateTo} />}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                        <Typography variant="h5" >{t('reason')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Tooltip title={accessRightRequestViewResponse.usdReason} arrow>
                                                            <TextField
                                                                placeholder={t('reason')}
                                                                variant="standard"
                                                                value={accessRightRequestViewResponse.usdReason}
                                                                onChange={(e: ChangeEvent<HTMLInputElement>) => { setAccessRightRequestViewResponse({ ...accessRightRequestViewResponse, usdReason: e.target.value }) }}
                                                                disabled={disabledEdition}
                                                            />
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>

                                                <Grid item container xs={12}>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                        <Typography variant="h5" >{t('requestBy')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            variant="standard"
                                                            disabled={true}
                                                            value={accessRightRequestViewResponse.createBy}
                                                        />
                                                    </Grid>
                                                    <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                        <Typography variant="h5" >{t('requestDate')}: </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            variant="standard"
                                                            disabled={true}
                                                            value={dateFormatter(accessRightRequestViewResponse.createTime)}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                {accessRightRequestViewResponse.usdRevokeBy === null ?
                                                    <>
                                                        <Grid item container xs={12}>
                                                            <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                <Typography variant="h5" >{t('supportBy')}: </Typography>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    variant="standard"
                                                                    disabled={true}
                                                                    value={accessRightRequestViewResponse.usdGrantBy}
                                                                />
                                                            </Grid>
                                                            <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                <Typography variant="h5" >{t('supportDate')}: </Typography>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    variant="standard"
                                                                    disabled={true}
                                                                    value={dateFormatter(accessRightRequestViewResponse.usdGrantDate)}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        {accessRightRequestViewResponse.remarksSupport !== null ?
                                                            <Grid item container xs={12}>
                                                                <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                    <Typography variant="h5" >{t('supportRemarks')}: </Typography>
                                                                </Grid>
                                                                <Grid item xs={8}>
                                                                    <Tooltip title={accessRightRequestViewResponse.remarksSupport} arrow>
                                                                        <TextField
                                                                            variant="standard"
                                                                            value={accessRightRequestViewResponse.remarksSupport}
                                                                            disabled={true}
                                                                            sx={{
                                                                                "& .MuiInputBase-input": {
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis"
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                </Grid>
                                                            </Grid>
                                                            :
                                                            null
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        <Grid item container xs={12}>
                                                            <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                <Typography variant="h5" >{t('unSupportBy')}: </Typography>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    variant="standard"
                                                                    disabled={true}
                                                                    value={accessRightRequestViewResponse.usdRevokeBy}
                                                                />
                                                            </Grid>
                                                            <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                <Typography variant="h5" >{t('unSupportDate')}: </Typography>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    variant="standard"
                                                                    disabled={true}
                                                                    value={dateFormatter(accessRightRequestViewResponse.usdRevokeDate)}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        {accessRightRequestViewResponse.remarksUnsupport !== null ?
                                                            <Grid item container xs={12}>
                                                                <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                    <Typography variant="h5" >{t('unSupportRemarks')}: </Typography>
                                                                </Grid>
                                                                <Grid item xs={8}>
                                                                    <Tooltip title={accessRightRequestViewResponse.remarksUnsupport} arrow>
                                                                        <TextField
                                                                            variant="standard"
                                                                            value={accessRightRequestViewResponse.remarksUnsupport}
                                                                            disabled={true}
                                                                            sx={{
                                                                                "& .MuiInputBase-input": {
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis"
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                </Grid>
                                                            </Grid>
                                                            :
                                                            null
                                                        }
                                                    </>
                                                }

                                                {accessRightRequestViewResponse.usdRejectBy === null ?
                                                    <>
                                                        <Grid item container xs={12}>
                                                            <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                <Typography variant="h5" >{t('approveBy')}: </Typography>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    variant="standard"
                                                                    disabled={true}
                                                                    value={accessRightRequestViewResponse.usdApproveBy}
                                                                />
                                                            </Grid>
                                                            <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                <Typography variant="h5" >{t('approveDate')}: </Typography>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    variant="standard"
                                                                    disabled={true}
                                                                    value={dateFormatter(accessRightRequestViewResponse.usdApproveDate)}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        {accessRightRequestViewResponse.remarksApprove !== null ?
                                                            <Grid item container xs={12}>
                                                                <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                    <Typography variant="h5" >{t('approveRemarks')}: </Typography>
                                                                </Grid>
                                                                <Grid item xs={8}>
                                                                    <Tooltip title={accessRightRequestViewResponse.remarksApprove} arrow>
                                                                        <TextField
                                                                            variant="standard"
                                                                            value={accessRightRequestViewResponse.remarksApprove}
                                                                            disabled={true}
                                                                            sx={{
                                                                                "& .MuiInputBase-input": {
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis"
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                </Grid>
                                                            </Grid>
                                                            :
                                                            null
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        <Grid item container xs={12}>
                                                            <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                <Typography variant="h5" >{t('rejectBy')}: </Typography>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    variant="standard"
                                                                    disabled={true}
                                                                    value={accessRightRequestViewResponse.usdRejectBy}
                                                                />
                                                            </Grid>
                                                            <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                <Typography variant="h5" >{t('rejectDate')}: </Typography>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    variant="standard"
                                                                    disabled={true}
                                                                    value={dateFormatter(accessRightRequestViewResponse.usdRejectDate)}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        {accessRightRequestViewResponse.remarksReject !== null ?
                                                            <Grid item container xs={12}>
                                                                <Grid item sx={{ marginTop: 'auto' }} xs={3}>
                                                                    <Typography variant="h5" >{t('rejectRemarks')}: </Typography>
                                                                </Grid>
                                                                <Grid item xs={8}>
                                                                    <Tooltip title={accessRightRequestViewResponse.remarksReject} arrow>
                                                                        <TextField
                                                                            variant="standard"
                                                                            value={accessRightRequestViewResponse.remarksReject}
                                                                            disabled={true}
                                                                            sx={{
                                                                                "& .MuiInputBase-input": {
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis"
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                </Grid>
                                                            </Grid>
                                                            :
                                                            null
                                                        }
                                                    </>
                                                }

                                                <Grid item container justifyContent="end">
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            sx={{ marginLeft: '10px' }}
                                                            variant="outlined"
                                                            startIcon={<DoDisturb fontSize="small" />}
                                                            onClick={() => {
                                                                setDisabledEdition(true);
                                                                toggleViewEditAccessRightRequestPopup(false);
                                                            }}
                                                        >
                                                            {t('cancel')}
                                                        </Button>
                                                    </Grid>
                                                    {accessRightRequestViewResponse.usdStatus === "PENDING" ?
                                                        (disabledEdition ?
                                                            <Grid item>
                                                                <Button
                                                                    sx={{ marginLeft: '10px' }}
                                                                    variant="contained"
                                                                    startIcon={<Check fontSize="small" />}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        editRecord();
                                                                    }}
                                                                >
                                                                    {t('edit')}
                                                                </Button>
                                                            </Grid>
                                                            :
                                                            <Grid item>
                                                                <Button
                                                                    sx={{ marginLeft: '10px' }}
                                                                    variant="contained"
                                                                    startIcon={<Check fontSize="small" />}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        confirmRecord();
                                                                    }}
                                                                >
                                                                    {t('confirm')}
                                                                </Button>
                                                            </Grid>)
                                                        :
                                                        null
                                                    }
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


export default ViewEditAccessRightRequestPopup;
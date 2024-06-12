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

type SupportRequestPopupProps = {
    supportReuqestPopUp: any,
    remarks: any,
    setRemarks: any,
    setSupportReuqestPopUp: any,
    submitSupport: any,
}

const SupportRequestPopupComponent: FC<SupportRequestPopupProps> =
    ({
        supportReuqestPopUp,
        remarks,
        setRemarks,
        setSupportReuqestPopUp,
        submitSupport,
    }) => {



        const { t } = useTranslation('verifyAccessRight')





        return (
            <Modal
                open={supportReuqestPopUp}
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
                                                    <Typography variant="h3">{t('confirmToSupport')}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container>
                                                        <Grid container className="row">
                                                            <Typography variant="h6" gutterBottom>
                                                                {t('remarks')}:
                                                            </Typography>
                                                            <Grid container xs={10} className="field">
                                                                <TextField
                                                                    id="outlined-multiline-static"
                                                                    multiline
                                                                    rows={2}
                                                                    variant="outlined"
                                                                    value={remarks}
                                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRemarks(e.target.value)}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container className="row">
                                                            <Grid item container justifyContent="end">
                                                                <Grid item>
                                                                    <Button type="button"
                                                                        sx={{ marginLeft: '10px' }}
                                                                        variant="outlined"
                                                                        startIcon={<DoDisturb fontSize="small" />}
                                                                        onClick={() => {
                                                                            setSupportReuqestPopUp(false);
                                                                        }}
                                                                    >
                                                                        {t('no')}
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Button
                                                                        type="button"
                                                                        sx={{ marginLeft: '10px' }}
                                                                        variant="contained"
                                                                        startIcon={<Check fontSize="small" />}
                                                                        onClick={() => {
                                                                            submitSupport();
                                                                            setSupportReuqestPopUp(false);
                                                                        }}>
                                                                        {t('yes')}
                                                                    </Button>
                                                                </Grid>
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


export default SupportRequestPopupComponent;
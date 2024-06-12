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

type UnsupportRequestPopupProps = {
  unsupportReuqestPopUp: any,
  remarks: any,
  setRemarks: any,
  setUnsupportReuqestPopUp: any,
  submitUnsupport: any,
}

const UnsupportRequestPopupComponent: FC<UnsupportRequestPopupProps> =
  ({
    unsupportReuqestPopUp,
    remarks,
    setRemarks,
    setUnsupportReuqestPopUp,
    submitUnsupport,
  }) => {



    const { t } = useTranslation('verifyAccessRight')





    return (
      <Modal
        open={unsupportReuqestPopUp}
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
                          <Typography variant="h3">{t('confirmToUnsupport')}</Typography>
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
                            <Grid item container justifyContent="end">
                              <Grid item>
                                <Button type="button"
                                  sx={{ marginLeft: '10px' }}
                                  variant="outlined"
                                  startIcon={<DoDisturb fontSize="small" />}
                                  onClick={() => {
                                    setUnsupportReuqestPopUp(false);
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
                                    submitUnsupport();
                                    setUnsupportReuqestPopUp(false);
                                  }}>
                                  {t('yes')}
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


export default UnsupportRequestPopupComponent;
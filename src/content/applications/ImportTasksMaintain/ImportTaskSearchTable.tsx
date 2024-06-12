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
import { Search, Add } from '@mui/icons-material';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import { keyBy, map } from 'lodash';



interface DocumentClassMap {
  key: any;
  value: any;
}



type SearchImportTaskPopupProps = {
  setImportJobList: any,
  isSearched: any,
  setIsSearched: any,
  order: any,
  orderBy: any,
}


const SearchImportTaskComponent: FC<SearchImportTaskPopupProps> =
  ({
    setImportJobList,
    isSearched,
    setIsSearched,
    order,
    orderBy,
  }) => {



    const { t } = useTranslation('importTasksMaintain')
    const globalPageLoadSetter = useContext(SetPageLoaderContext);

    const [documentClass, setDocumentClass] = useState<String>("ALL");


    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
    const [count, setCount] = useState<number>(2);
    const navigateWithLocale = useNavigateWithLocale();

    const [documentClassMaps, setDocumentClassMaps] = useState<DocumentClassMap[]>([]);
    const [documentClassMapsKeyByKey, setDocumentClassMapsKeyByKey] = useState<any>(null);

    useEffect(() => {
      loadDocumentClassesMap();
      searchImportJob();
    }, []);

    useEffect(() => {
      searchImportJob();
    }, [order, orderBy]);

    useEffect(() => {
      if (!isSearched) {
        searchImportJob();
        setIsSearched(true);
      }
    }, [isSearched]);


    const documentClassMapsKeyBy = (documentClassMaps) => {
      setDocumentClassMapsKeyByKey(keyBy(documentClassMaps, "key"));
    }

    const loadDocumentClassesMap = () => {

      globalPageLoadSetter(true)

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
        });
    }





    const createImportTask = function () {
      return navigateWithLocale(`import-tasks-maintain`)("0");
    }


    const clickResetButton = () => {
      console.log('re')
      setDocumentClass("ALL")
    }

    const searchImportJob = () => {
      setPage(0);
      loadImportJob(limit, 0);
    }


    const handlePageChange = (event: any, newPage: number): void => {
      setPage(newPage);
      console.log("set page to:" + newPage);
      loadImportJob(limit, newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
      setLimit(parseInt(event.target.value));
      console.log("set limit to: " + parseInt(event.target.value))
      loadImportJob(parseInt(event.target.value), page);
    };


    const loadImportJob = (limit: number, page: number) => {

      globalPageLoadSetter(true)

      axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/system-administration/import-job`,
        {
          "docClassId": documentClass,
          "limit": limit,
          "offset": (page * limit),
          "order": order,
          "orderBy": orderBy
        }).then((response) => {
          if (response.status === 200) {
            setCount(response.data.result.count);
            setImportJobList(response.data.result.searchImportJobResponses);

            console.log("count is : " + response.data.result.count);
          }
          console.log(response)
        });

    }

    console.log("count: " + count);

    return (
      <Container maxWidth={false} disableGutters sx={{ paddingLeft: '27px', paddingRight: '10px' }}
        className="search-container">
        <Grid container className="row">
          <Grid className="field">
            <FormControl variant="standard" sx={{ minWidth: 150 }}>
              <InputLabel>{t('documentClass')}</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={documentClass}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setDocumentClass(e.target.value);
                }}
              >
                <MenuItem key={"ALL"} value={"ALL"}>{t('all')}</MenuItem>
                {
                  documentClassMaps?.map((documentClass) => {
                    return (
                      <MenuItem key={documentClass.key} value={documentClass.key}>
                        {documentClass.key}
                      </MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item marginLeft={'auto'}>
            <Button
              variant="contained"
              startIcon={<Add fontSize="small" />}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                createImportTask();
              }}
              size="medium"
            >
              {t('add')}
            </Button>
          </Grid>
        </Grid>
        <Grid container className="row">
          <Grid item marginLeft={'auto'}>
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
              startIcon={<Search fontSize="small" />}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                searchImportJob();
              }}
              size="medium"
            >
              {t('search')}
            </Button>
          </Grid>
        </Grid>
        <Grid container className="row" sx={{ marginTop: 1 }}>
          <Grid item sx={{ marginLeft: 'auto' }}>
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


export default SearchImportTaskComponent;
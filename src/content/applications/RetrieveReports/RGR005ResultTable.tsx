
import { Box, Button, Card, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, useTheme } from '@mui/material';
import moment, { Moment } from 'moment';
import { ChangeEvent, useEffect, useState, MouseEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import './RGR005ResultTable.scss';
import { INTELLIGENCE_SHARING_RPT_SERVICE_URL, DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS } from 'src/constants';
import { filter, map, sortBy } from 'lodash';
import ReportsResult from './ReportsResult';
import HookedDatePicker from 'src/components/HookedDatePicker';
import { CriteriaActions } from 'src/components/CriteriaArea';
import { CatslasReturn, Countable } from 'src/utilities/Utils';
import axios, { AxiosResponse } from 'axios';
import HookedSelectField from 'src/components/HookedSelect';

interface dataTemp {
  id: number | string;
  docName: string;
  searchNo: string;
  retrieveNo: string;
}

function RGR005ResultTable() {
  const { t } = useTranslation('recordAccessSummary')

  const resultTableColumns = [
    { name: t('documentClass'), key: 'docName', seq: 1, type: 'string' }
    , { name: t('numberOfSearch'), key: 'searchNo', seq: 2, type: 'string' }
    , { name: t('numberOfRetrieval'), key: 'retrieveNo', seq: 3, type: 'string' }
  ]
  const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });
  const [documentClassData,setDocumentClassData] = useState<string[]>(null);

  const handleExportData = (criteria: any) => {
    console.info(handleExportData);
  }

  function formatToDateYYYYMMDD(date) {
    return date && moment(date).format("yyyy-MM-DD");
  }

  const fetchData = (criteria: any, pagination: any) => {
    console.info(criteria);
    return axios.post<CatslasReturn<Countable<any>>>(
      `${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/record-access-summary/search`,
    {
      ...criteria,
      ...pagination,
      dateFrom: formatToDateYYYYMMDD(criteria.dateFrom),
      dateTo: formatToDateYYYYMMDD(criteria.dateTo)
    });
  }

  function loadDocumentClass() {
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/document-classes/get-all-document-class`,{
      requestFrom: "reports"
    }
    ).then((response) => {
      setDocumentClassData(response.data.result);
    })
      .catch((error) => {
        console.log(error.response);
      });
  }
  useEffect(()=>{
    loadDocumentClass();
  },[])

  const searchQueryInput = [
    {
      row: [
        {
          item: (
            <HookedDatePicker
              name="dateFrom"
              label={t("importStartDate")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD"
            />)
        }, 
      {
        item: (
          <HookedDatePicker
            name="dateTo"
            label={t("importEndDate")}
            mask="____-__-__"
            inputFormat="YYYY-MM-DD"
          />)
      }, 
      {
        item: (
          <HookedSelectField name="documentClass" label="Document Class" sx={{ minWidth: "180px" }}>
            <MenuItem value={"All"}>All</MenuItem>
            {documentClassData && documentClassData.map((docData, index) => (
            <MenuItem key={index} value={docData}>{docData}</MenuItem>
            ))}
          </HookedSelectField>
        )
      }],
      gridContainerProps: {
        gridClassName: "row"
      }
    },
    {
      row: [{
        item: <CriteriaActions />,
        gridItemProps: { marginLeft: "auto" }
      }],
    }
  ];

  const exportDataToExcel = (criteria: any, pagination: any) => {
      axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/record-access-summary/export-excel`, {
      ...criteria,
      ...pagination,
      dateFrom: formatToDateYYYYMMDD(criteria.dateFrom),
      dateTo: formatToDateYYYYMMDD(criteria.dateTo)
      },
        {
          responseType: 'arraybuffer',
          withCredentials: true
        }
      ).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const fileName = "import-recordAccessSummary-report-" + moment().format('YYYYMMDDHHmmss') + ".xlsx";
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      })
        .catch((error) => {
          let enc = new TextDecoder('utf-8')
          let res = JSON.parse(enc.decode(new Uint8Array(error.response.data)))
        });
  }

  return (
    <ReportsResult column={resultTableColumnsSorted} tableDataFetch={fetchData}
      rows={searchQueryInput}
      handleExportData={exportDataToExcel}
      renderCell={(value, type, columnKey) => {
        return value;
      }}
      defaultValue={{
        dateFrom: null,
        documentClass: "All",
        dateTo: null
      }}
    />
  );
}

export default RGR005ResultTable;

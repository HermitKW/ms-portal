
import { Box, Button, Card, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, useTheme } from '@mui/material';
import { ChangeEvent, useEffect, useState, MouseEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { map, sortBy } from 'lodash';


import ReportsResult from './ReportsResult';
import HookedDatePicker from 'src/components/HookedDatePicker';
import { CriteriaActions } from 'src/components/CriteriaArea';
import { CatslasReturn, Countable } from 'src/utilities/Utils';
import axios, { AxiosResponse } from 'axios';
import HookedSelectField from 'src/components/HookedSelect';

import moment, { Moment } from 'moment';
import './RGR004ResultTable.scss';
import { INTELLIGENCE_SHARING_RPT_SERVICE_URL,USER_CONFIG_SERVICE_URL, DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS } from 'src/constants';

interface dataTemp{
  id: number | string;
  batchNo: string;
  documentClass: string;
  size: string;
  fileName: string;
  importEndDateTime: string;
} 

function RGR004ResultTable() {
  const [documentClassData,setDocumentClassData] = useState<string[]>(null);
  
  const { t } = useTranslation('importDetailReport')

  const resultTableColumns = [
    {name: t('batchNo'), key: 'batchNo', seq: 1, type: 'string'}
   ,{name: t('documentClass') , key: 'documentClass', seq: 2, type: 'string'}
   ,{name: t('size'), key: 'size', seq: 3, type: 'string'}
   ,{name: t('fileName'), key: 'fileName', seq: 4, type: 'string'}
   ,{name: t('importEndDateTime'), key: 'importEndDateTime', seq: 5, type: 'datetime'}
]
  const resultTableColumnsSorted = sortBy(resultTableColumns,function(o){return o.seq});

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

  function formatToDateYYYYMMDD(date) {
    return date && moment(date).format("yyyy-MM-DD");
  }

  const fetchData = (criteria: any, pagination: any) => {
    return axios.post<CatslasReturn<Countable<any>>>(
      `${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-detail-report/search`,
    {
      ...criteria,
      ...pagination,
      dateFrom: formatToDateYYYYMMDD(criteria.dateFrom),
      dateTo: formatToDateYYYYMMDD(criteria.dateTo)
    });
  }
  const searchQueryInput = [
    {
      row: [
        { 
          item: (
          <HookedSelectField name="documentClass" label="Document Class" sx={{ minWidth: "180px" }}>
            <MenuItem value={"All"}>All</MenuItem>
            {documentClassData && documentClassData.map((docData, index) => (
            <MenuItem key={index} value={docData}>{docData}</MenuItem>
            ))}
          </HookedSelectField>
        )
        },
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
        }
      ],
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
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-detail-report/export-excel`, {
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
      const fileName = "import-exception-report-" + moment().format('YYYYMMDDHHmmss') + ".xlsx";
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
        if (type === 'datetime') return moment(value).format('yyyy-MM-DD HH:mm:ss')
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

export default RGR004ResultTable;

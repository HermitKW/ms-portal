import { Search } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import { Box, Button, Card, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, useTheme } from '@mui/material';
import moment, { Moment } from 'moment';
import { ChangeEvent, useEffect, useState, MouseEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PageLoader from 'src/components/PageLoader';

import { CriteriaActions } from 'src/components/CriteriaArea';
import './RGR002ResultTable.scss';
import { filter, map, sortBy } from 'lodash';
import { TableHeader } from 'src/components/Table';
import { CatslasReturn, Countable } from 'src/utilities/Utils';
import ReportsResult from './ReportsResult';

import axios, { AxiosResponse } from 'axios';
import EnhancedTableHead from 'src/components/EnhancedTableHead';
import { Order } from 'src/utilities/Utils';
import { INTELLIGENCE_SHARING_RPT_SERVICE_URL, DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS } from 'src/constants';
import HookedDatePicker from 'src/components/HookedDatePicker';

interface dataTemp {
  id: number | string;
  docName: string;
  noImp: string;
  totNo: string;
  totSize: string;
}

function RGR002ResultTable() {
  const { t } = useTranslation('importSummaryReport')

  const resultTableColumns = [
    { name: t('documentClass'), key: 'docName', seq: 1, type: 'string' }
    , { name: t('numberOfImport'), key: 'noImp', seq: 2, type: 'string' }
    , { name: t('totalNumber'), key: 'totNo', seq: 3, type: 'string' }
    , { name: t('totalSize'), key: 'totSize', seq: 4, type: 'string' }
  ]
  const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });
  
  function formatToDateYYYYMMDD(date) {
    return date && moment(date).format("yyyy-MM-DD");
  }

  const fetchData = (criteria: any, pagination: any) => {
    console.info(criteria);
    return axios.post<CatslasReturn<Countable<any>>>(
      `${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-summary-report/search`,
    {
      ...criteria,
      ...pagination,
      dateFrom:formatToDateYYYYMMDD(criteria.dateFrom),
      dateTo:formatToDateYYYYMMDD(criteria.dateTo)
    });
  }

const searchFromDateInput = [
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

const exportSummaryExcel = (criteria: any,pagination: any) => {
  axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-summary-report/export-excel`,{
    ...criteria,
    ...pagination,
    dateFrom:formatToDateYYYYMMDD(criteria.dateFrom),
    dateTo:formatToDateYYYYMMDD(criteria.dateTo)
  },
  {
    responseType: 'arraybuffer',
    withCredentials: true
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const fileName = "import-summary-report-" + moment().format('YYYYMMDDHHmmss') + ".xlsx";
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
      rows={searchFromDateInput}
      handleExportData={exportSummaryExcel}
      renderCell={(value) => {
        return value;
      }}
      defaultValue={{
        dateFrom: null,
        dateTo: null
      }}
    />
  );
}

export default RGR002ResultTable;


import {  FormControl, TextField } from '@mui/material';
import { ChangeEvent, useEffect, useState, MouseEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import moment, { Moment } from 'moment';

import ReportsResult from './ReportsResult';
import HookedDatePicker from 'src/components/HookedDatePicker';
import { CriteriaActions } from 'src/components/CriteriaArea';
import { CatslasReturn, Countable } from 'src/utilities/Utils';
import axios, { AxiosResponse } from 'axios';

import './RGR006ResultTable.scss';
import { filter, map, sortBy } from 'lodash';

import { INTELLIGENCE_SHARING_RPT_SERVICE_URL,USER_CONFIG_SERVICE_URL, DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS } from 'src/constants';
import HookedInput from 'src/components/HookedInput';
interface dataTemp{
  id: number | string;
  accUi: string;
  accName: string;
  accPost: string;
  actAction: string;
  actCreateTime: string;
  actIpAddr: string;
} 

function RGR006ResultTable() {
  const { t } = useTranslation('activityLogReport')

  const resultTableColumns = [
    {name: t('uiOfUserName'), key: 'accUi', seq: 1, type: 'string'}
   ,{name: t('userName') , key: 'accName', seq: 2, type: 'string'}
   ,{name: t('post'), key: 'accPost', seq: 3, type: 'string'}
   ,{name: t('action'), key: 'actAction', seq: 4, type: 'string'}
   ,{name: t('createDate'), key: 'actCreateTime', seq: 5, type: 'datetime'}
   ,{name: t('ipAddress'), key: 'actIpAddr', seq: 6, type: 'string'}
]
  const resultTableColumnsSorted = sortBy(resultTableColumns,function(o){return o.seq});

  function formatToDateYYYYMMDD(date) {
    return date && moment(date).format("yyyy-MM-DD");
  }

  const fetchData = (criteria: any, pagination: any) => {
    console.info(criteria);
    return axios.post<CatslasReturn<Countable<any>>>(
      `${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/activity-log-report/search`,
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
            <HookedDatePicker
              name="dateFrom"
              label={t("Create Start Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD"/>)
        }, 
        {
          item: (
            <HookedDatePicker
              name="dateTo"
              label={t("Create End Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD"/>)
        }
    ],
      gridContainerProps: {
        gridClassName: "row"
      }
  },
  {
    row:[
      {
        item: (
          <HookedInput
          name="uiOrName" 
          label={t("UI of User Name")}
          placeholder={t("Contain")}
          />
        )
      },
      {
        item: (
          <HookedInput
          name='userName'
          label={t("User Name")}
          placeholder={t("Contain")}
        />)
      },
      {
        item: (
          <HookedInput 
          name="actAction" 
          label={t("Action")}
          placeholder={t("Contain")}
          />
        )
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
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/activity-log-report/export-excel`, {
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
      const fileName = "import-activity-log-report-" + moment().format('YYYYMMDDHHmmss') + ".xlsx";
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
      dateTo: null,
      userName:null,
      uiOrName:null,
      actAction:null
    }}
  />
  );
}

export default RGR006ResultTable;

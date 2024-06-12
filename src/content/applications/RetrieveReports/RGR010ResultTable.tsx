import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@mui/material';

import ReportsResult from './ReportsResult';
import HookedDatePicker from 'src/components/HookedDatePicker';
import { CriteriaActions } from 'src/components/CriteriaArea';
import { CatslasReturn, Countable } from 'src/utilities/Utils';
import axios, { AxiosResponse } from 'axios';
import HookedSelectField from 'src/components/HookedSelect';
import HookedInput from 'src/components/HookedInput';
import { useEffect, useState } from 'react';
import { INTELLIGENCE_SHARING_RPT_SERVICE_URL } from 'src/constants';
import { map, sortBy } from 'lodash';
import './RGR010ResultTable.scss';
interface dataTemp {
  id: number | string;
  ui: string;
  name: string;
  post: string;
  documentClass: string;
  action: string;
  actionDate: string;
  remarks: string;
}

function RGR010ResultTable() {
  const { t } = useTranslation('recordAccessDetail')

  const resultTableColumns = [
    { name: t('ui'), key: 'ui', seq: 1, type: 'string' }
    , { name: t('name'), key: 'name', seq: 2, type: 'string' }
    , { name: t('post'), key: 'post', seq: 3, type: 'string' }
    , { name: t('documentClass'), key: 'documentClass', seq: 4, type: 'string' }
    , { name: t('action'), key: 'action', seq: 5, type: 'string' }
    , { name: t('actionDate'), key: 'actionDate', seq: 6, type: 'datetime' }
    , { name: t('remarks'), key: 'remarks', seq: 7, type: 'string' }
  ]
  const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });

  const [documentClassData, setDocumentClassData] = useState<string[]>(null);

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
  useEffect(() => {
    loadDocumentClass();
  }, [])

  function formatToDateYYYYMMDD(date) {
    return date && moment(date).format("yyyy-MM-DD");
  }

  const fetchData = (criteria: any, pagination: any) => {
    return axios.post<CatslasReturn<Countable<any>>>(
      `${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-recordAccessDetail-report/search`,
      {
        ...criteria,
        ...pagination,
        actionStartDate:formatToDateYYYYMMDD(criteria.actionStartDate),
        actionEndDate:formatToDateYYYYMMDD(criteria.actionEndDate)
        
      });
  }

  const exportDataToExcel = (criteria: any, pagination: any) => {
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-recordAccessDetail-report/export-excel`, {
      ...criteria,
      ...pagination,
      actionStartDate:formatToDateYYYYMMDD(criteria.actionStartDate),
      actionEndDate:formatToDateYYYYMMDD(criteria.actionEndDate)
    },
      {
        responseType: 'arraybuffer',
        withCredentials: true
      }
    ).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = "import-userAccess-report-" + moment().format('YYYYMMDDHHmmss') + ".xlsx";
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    })
      .catch((error) => {
        let enc = new TextDecoder('utf-8')
        let res = JSON.parse(enc.decode(new Uint8Array(error.response.data)))
      });
  }

  const searchQueryInput = [
    {
      row: [
        {
          item: (
            <HookedSelectField name='documentClass' label="Document Class" sx={{ minWidth: "210px" }}>
              
              <MenuItem value={"All"}>All</MenuItem>

              {documentClassData && documentClassData.map((documentClass, index) => (
                <MenuItem key={index} value={documentClass}>{documentClass}</MenuItem>
              ))}

            </HookedSelectField>
          )
        }, {
          item: (
            <HookedDatePicker
              name="actionStartDate"
              label={t("Action Start Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD" />)
        },
        {
          item: (
            <HookedDatePicker
              name="actionEndDate"
              label={t("Action End Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD" />)
        },

      ],
      gridContainerProps: {
        gridClassName: "row"
      }
    },
    {
      row: [
        {
          item: (
            <HookedInput
              name='ui'
              label={t("UI")}
              placeholder={t("Contain")}
            />)
        }, {
          item: (
            <HookedInput
              name="name"
              label={t("Name")}
              placeholder={t("Contain")}
            />
          )
        },
        {
          item: (
            <HookedInput
              name='action'
              label={t("Action")}
              placeholder={t("Contain")}
            />)
        }
      ],
      gridContainerProps: {
        gridClassName: "row"
      },
    },
    {
      row: [{
        item: <CriteriaActions />,
        gridItemProps: { marginLeft: "auto" }
      }],
    },

  ];


  return (<ReportsResult column={resultTableColumnsSorted} tableDataFetch={fetchData}
    rows={searchQueryInput}
    handleExportData={exportDataToExcel}
    renderCell={(value, type, columnKey) => {
      if (type === 'datetime') return moment(value).format('yyyy-MM-DD HH:mm:ss')
      return value;
    }}
    defaultValue={{
      documentClass: "All",
      ui: null,
      name: null,
      action: null,
      actionStartDate: null,
      actionEndDate: null
    }}
  />
  );
}

export default RGR010ResultTable;

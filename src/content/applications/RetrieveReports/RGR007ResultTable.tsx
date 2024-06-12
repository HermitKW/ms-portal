
import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next'; import ReportsResult from './ReportsResult';
import HookedDatePicker from 'src/components/HookedDatePicker';
import { CriteriaActions } from 'src/components/CriteriaArea';
import { CatslasReturn, Countable } from 'src/utilities/Utils';
import axios, { AxiosResponse } from 'axios';
import HookedInput from 'src/components/HookedInput';

import './RGR007ResultTable.scss';
import { INTELLIGENCE_SHARING_RPT_SERVICE_URL } from 'src/constants';
import { map, sortBy } from 'lodash';
interface dataTemp {
  id: number | string;
  audTable: string;
  accUi: string;
  accName: string;
  audCreateDate: string;
  audAction: string;
}

function RGR007ResultTable() {
  const { t } = useTranslation('auditLogReport')

  const resultTableColumns = [
    { name: t('databaseTableName'), key: 'audTable', seq: 1, type: 'string' }
    , { name: t('uiOfUserName'), key: 'accUi', seq: 2, type: 'string' }
    , { name: t('userName'), key: 'accName', seq: 3, type: 'string' }
    , { name: t('createDate'), key: 'audCreateDate', seq: 4, type: 'datetime' }
    , { name: t('action'), key: 'audAction', seq: 5, type: 'string' }
  ]
  const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });

  function formatToDateYYYYMMDD(date) {
    return date && moment(date).format("yyyy-MM-DD");
  }

  const fetchData = (criteria: any, pagination: any) => {
    console.info(criteria);
    return axios.post<CatslasReturn<Countable<any>>>(
      `${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-auditLog-report/search`,
      {
        ...criteria,
        ...pagination,
        dateFrom:formatToDateYYYYMMDD(criteria.dateFrom),
        dateTo:formatToDateYYYYMMDD(criteria.dateTo)
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
              inputFormat="YYYY-MM-DD" />)
        },
        {
          item: (
            <HookedDatePicker
              name="dateTo"
              label={t("Create End Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD" />)
        }
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
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-auditLog-report/export-excel`, {
      ...criteria,
      ...pagination,
      dateFrom:formatToDateYYYYMMDD(criteria.dateFrom),
      dateTo:formatToDateYYYYMMDD(criteria.dateTo)
    },
      {
        responseType: 'arraybuffer',
        withCredentials: true
      }
    ).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = "import-auditLog-report-" + moment().format('YYYYMMDDHHmmss') + ".xlsx";
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
      }}
    />
  )
}

export default RGR007ResultTable;

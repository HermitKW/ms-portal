
import { MenuItem } from '@mui/material';
import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import ReportsResult from './ReportsResult';
import HookedDatePicker from 'src/components/HookedDatePicker';
import { CriteriaActions } from 'src/components/CriteriaArea';
import { CatslasReturn, Countable } from 'src/utilities/Utils';
import axios, { AxiosResponse } from 'axios';
import HookedSelectField from 'src/components/HookedSelect';
import './RGR001ResultTable.scss';
import { INTELLIGENCE_SHARING_RPT_SERVICE_URL } from 'src/constants';
import { map, sortBy } from 'lodash';

interface dataTemp {
  id: number;
  imhScheduler: string;
  imhStime: string;
  imhEtime: string;
  imhStatus: string;
}

function RGR001ResultTable() {
  const { t } = useTranslation('importUtilizationReport')

  const resultTableColumns = [
    { name: t('schedulerName'), key: 'imhScheduler', seq: 1, type: 'string' }
    , { name: t('executionStartDate'), key: 'imhStime', seq: 2, type: 'datetime' }
    , { name: t('executionEndDate'), key: 'imhEtime', seq: 3, type: 'datetime' }
    , { name: t('overallStatus'), key: 'imhStatus', seq: 4, type: 'string' }
  ]
  const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });

  function formatToDateYYYYMMDD(date) {
    return date && moment(date).format("yyyy-MM-DD");
  }

  const fetchData = (criteria: any, pagination: any) => {
    console.info(criteria);
    return axios.post<CatslasReturn<Countable<any>>>(
      `${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-utilization-report/search`,
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
              label={t("Execution Start Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD" />)
        },
        {
          item: (
            <HookedDatePicker
              name="dateTo"
              label={t("Execution End Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD" />)
        },
        {
          item: (
            <HookedSelectField name='imhStatus' label="Overall Status" sx={{ minWidth: "200px" }}>
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"c"}>SUCCESS</MenuItem>
              <MenuItem value={"f"}>FAIL</MenuItem>
              <MenuItem value={"r"}>RUNNING</MenuItem>
            </HookedSelectField>
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
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-utilization-report/export-excel`, {
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
      const fileName = "import-utilization-report-" + moment().format('YYYYMMDDHHmmss') + ".xlsx";
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
        if (value === 'c') return 'SUCCESS'
        if (value === 'f') return 'FAIL'
        return value;
      }}
      defaultValue={{
        dateFrom: null,
        dateTo: null,
        imhStatus: "All"
      }}
    />
  )
}

export default RGR001ResultTable;

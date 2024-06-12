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
import { useEffect,useState} from 'react';

import './RGR008ResultTable.scss';
import { INTELLIGENCE_SHARING_RPT_SERVICE_URL } from 'src/constants';
import { filter, map, sortBy } from 'lodash';

interface dataTemp {
  id: number | string;
  documentClass: string;
  ui: string;
  name: string;
  post: string;
  grantedAccessingTimeFrom: string;
  grantedAccessingTimeTo: string;
  approvedByUi: string;
  approvedBy: string;
  postOfApprovedBy: string;
  approvedDate: string;
  grantedByUi: string;
  grantedBy: string;
  postOfGrantedBy: string;
  grantedDate: string;
}

function RGR008ResultTable() {
  const { t } = useTranslation('userAccountAndAccessControl')

  const [documentClassData, setDocumentClassData] = useState<string[]>(null);

  const resultTableColumns = [
    { name: t('documentClass'), key: 'documentClass', seq: 1, type: 'string' }
    , { name: t('ui'), key: 'ui', seq: 2, type: 'string' }
    , { name: t('name'), key: 'name', seq: 3, type: 'string' }
    , { name: t('post'), key: 'post', seq: 4, type: 'string' }
    , { name: t('grantedAccessingTimeFrom'), key: 'grantedAccessingTimeFrom', seq: 5, type: 'datetime' }
    , { name: t('grantedAccessingTimeTo'), key: 'grantedAccessingTimeTo', seq: 6, type: 'datetime' }
    , { name: t('approvedByUi'), key: 'approvedByUi', seq: 7, type: 'string' }
    , { name: t('approvedBy'), key: 'approvedBy', seq: 8, type: 'string' }
    , { name: t('postOfApprovedBy'), key: 'postOfApprovedBy', seq: 9, type: 'string' }
    , { name: t('approvedDate'), key: 'approvedDate', seq: 10, type: 'datetime' }
    , { name: t('grantedByUi'), key: 'grantedByUi', seq: 11, type: 'string' }
    , { name: t('grantedBy'), key: 'grantedBy', seq: 12, type: 'string' }
    , { name: t('postOfGrantedBy'), key: 'postOfGrantedBy', seq: 13, type: 'string' }
    , { name: t('grantedDate'), key: 'grantedDate', seq: 14, type: 'datetime' }
  ]
  const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });

  function formatToDateYYYYMMDD(date) {
    return date && moment(date).format("yyyy-MM-DD");
  }
  
  const fetchData = (criteria: any, pagination: any) => {
    return axios.post<CatslasReturn<Countable<any>>>(
      `${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-userAccess-report/search`,
      {
        ...criteria,
        ...pagination,
        grantedStartDate:formatToDateYYYYMMDD(criteria.grantedStartDate),
        grantedEndDate:formatToDateYYYYMMDD(criteria.grantedEndDate),
        approvedStartDate:formatToDateYYYYMMDD(criteria.approvedStartDate),
        approvedEndDate:formatToDateYYYYMMDD(criteria.approvedEndDate)
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

  const exportDataToExcel = (criteria: any, pagination: any) => {
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-userAccess-report/export-excel`, {
      ...criteria,
      ...pagination,
      grantedStartDate:formatToDateYYYYMMDD(criteria.grantedStartDate),
      grantedEndDate:formatToDateYYYYMMDD(criteria.grantedEndDate),
      approvedStartDate:formatToDateYYYYMMDD(criteria.approvedStartDate),
      approvedEndDate:formatToDateYYYYMMDD(criteria.approvedEndDate)
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

  const dateFormatterToYYYYMMDD = (value) => {
    if (!value) return "";
    return moment(value).format('yyyy-MM-DD')
  }

  const searchQueryInput = [
    {
      row: [
        {
          item: (
            <HookedSelectField name='documentClass' label="Document Class" sx={{ minWidth: "210px" }}>
              {documentClassData && documentClassData.map((docData, index) => (
              <MenuItem key={index} value={docData}>{docData}</MenuItem>
            ))}
            </HookedSelectField>
          )
        },
        {
          item: (
            <HookedInput
              name="ui"
              label={t("UI of User Name")}
              placeholder={t("Contain")}
            />
          )
        },
        {
          item: (
            <HookedInput
              name='name'
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
      row: [
        {
          item: (
            <HookedInput
              name='grantedBy'
              label={t("Granted By")}
              placeholder={t("Contain")}
            />)
        },
        {
          item: (
            <HookedDatePicker
              name="grantedStartDate"
              label={t("Granted Start Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD" />)
        },
        {
          item: (
            <HookedDatePicker
              name="grantedEndDate"
              label={t("Granted End Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD" />)
        },
      ],
      gridContainerProps: {
        gridClassName: "row"
      },
    },
    {
      row: [
        {
          item: (
            <HookedInput
              name='approvedBy'
              label={t("Approved By")}
              placeholder={t("Contain")}
            />)
        },
        {
          item: (
            <HookedDatePicker
              name="approvedStartDate"
              label={t("Approved Start Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD" />)
        },
        {
          item: (
            <HookedDatePicker
              name="approvedEndDate"
              label={t("Approved End Date")}
              mask="____-__-__"
              inputFormat="YYYY-MM-DD" />)
        },
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


  return (
   <ReportsResult column={resultTableColumnsSorted} tableDataFetch={fetchData}
      rows={searchQueryInput}
      handleExportData={exportDataToExcel}
      renderCell={(value, type, columnKey) => {
        if (type === 'datetime') return moment(value).format('yyyy-MM-DD HH:mm:ss')
        return value;
      }}
      defaultValue={{
        documentClass:"All",
        ui: null,
        name: null,
        grantedBy:null,
        grantedStartDate:null,
        grantedEndDate: null,
        approvedBy: null,
        approvedStartDate:null,
        approvedEndDate:null,
      }}
    />
  );
}

export default RGR008ResultTable;

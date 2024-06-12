import { MenuItem } from '@mui/material';
import moment, { Moment } from 'moment';
import { useTranslation } from 'react-i18next';
import ReportsResult from './ReportsResult';
import HookedDatePicker from 'src/components/HookedDatePicker';
import { CriteriaActions } from 'src/components/CriteriaArea';
import { CatslasReturn, Countable } from 'src/utilities/Utils';
import axios, { AxiosResponse } from 'axios';
import HookedSelectField from 'src/components/HookedSelect';
import { useEffect, useState } from 'react';

import './RGR009ResultTable.scss';
import { INTELLIGENCE_SHARING_RPT_SERVICE_URL } from 'src/constants';
import { map, sortBy } from 'lodash';
interface dataTemp {
  id: number | string;
  documentClass: string;
  retentionPeriod: string;
  extendedRetentionPeriod: string;
  totalSize: string;
  noOfRecords: string;
}

function RGR009ResultTable() {
  const [documentClass, setDocumentClass] = useState<string[]>(null);

  const { t } = useTranslation('archiveRecordSummary')

  const resultTableColumns = [
    { name: t('documentClass'), key: 'documentClass', seq: 1, type: 'string' }
    , { name: t('retentionPeriod'), key: 'retentionPeriod', seq: 2, type: 'string' }
    , { name: t('extendedRetentionPeriod'), key: 'extendedRetentionPeriod', seq: 3, type: 'string' }
    , { name: t('totalSize'), key: 'totalSize', seq: 4, type: 'string' }
    , { name: t('NoOfRecords'), key: 'noOfRecords', seq: 5, type: 'string' }
  ]
  const resultTableColumnsSorted = sortBy(resultTableColumns, function (o) { return o.seq });

  const fetchData = (criteria: any, pagination: any) => {
    console.info(criteria);
    return axios.post<CatslasReturn<Countable<any>>>(
      `${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-retrieveRecord-report/search`,
      {
        ...criteria,
        ...pagination
      });
  }

  function loadDocumentClass() {
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/document-classes/get-all-document-class`,{
      requestFrom: "reports"
    }
    ).then((response) => {
      setDocumentClass(response.data.result);
    })
      .catch((error) => {
        console.log(error.response);
      });
  }
  useEffect(() => {
    loadDocumentClass();
  }, [])

  const exportDataToExcel = (criteria: any, pagination: any) => {
    axios.post(`${INTELLIGENCE_SHARING_RPT_SERVICE_URL}/api/v1/log-report/import-retrieveRecord-report/export-excel`, {
      ...criteria,
      ...pagination,
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
              
              {documentClass && documentClass.map((docData, index) => (
                <MenuItem key={index} value={docData}>{docData}</MenuItem>
              ))}

            </HookedSelectField>
          )
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


  return (
    <ReportsResult column={resultTableColumnsSorted} tableDataFetch={fetchData}
      rows={searchQueryInput}
      handleExportData={exportDataToExcel}
      renderCell={(value, type, columnKey) => {
        return value;
      }}
      defaultValue={{
        documentClass: "All"
      }}
    />
  );
}

export default RGR009ResultTable;


import { Button, Card, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { AxiosResponse } from 'axios';
import { map, sortBy } from 'lodash';
import moment from 'moment';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CriteriaArea, { CriteriaAreaProps } from 'src/components/CriteriaArea';

import EnhancedTableHead from 'src/components/EnhancedTableHead';
import { SetPageLoaderContext } from 'src/components/GlobalPageLoader/GlobalPageLoaderContext';
import HookedDatePicker from 'src/components/HookedDatePicker';
import { TableHeader } from 'src/components/Table';
import { DEFAULT_ROWS_PER_PAGE, DEFAULT_ROWS_PER_PAGE_OPTIONS } from 'src/constants';
import { CatslasReturn, Countable, Order } from 'src/utilities/Utils';

type PaginationParam = { offset: number, limit: number, order: Order, orderBy: string };

interface TestReportProps {
  column: TableColumn[];
  // onSearchClick: (criteria: any) => void;
  tableDataFetch: <T = any>(criteria: any, pagination?: PaginationParam) => Promise<AxiosResponse<CatslasReturn<Countable<any>>>>;
  rows: CriteriaAreaProps["rows"];
  handleExportData?: (criteria: any, pagination: any) => void;
  renderCell?: (value: string, type: string, columnKey: string) => string;
  defaultValue?: any;
}
interface TableColumn {
  name: string;
  key: string;
  seq: number;
  type: string;
}

export const ReportsResult = ({ column, tableDataFetch, rows, handleExportData, renderCell, defaultValue }: TestReportProps) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const [dataTemp, setDataTemp] = useState<any[]>(null);
  const [count, setCount] = useState<number>(0);
  const offset = limit * page;
  const criteriaRef = useRef<{ getValues: () => any }>();
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("");

  const sortableColunmn = column.map(head => ({ id: head.key, label: head.name, canOrder: true }));

  const globalPageLoadSetter = useContext(SetPageLoaderContext);

  const { t } = useTranslation('importSummaryReport')

  const resultTableColumnsSorted = sortBy(column, function (o) { return o.seq });

  const dataFetch = (criteria: any, pagination: PaginationParam = { offset: 0, limit: DEFAULT_ROWS_PER_PAGE, order: "asc", orderBy: "id" }) => {
    globalPageLoadSetter(true);
    tableDataFetch({ ...criteria }, { ...pagination })
      .then(response => {
        const { total, ...restData } = response.data.result;
        // toBeFix: not strong enough
        setDataTemp(Object.values(restData)[0]);
        setCount(total);
      })
      .finally(() => globalPageLoadSetter(false));
  }
  const handlePageChange = (_: unknown, newPage: number): void => {
    setPage(newPage);
    const newOffset = newPage * limit;
    console.info("fetching data with new page", newPage);
    dataFetch({ ...criteriaRef.current.getValues() }, { offset: newOffset, limit, order, orderBy });
  }

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newLimit = parseInt(event.target.value);
    setLimit(newLimit);
    console.info("fetching data with new limit", newLimit);
    dataFetch({ ...criteriaRef.current.getValues() }, { offset, limit: newLimit, order, orderBy });
  };

  const getCellDisplay = (value, type, columnKey) => {
    if (renderCell && typeof renderCell === "function") {
      return renderCell(value, type, columnKey);
    }
    if (type === 'boolean') return value ? 'Yes' : 'No'
    if (type === 'date') return moment(value).format('yyyy-MM-DD')
    if (type === 'datetime') return moment(value).format('yyyy-MM-DD HH:mm:ss')
    return value
  }

  const handleRequestSort = (_: unknown, property: string) => {
    const isAsc = orderBy === property && order !== "asc";
    const newOrder = isAsc ? "asc" : "desc";
    dataFetch({ ...criteriaRef.current.getValues() }, { offset, limit, order: newOrder, orderBy: property });
    setOrder(newOrder);
    setOrderBy(property);
  }
  const handleSearchClick = (data: any) => {
    globalPageLoadSetter(true);
    tableDataFetch({ ...data }, { offset: 0, limit, order, orderBy })
      .then((res) => {
        const { total, ...searchData } = res.data.result;
        // toBeFix: not strong enough
        setDataTemp(Object.values(searchData)[0]);
        setCount(total);
      })
      .finally(() => globalPageLoadSetter(false));
  }

  useEffect(() => {
    globalPageLoadSetter(true);
    
    tableDataFetch({}, { offset: 0, limit: limit, order, orderBy })
      .then(response => {
        const { total, ...data } = response.data.result;
        // toBeFix: not strong enough
        setDataTemp(Object.values(data)[0]);
        setCount(total);
      })
      .finally(() => globalPageLoadSetter(false));
  }, [])

  return (
    <Card id="rgr002" >
      <CriteriaArea rows={rows} defaultValues={defaultValue} onSubmit={handleSearchClick} ref={criteriaRef} />
      <Grid container className='row' sx={{ marginTop: 1}}>
        <Grid item>
          <Button 
            variant="contained"
            sx={{
               marginLeft: '20px',
               padding: '8px 16px',
               marginBottom: '20px' }}
            onClick={() => handleExportData?.({ ...criteriaRef.current.getValues() }, {order, orderBy})}
          >
            {t('exportExcel')}
          </Button>
        </Grid>
        <Grid item sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "40px" }}>
          <div>
            <TablePagination
              component="div"
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              count={count}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_OPTIONS}
            />
          </div>
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={sortableColunmn}
          />
          <TableBody>
            {
              map(dataTemp, (d) => (
                <TableRow
                  hover
                  key={d.id}
                >
                  {
                    map(resultTableColumnsSorted, function (o) {
                      return (
                        <TableCell key={o.key}>
                          <Typography
                            variant="body1"
                            color="text.primary"
                            gutterBottom
                            noWrap
                          >
                            {getCellDisplay(d[o.key], o.type, o.key)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                          </Typography>
                        </TableCell>
                      );
                    })
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default ReportsResult;

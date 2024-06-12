import { Search } from '@mui/icons-material';
import { Button, Box, Tooltip, useTheme, IconButton, Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableContainer, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import PageLoader from 'src/components/PageLoader';
import './RetrieveReportsResultTable.scss'
import { TableHeader } from 'src/components/Table';
import { filter, findIndex, map, sortBy } from 'lodash';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import EnhancedTableHead from 'src/components/EnhancedTableHead';
import { Order } from 'src/utilities/Utils';
import React from 'react';
import { useNavigate } from 'react-router';

function RetrieveReportsResultTable(props) {

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("")
  const { t } = useTranslation('retrieveReports')

  const columns = [
    { name: t('reportId'), key: 'rptId', seq: 1, type: 'string' }
    , { name: t('reportName'), key: 'rptName', seq: 2, type: 'string' }
    , { name: t('action'), key: 'action', seq: 2 }
  ]

  const navigate = useNavigate();
  const columnsSorted = sortBy(columns, function (o) { return o.seq });

  const header = columnsSorted.map((colunm) => {
    return {
      id: colunm.key,
      label: colunm.name,
      canOrder: true,
    }
  });

  const theme = useTheme();

  const getCellDisplay = (value, type, columnKey) => {
    // if(!value)return
    // if(columnKey === 'userGroupIdList') return join(map(value,(i)=>{return find(userGroupList,{id: i})['description']}),', ')
    // if(type === 'boolean') return value ? 'Yes' : 'No'
    // if(columnKey === 'reportId' && value != "") {
    //   return <Button variant="text" onClick={() => {
    // props.setSelectedRpt(value);
    //     }}>{value}</Button>;
    // }
    return value;
  }
  function sort(orderBy, order) {

    const { test } = props;
    // 在处理排序请求的地方调用onRequestSort
    test(order, orderBy);

  }

  return (
    <Card id="retrieve-reports" >
      <Container maxWidth={false} disableGutters sx={{ paddingLeft: "27px", paddingRight: "10px" }} className='search-container'>
        <Grid container className='row'>
          <TableContainer>
            <Table>
              <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={(event, property) => {
                setOrderBy(property)
                if (order === "asc") {
                  setOrder('desc');
                } else {
                  setOrder('asc');
                }
                sort(orderBy, order)
              }} headCells={header} />
              <TableBody>
                {
                  map(props.reportMap, (m) => (
                    <TableRow
                      hover
                      key={m.rptId}
                    >
                      {map(columnsSorted, function (o) {
                        return (
                          <TableCell key={o.key}>
                            <Typography
                              variant="body1"
                              color="text.primary"
                              gutterBottom
                              noWrap
                            >
                              {getCellDisplay(m[o.key], o.type, o.key)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                            </Typography>
                          </TableCell>
                        );
                      })}
                      {<TableCell align="left" sx={{ width: "100px" }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '30px 30px', marginRight: 6 }}>
                          {
                            <Tooltip title="View" arrow>
                              <IconButton
                                sx={{
                                  '&:hover': {
                                    background: theme.colors.primary.lighter
                                  },
                                  color: theme.palette.primary.main
                                }}
                                color="inherit"
                                size="small"
                                onClick={() => {
                                  navigate(m["rptId"]);
                                }}
                              >
                                <ContentPasteSearchIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          }
                        </Box>
                      </TableCell>}
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Container>
    </Card>
  );
}

export default RetrieveReportsResultTable;

import { Card } from '@mui/material';
import RetrieveReportsResultTable from './RetrieveReportsResultTable';
import {useState } from 'react';


function RetrieveReportsResult(props) {
  return (
    <Card>
      <RetrieveReportsResultTable reportMap={props.reportMap} />
    </Card>
  );
}

export default RetrieveReportsResult;

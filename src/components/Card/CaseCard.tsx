import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CaseTabs from '../Tab/CaseTab';

const CaseCard = () => {
  return (
    <Card sx={{ pt:1, pb:1, pr:2, pl: 2, borderRadius: '16px', minWidth: 200, minHeight: 100, top: 180,}}>
      <CardContent>
        <CaseTabs/>
      </CardContent>
    </Card>
  );
};

export default CaseCard;
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import CaseTabs from '../Tab/CaseTab';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import TabList from '@mui/lab/TabList';
// import LastModifiedCaseTabs from '../Tab/LastModifiedCaseTabs';
import { LastModifiedCaseCardProps } from './LastModifiedCaseCard.types';

const LastModifiedCaseCard = ({
  id,
  name,
  text,
}: LastModifiedCaseCardProps) => {

  return (
    <Card sx={{ pt:1, pb:1, pr:2, pl: 2, borderRadius: '16px', width: 288, height: 160,
    top: 180}}>
        <Typography sx={{ fontSize: 16, fontWeight:300 }} color="#333D47" margin={0} gutterBottom>
          {name}
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:300 }} color="#333D47" margin={0} gutterBottom>
          {text}
        </Typography>
    </Card>
  );
};

export default LastModifiedCaseCard;
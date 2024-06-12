import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import BITabs from '../Tab/BITabs';


const BICard = () => {
 return (
   <Card sx={{ pt:2, pb:2, pr:1, pl: 1, borderRadius: '16px', height: 450, position: 'relative',
   left:14,
   zIndex:2}}>
     <CardContent>
       <Typography sx={{ fontSize: "16px", fontWeight:500, }} color="#333D47" gutterBottom>
       BI Tool (Demo)
       </Typography>
       <BITabs/>
     </CardContent>
   </Card>
 );
};


export default BICard;

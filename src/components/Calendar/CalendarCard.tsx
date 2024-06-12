import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicTabs from '../Tab/BasicTabs';

const CalendarCard = () => {
  return (
    <Card sx={{ pt:2, pb:2, pr:1, pl: 1, borderRadius: '16px', height: 860, minWidth: 280, minHeight: 100,position: 'absolute',
    top: 90,
    left: '66%',
    zIndex:2}}>
      <CardContent>
        <Typography sx={{ fontSize: "16px", fontWeight:500, }} color="#333D47" gutterBottom>
        To-do Task List
        </Typography>
        <BasicTabs/>
        {/* <Typography variant="h5" component="div">
          belent
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
};

export default CalendarCard;
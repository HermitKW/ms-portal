import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts';


const chartSetting = {
 yAxis: [
   {
     label: 'frequency (time(s))',
   },
 ],
 width: 360,
 height: 300,
 sx: {
   [`.${axisClasses.left} .${axisClasses.label}`]: {
     transform: 'translate(-10px, 0)',
   },
 },
};
const aData = [59, 50, 47, 54, 57, 60, 59, 65, 51, 60, 67, 61];
const bData = [57, 52, 53, 56, 69, 63, 60, 60, 51, 65, 64, 70];
const cData = [86, 78, 106, 92, 92, 103, 105, 106, 95, 97, 76, 103];
const dData = [21, 28, 41, 73, 99, 144, 319, 249, 131, 55, 48, 25];
const xLabels = [
 'Jan',
 'Feb',
 'Mar',
 'Apr',
 'May',
 'Jun',
 'Jul',
 'Aug',
 'Sep',
 'Oct',
 'Nov',
 'Dec',
];


const valueFormatter = (value: number | null) => `${value}time(s)`;


const SimpleLineChart = () => {
 return (
   <LineChart
     series={[
       { data: aData, label: 'Case A',valueFormatter },
       { data: bData, label: 'Case B',valueFormatter },
       { data: cData, label: 'Case C',valueFormatter },
       { data: dData, label: 'Case D',valueFormatter },
     ]}
     xAxis={[{ scaleType: 'point', data: xLabels }]}
     {...chartSetting}
   />
 );
}


export default SimpleLineChart;

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';


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
const dataset = [
 {
   caseA: 59,
   caseB: 57,
   caseC: 86,
   caseD: 21,
   month: 'Jan',
 },
 {
   caseA: 50,
   caseB: 52,
   caseC: 78,
   caseD: 28,
   month: 'Fev',
 },
 {
   caseA: 47,
   caseB: 53,
   caseC: 106,
   caseD: 41,
   month: 'Mar',
 },
 {
   caseA: 54,
   caseB: 56,
   caseC: 92,
   caseD: 73,
   month: 'Apr',
 },
 {
   caseA: 57,
   caseB: 69,
   caseC: 92,
   caseD: 99,
   month: 'May',
 },
 {
   caseA: 60,
   caseB: 63,
   caseC: 103,
   caseD: 144,
   month: 'June',
 },
 {
   caseA: 59,
   caseB: 60,
   caseC: 105,
   caseD: 319,
   month: 'July',
 },
 {
   caseA: 65,
   caseB: 60,
   caseC: 106,
   caseD: 249,
   month: 'Aug',
 },
 {
   caseA: 51,
   caseB: 51,
   caseC: 95,
   caseD: 131,
   month: 'Sept',
 },
 {
   caseA: 60,
   caseB: 65,
   caseC: 97,
   caseD: 55,
   month: 'Oct',
 },
 {
   caseA: 67,
   caseB: 64,
   caseC: 76,
   caseD: 48,
   month: 'Nov',
 },
 {
   caseA: 61,
   caseB: 70,
   caseC: 103,
   caseD: 25,
   month: 'Dec',
 },
];


const valueFormatter = (value: number | null) => `${value}time(s)`;


const BarsDataset = () => {
 return (
   <BarChart
     dataset={dataset}
     xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
     series={[
       { dataKey: 'caseA', label: 'HKI Case', valueFormatter },
       { dataKey: 'caseB', label: 'KLN Case', valueFormatter },
       { dataKey: 'caseC', label: 'NT Case', valueFormatter },
/*        { dataKey: 'caseD', label: 'Case D', valueFormatter },
 */     ]}
     {...chartSetting}
   />
 );
}


export default BarsDataset;

import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import BarsDataset from '../Chart/BarsDataset';
import SimpleLineChart from '../Chart/SimpleLineChart';
// import styled from "styled-components";




const BITabs= () => {
 const [value, setValue] = React.useState('1');


 const handleChange = (event: React.SyntheticEvent, newValue: string) => {
   setValue(newValue);
 };


 return (
   <Box sx={{ width: '100%', typography: 'body1' }}>
     <TabContext value={value}>
       <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
         <TabList onChange={handleChange} aria-label="lab API tabs example">
           <Tab sx={{fontSize: '14px',}}label="Case Amount" value="1" />
           <Tab sx={{fontSize: '14px',}}label="Case Trend" value="2" />
           {/* <Tab label=" " value="3" /> */}
         </TabList>
       </Box>
      
       <TabPanel value="1" sx={{p:0}}>
       <Box sx={{ height:16, justifyItems:"center", alignItems:"center"}}>
   </Box>
       <BarsDataset/>
       </TabPanel>


       <TabPanel value="2" sx={{p:0}}>
       <Box sx={{ height:16, justifyItems:"center", alignItems:"center"}}>
   </Box>
       <SimpleLineChart/>
       </TabPanel>
       {/* <TabPanel value="3"></TabPanel> */}
     </TabContext>
   </Box>
 );
};


export default BITabs;


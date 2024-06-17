import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { ReactComponent as OrangeDot } from "../../assets/orange dot.svg";
// import dayjs from 'dayjs';
import { Typography } from '@mui/material';
import styled from "styled-components";
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import { ReactComponent as BlueLine } from "../../assets/blue line.svg";

const StyledRemiderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  gap: 0.5rem;

`

const StyledCaseListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

`

const StyledCaseContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: left;
  gap: 6px;

`
const StyledTypoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  gap: 4px;

`
const BasicTabs= () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab sx={{fontSize: '18px',}}label="Team" value="1" />
           {/*  <Tab sx={{fontSize: '18px',}}label="Me" value="2" /> */}
            {/* <Tab label=" " value="3" /> */}
          </TabList>
        </Box>
        
        <TabPanel value="1">
        <DemoItem label="">
  <DateCalendar />
</DemoItem>
        <StyledRemiderContainer>
        <OrangeDot/>
        <Typography mt={3} padding={0} margin={0} sx={{fontSize: 16, fontWeight:400}} >You have a total of 1 overdue cases.</Typography>
        </StyledRemiderContainer>
        <Box sx={{ p: 2 }}>
        <Divider />

      <StyledCaseListContainer>
        <Card sx={{ borderRadius: '8px', border: 2, borderColor: '#F3F3F3', boxShadow: 0 , width: 290, height: 104, position: 'absolute',
    top: 540,
    left: '15%',
     }}
     
     >
      <CardContent sx={{ pt:1, pb:1, pr:1, pl: 1}}>
      <StyledCaseContainer>
        <OrangeDot/>
        <StyledTypoContainer>
        <Typography sx={{ fontSize: 16, fontWeight:500 }} color="#333D47" margin={0} gutterBottom>
        K23600888
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:300 }} color="#848A90" margin={0} gutterBottom>
        Case Transferred from CMIS
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:300 }} color="#848A90" margin={0} gutterBottom>
        Due Date: 2024:05:02
        </Typography>
        </StyledTypoContainer>
        </StyledCaseContainer>
        </CardContent>
    </Card>

    <Card sx={{ borderRadius: '8px', border: 2, borderColor: '#F3F3F3', boxShadow: 0 , width: 290, height: 104, position: 'absolute',
    top: 660,
    left: '15%',
     }}
     
     >
      <CardContent sx={{ pt:1, pb:1, pr:1, pl: 1}}>
      <StyledCaseContainer>
        <BlueLine/>
        <StyledTypoContainer>
        <Typography sx={{ fontSize: 16, fontWeight:500 }} color="#333D47" margin={0} gutterBottom>
        K24000007
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:300 }} color="#848A90" margin={0} gutterBottom>
        Case Transferred from CMIS
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:300 }} color="#848A90" margin={0} gutterBottom>
        Due Date: 2024:08:30
        </Typography>
        </StyledTypoContainer>
        </StyledCaseContainer>
        </CardContent>
    </Card>

    <Card sx={{ borderRadius: '8px', border: 2, borderColor: '#F3F3F3', boxShadow: 0 , width: 290, height: 104, position: 'absolute',
    top: 780,
    left: '15%',
     }}
     
     >
      <CardContent sx={{ pt:1, pb:1, pr:1, pl: 1}}>
      <StyledCaseContainer>
        <BlueLine/>
        <StyledTypoContainer>
        <Typography sx={{ fontSize: 16, fontWeight:500 }} color="#333D47" margin={0} gutterBottom>
        K24000008
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:300 }} color="#848A90" margin={0} gutterBottom>
        Case Transferred from CMIS
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:300 }} color="#848A90" margin={0} gutterBottom>
        Due Date: 2024:09:01
        </Typography>
        </StyledTypoContainer>
        </StyledCaseContainer>
        </CardContent>
    </Card>
</StyledCaseListContainer>
        </Box>
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        {/* <TabPanel value="3"></TabPanel> */}
      </TabContext>
    </Box>
  );
};

export default BasicTabs;
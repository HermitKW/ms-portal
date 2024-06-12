import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { ReactComponent as OrangeDot } from "../../assets/orange dot.svg";
import dayjs from 'dayjs';
import { Typography } from '@mui/material';
import styled from "styled-components";
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';

const StyledCaseFileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: left;
  gap: 6px;

`
const StyledTypoTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  gap: 4px;

`
const LastModifiedCaseTabs= () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab sx={{fontSize: '14px'}}label="Last handling Case" value="1" />
            {/* <Tab sx={{fontSize: '14px',}}label="Me" value="2" /> */}
            {/* <Tab label=" " value="3" /> */}
          </TabList>
        </Box>
        
        <TabPanel value="1"> 
        <Card sx={{ alignItems: "center", borderRadius: '8px', border: 2, borderColor: '#F3F3F3', boxShadow: 0, minWidth: 50, minHeight: 10,
                    top: 120,
                    left: "10%",
                  }}
        >
      <CardContent sx={{ pt:1, pb:1, pr:1, pl: 1}}>
      <StyledCaseFileContainer>
        <OrangeDot/>
        <StyledTypoTitleContainer>
        <Typography sx={{ fontSize: 16, fontWeight:500 }} color="#333D47" margin={0} gutterBottom>
        K24000002
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:300 }} color="#848A90" margin={0} gutterBottom>
        Full Investigation Report
        
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:500 }} color="#333D47" margin={0} gutterBottom>
        CAPO Team: K1a
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:500 }} color="#333D47" margin={0} gutterBottom>
        Received Date: 2024:05:01
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight:500 }} color="#333D47" margin={0} gutterBottom>
        Last Modified Date: 2024:05:22
        </Typography>

        </StyledTypoTitleContainer>
        </StyledCaseFileContainer>
        </CardContent>
    </Card>

        {/* </Box> */}
        </TabPanel>
        {/* <TabPanel value="2">Item Two</TabPanel> */}
        {/* <TabPanel value="3"></TabPanel> */}
      </TabContext>
    </Box>
  );
};

export default LastModifiedCaseTabs;
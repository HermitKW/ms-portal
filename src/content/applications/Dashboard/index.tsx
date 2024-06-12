import { ReactComponent as CaseIcon } from "../../../assets/Briefcase.svg";
import { ReactComponent as DocumentSearchIcon } from "../../../assets/Database Search.svg";
import { ReactComponent as PersonNoteIcon } from "../../../assets/Person Note.svg";
import { ReactComponent as NotepadIcon } from "../../../assets/Notepad Person.svg";
import { ReactComponent as DatabaseSearchIcon } from "../../../assets/Database Search.svg";
import { ReactComponent as DataTrendingIcon } from "../../../assets/Data Trending.svg";
import { ReactComponent as NotebookIcon } from "../../../assets/Notebook.svg";
import  BISample  from "../../../assets/BI_sample.png";
import FunctionCard from '../../../components/Card/FunctionCard';
import CaseCard from '../../../components/Card/CaseCard';
import * as React from 'react';
import  Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { ReactComponent as ReportsIcon } from "../../../assets/Document Landscape Data.svg";
import CalendarCard from '../../../components/Calendar/CalendarCard';
import SearchField from '../../../components/Input/SearchField';
import LastModifiedCaseCard from "src/components/Card/LastModifiedCaseCard";
import { maxWidth } from "@mui/system";
import BICard from "../../../components/Card/BICard"

const Dashboard = () =>{

    return(
        <div>
          <Box component="main" sx={{ flexGrow: 1, p: 0, backgroundColor:"#EFF7FF", width:"100%", height:"100%", justifyContent: "center", alignItems:"center" }}>
            <Grid container spacing={1} sx={{ alignItems:"center" }}>
              <Grid item xs={12} sm={0.6}/>
                <Grid item xs={12} sm={11.4} sx={{justifyContent: "center", alignItems:"center" }}>
                  <SearchField/>
                </Grid>
              </Grid>

          <Box >
            <Grid container xs={12} sm={12} sx={{ alignItems:"center" ,pt:3, pb:3}}>
              <Grid item xs={12} sm={0.6}/>
              <Grid item xs={12} sm={0.1} sx={{justifyContent: "center", alignItems:"center" }}/>
{/*                 <Grid item xs={12} sm={2.4} sx={{justifyContent: "center", alignItems:"center" }}>
 */}                  <CaseCard/>
{/*                 </Grid>
      */}     <Grid item xs={12} sm={4.5} sx={{justifyContent: "center", alignItems:"center", paddingLeft:"2rem"}}>
                <Box sx={{ backgroundColor:"white", borderRadius:"16px", justifyItems:"center", alignItems:"center"}}>
                  <LastModifiedCaseCard/>
                </Box>
              </Grid>
                <Grid item xs={12} sm={4} sx={{justifyContent: "center", alignItems:"center" }}>
                  <CalendarCard/>
                </Grid>
              </Grid>

              
    <Grid container xs={5} sm={8} md={8} spacing={6} sx={{ alignItems:"center", marginLeft:"3vw", marginTop:"0"}} >

      <Grid item xs={12} sm={2.5} sx={{justifyContent: "center", alignItems:"center" }}>
        <FunctionCard     
          id={"report"}
          text={"SITREP Reports"}
          >
            <ReportsIcon/>
          </FunctionCard>
      </Grid>

      <Grid item xs={12} sm={2.5} md={2.5} sx={{justifyContent: "center", alignItems:"center" }}>
        <FunctionCard     
          id={"Case"}
          text={"Case Management"}
          >
            <CaseIcon/>
          </FunctionCard>
          </Grid>

      <Grid item xs={12} sm={2.5} md={2.5} sx={{justifyContent: "center", alignItems:"center" }}>
        <FunctionCard     
          id={"Document Search"}
          text={"CAPO Investigation Report Record Enquiry"}
          >
            <DocumentSearchIcon/>
          </FunctionCard>
          </Grid>

          <Grid item xs={12} sm={2.5} md={2.5} sx={{justifyContent: "center", alignItems:"center" }}>
        <FunctionCard     
          id={"Person Note"}
          text={"Complaint Record Check"}
          >
            <PersonNoteIcon/>
          </FunctionCard>
          </Grid>


          <Grid item xs={12} sm={2.5} md={2.5} sx={{justifyContent: "center", alignItems:"center" }}>
        <FunctionCard     
          id={"Notepad"}
          text={"Review of Complainee Record"}
          >
            <NotepadIcon/>
          </FunctionCard>
          </Grid>
      <Grid item xs={12} sm={2.5} md={2.5} sx={{justifyContent: "center", alignItems:"center" }}>
        <FunctionCard     
          id={"Database Search"}
          text={"CAPO Case Enquiry"}
          >
            <DatabaseSearchIcon/>
          </FunctionCard>
          </Grid>

          <Grid item xs={12} sm={2.5} md={2.5} sx={{justifyContent: "center", alignItems:"center" }}>
        <FunctionCard     
          id={"Notebook"}
          text={"Reporting"}
          >
            <NotebookIcon/>
          </FunctionCard>
          </Grid>

          <Grid item xs={12} sm={2.5} md={2.5} sx={{justifyContent: "center", alignItems:"center" }}>
        <FunctionCard     
          id={"Data Trending"}
          text={"Data Analytic Tool"}
          >
            <DataTrendingIcon/>
          </FunctionCard>
          </Grid>

          

          <Grid item xs={12} sm={12} md={9} sx={{justifyContent: "center", alignItems:"center" }}>
            <BICard></BICard>
          </Grid>
          </Grid>
          </Box>

          <Box sx={{ p: 2 }}>
          </Box>
</Box>
</div>
    );
};

export default Dashboard;

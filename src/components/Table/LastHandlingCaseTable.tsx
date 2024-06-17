import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import styled from 'styled-components';
import LastModifiedCaseCard from '../Card/LastModifiedCaseCard';
import Typography from '@mui/material/Typography';

const StyledLastHandlingTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
`

const StyledLastHandlingHeaderContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: left;
  wdith: 580px;
  padding: 10px 10px 0 16px;
  margin: 0;
  background-color: #CFE7FE;
  border-radius: 0;
`

const StyledLastHandlingRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  padding:16px;
  gap: 16px;
` 


const LastHandlingCaseTable = () => {
  return (
    <Card sx={{ pb:0, borderRadius: '12px', height: 420, width: 580, position: "relative", zIndex:0,}}>
      <CardContent sx={{ p:0, m:0}}>
      <StyledLastHandlingTableContainer>
        <StyledLastHandlingHeaderContainer>
        <Typography sx={{ fontSize: 18, fontWeight:500 }} color="#333D47" margin={0}>
            Last Handling Cases
          </Typography>
        </StyledLastHandlingHeaderContainer>

        <StyledLastHandlingRowContainer>
        <LastModifiedCaseCard
              id={ "RC" }
              name={ "Case Type: RC" }
              text={"RN Number: KN200000"}/>
              <LastModifiedCaseCard
              id={ " NC" }
              name={ "Case Type: NC" }
              text={"RN Number: KN200000"}/>
              </StyledLastHandlingRowContainer>
              <StyledLastHandlingRowContainer>
        <LastModifiedCaseCard
              id={ "MIS" }
              name={ "Case Type: MIS" }
              text={"RN Number: KN200000"}/>
              
              <LastModifiedCaseCard
              id={ "Case Type: MIS(EDM)" }
              name={ "Case Type: MIS(EDM)" }
              text={"RN Number: KN200000"}/>
          </StyledLastHandlingRowContainer>
          </StyledLastHandlingTableContainer>
      </CardContent>
    </Card>
  );
};
   

export default LastHandlingCaseTable;
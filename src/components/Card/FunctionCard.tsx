import * as React from 'react';
import Card from '@mui/material/Card';
import { ReactComponent as ArrowIcon } from "../../assets/arrow.svg";
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FunctionCardProps } from './FunctionCard.types';
import FontIconButton from '../Button/FontIconButton';
import styled from 'styled-components';

const StyledCardIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 70px;
`

const StyledFunctionCardContainer = styled.div`
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
  border-radius: 12px; 
  flex-wrap: wrap
`

const StyledFunctionCardTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  border-radius: 0 0;
  padding-left:16px;
  padding-right:16px;
  background-color: #CFE7FE;
  min-width: 13vw;
` 

const FunctionCard = ({
    id,
    text,
    children,
  }: FunctionCardProps) => {
  return (
    <Card sx={{ pb:0, borderRadius: '12px', height: 148, minWidth: 188, minHeight: 156,position: "relative", zIndex:0,


     }}>
      <CardContent sx={{ p:0, m:0}}>
      <StyledFunctionCardContainer>
        <StyledCardIconContainer>
        {children}
        </StyledCardIconContainer>
        <StyledFunctionCardTextContainer>
        <Typography sx={{ minWidth:140, minHeight:32,pl:1.5, alignItems:"center", m:0, fontSize: 12, fontWeight:500, position:"relative", }} color="#24245F" gutterBottom>
        {text}
        </Typography>
        <FontIconButton
            id={"arrow"}
            ariaLabel="arrow"
            onClick={() => console.log("arrow")}
          >
            <ArrowIcon/>
          </FontIconButton>
          </StyledFunctionCardTextContainer>
          </StyledFunctionCardContainer>
      </CardContent>
    </Card>
  );
};

export default FunctionCard;
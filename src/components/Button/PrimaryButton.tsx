import { Button, styled } from "@mui/material";
import React from "react";
import { PrimaryButtonProps } from "./PrimaryButton.types";

const StyledButton = styled(Button)`
  background-color: #FCFCFC;
  color: #333D47;
  display: flex;
  align-items: center;
  height: 44px;
  width: 44px;
  padding: 0;

  font-size: 11px;
  text-align: center;
  letter-spacing: 0.39px;
  text-transform: uppercase;
  font-weight: bold;

  &:hover {
    background-color: #1976D2;
    color: #FFFFFF;
    box-shadow: none;
  }
`;

const PrimaryButton = ({ text, id, onClick, ...props }: PrimaryButtonProps) => {
  return (
    <StyledButton
      id={id}
      type="submit"
      variant="contained"
      disableElevation
      onClick={onClick}
      {...props}
    >
      {text}
    </StyledButton>
  );
};

export default PrimaryButton;
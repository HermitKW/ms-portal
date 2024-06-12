import { IconButton, styled } from "@mui/material";
import React from "react";
import { FontIconButtonProps } from "./FontIconButton.types";

const StyledIconButton = styled(IconButton)`
  display: flex;
  align-items: center;
  height: 44px;
  width: 44px;
`;



const StyledFontSvgContainer = styled("div")`
  display: flex;
  margin-top: 5px;
  circle {
    fill: ${(props) => props.theme.palette.primary.contrastText};
  }
  path {
    fill: #333D47;
  }

  &:hover circle {
    fill: ${(props) => props.theme.palette.primary.main};
  }
  &:hover path {
    fill: ${(props) => props.theme.palette.primary.contrastText};
  }
`;

const FontIconButton = ({
  id,
  ariaLabel,
  onClick,
  children,
  ...props
}: FontIconButtonProps) => {
  return (
    <StyledIconButton
      id={id}
      aria-label={ariaLabel}
      type="button"
      onClick={onClick}
      {...props}
    >
      <StyledFontSvgContainer>{children}</StyledFontSvgContainer>
    </StyledIconButton>
  );
};

export default FontIconButton;

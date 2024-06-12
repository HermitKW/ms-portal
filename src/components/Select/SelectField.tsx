import { MenuItem, Select, styled } from "@mui/material";
import React from "react";
import { SelectFieldProps } from "./SelectField.type";

const StyledContainer = styled("div")``;
// const StyledLabel = styled("p")`
//   color: #9D9D9D;
//   font-size: 12px;
//   text-align: left;
//   margin-bottom: 8px; //temp style
// `;
const StyledPlaceHolder = styled("div")`
  font-style: Inter;
  color: #333D47;
  font-size: 200;
  opacity: 0.4;
`;

const StyledError = styled("div")`
  color: #E66037;
`;

const StyledMenuItem = styled(MenuItem)`
  &:focus {
    color: ${(props) => props.theme.palette.primary.main};
    font-weight: bold;
  }
`;

const SelectField = ({
  // label,
  name,
  id,
  data,
  placeholder,
  value,
  onChange,
  error,
  ...props
}: SelectFieldProps) => {
  return (
    <StyledContainer>
      {/* <StyledLabel>{label}</StyledLabel> */}

      <Select
        {...props}
        displayEmpty
        id={id}
        name={name}
        variant="standard"
        value={value}
        onChange={onChange}
        sx={{ width: "200px" }}
        renderValue={
          value !== ""
            ? undefined
            : () => <StyledPlaceHolder>{placeholder}</StyledPlaceHolder>
        }
      >
        {data.map((item, index) => {
          return (
            <StyledMenuItem key={index} value={item.value}>
              {item.name}
            </StyledMenuItem>
          );
        })}
      </Select>
      {error ? <StyledError>{error}</StyledError> : null}
    </StyledContainer>
  );
};

export default SelectField;

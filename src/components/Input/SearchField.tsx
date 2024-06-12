import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';


const SearchField = () =>{
  return (
    <Paper
      component="form"
      sx={{  width:'20vw', height: 48, p: '2px 4px', display: 'flex', alignItems: 'center', }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search RN"
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>

  );
};

export default SearchField;
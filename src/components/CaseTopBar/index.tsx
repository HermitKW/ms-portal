import { Box, AppBar, Button } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';

const CaseTopBar = ({ onCaseDetailsSave }) => { 

  const navigate = useNavigate();
  const goToLogin = useNavigateWithLocale("login");

  const goToMenu = () => {
    goToLogin();
    return <Navigate to={"login"}/>; 
  }

  return (
    <AppBar position="relative" style={{backgroundColor: "#FFFFFF", border: '1px solid', borderRadius: '6px', zIndex: "999", height: '72px', padding: '16px' }} sx={{ paddingLeft: { sm: 5, md: 5 }}}>
          <Box sx={{ position: "absolute" }}>
            <Button sx={{ width: '185px', height: '40px', border: '1px solid', borderRadius:'6px', borderBlockColor:'#CBE0E8',color:'#052C42', padding: '8px, 14px, 8px, 14px' }}
              onClick={goToMenu}
            >Menu</Button>
          </Box>
          <Box sx={{ position: "absolute", right: '385px' }}>
            <Button sx={{ width: '169px', height: '40px', border: '1px solid', borderRadius:'6px', borderBlockColor:'#CBE0E8',color:'#052C42', padding: '8px, 14px, 8px, 14px' }}
              onClick={goToMenu}
            >Back to Home Page</Button>
          </Box>
          <Box sx={{ position: "absolute", right: '200px' }}>
            <Button sx={{ width: '168px', height: '40px', border: '1px solid', borderRadius:'6px', borderBlockColor:'#CBE0E8',color:'#052C42', padding: '8px, 14px, 8px, 14px' }}
              onClick={goToMenu}
            >Back to Top</Button>
          </Box>
          <Box sx={{ position: "absolute", right: "16px" }}>
            <Button onClick={onCaseDetailsSave} sx={{ width: '168px', height: '40px', border: '1px solid', borderRadius:'6px', borderBlockColor:'#CBE0E8',color:'#052C42', padding: '8px, 14px, 8px, 14px' }}>
              Save
            </Button>
          </Box>
      </AppBar>
  );
}

export default CaseTopBar;

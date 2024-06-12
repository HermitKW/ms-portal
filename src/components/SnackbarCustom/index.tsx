import { useContext } from 'react';
import { Alert, Snackbar, IconButton } from '@mui/material';
import { Close } from "@mui/icons-material";
import { GlobalSnackbarSetter } from '../GlobalSnackbar/GlobalSnackbarContext';

function SnackbarCustom({ showSnackbar, snackbarMsg, snackbarSeverity }) {

  const globalSnackbarSetter = useContext(GlobalSnackbarSetter);

  const closeSnackbar = () => {
    globalSnackbarSetter({
      showSnackbar: false
    })
  }

  return (
    showSnackbar ?
      <Snackbar
        open={showSnackbar}
        onClose={() => closeSnackbar()}
        autoHideDuration={8000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMsg}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            sx={{ marginLeft: "20px" }}
            onClick={() => closeSnackbar()}
          >
            <Close fontSize="small" />
          </IconButton>
        </Alert>
      </Snackbar>
      :
      null
  );
}

export default SnackbarCustom;

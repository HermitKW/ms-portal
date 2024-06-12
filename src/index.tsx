import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';
import App from 'src/App';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';
import React from 'react';
import {  ThemeProvider } from "@mui/material";
import CCMSTheme from './theme/CCMSTheme';


ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      {/* <SidebarProvider> */}
        <BrowserRouter>
          <ThemeProvider theme={CCMSTheme}> {/* top and sidebar */}
             <App />
          </ThemeProvider>
        </BrowserRouter>
      {/* </SidebarProvider> */}
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();

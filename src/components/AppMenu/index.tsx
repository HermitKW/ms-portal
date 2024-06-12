import { Button, Fade, Grid, Menu, MenuItem } from "@mui/material";
import Stack from "@mui/material/Stack/Stack";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { useNavigateWithLocale } from "src/helper/NavigateWithLocale";
import LanguageSelector from "../LanguageSelector";
import { sortBy, map, some, forEach } from "lodash";
import { UserInfoContext, checkPrivilege } from "src/authentication/UserInfoProvider";
import { INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_COUNTERPARTY_BANK_MAINTENANCE, 
  INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_FRAUD_CATEGORY_MAINTENANCE, 
  INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_FRAUD_TYPE_MAINTENANCE, 
  INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_PLACE_OF_INCORPORATION_MAINTENANCE,
  INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_REASON_FOR_SUSPICION_MAINTENANCE, 
  INT_PRIVILEGE_MAINTENANCE_ALERT_MAINTENANCE,
  INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_CONFIGURATION_TABLE_MAINTENANCE,  
  INT_PRIVILEGE_INTERNAL_HKPF_USER_MANAGEMENT,
  INT_PRIVILEGE_IMPORT_CORPORATE_MANAGER_USER,
  INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_SOURCE_MAINTENANCE,
  INT_PRIVILEGE_MANAGE_CORPORATE_MANAGER_USER,
  INT_PRIVILEGE_AUDIT_LOG} from "src/constants";

function AppMenu(){

  const userInfoContext = useContext(UserInfoContext);
  const privilegesMap = userInfoContext.userInfo?.privilegesMap;
  
    // const goToUserPage = useNavigateWithLocale("user");
    // const goToStrReportPage = useNavigateWithLocale("str-report");
    const goPage = useNavigate();

    const [anchorIntel, setAnchorIntel] = React.useState<null | HTMLElement>(null);
    const intelMenuOpened = Boolean(anchorIntel);
    const openIntelMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorIntel(event.currentTarget);
    };
    const handleCloseIntelMenu = () => {
      setAnchorIntel(null);
    };

    const [anchorConfig, setAnchorConfig] = React.useState<null | HTMLElement>(null);
    const configMenuOpened = Boolean(anchorConfig);
    const handleClickConfigMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorConfig(event.currentTarget);
    };
    const handleCloseConfigMenu = () => {
      setAnchorConfig(null);
    };

    let masterDataMenuItems = [
      {name: 'Source', path: '/master-data-configuration/source', seq: 6, view_privilege: [INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_SOURCE_MAINTENANCE]}
      , {name: 'Counterparty Bank', path: '/master-data-configuration/counterparty-bank', seq: 1, view_privilege: [INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_COUNTERPARTY_BANK_MAINTENANCE]}
      , {name: 'Fraud Category And Type', path: '/master-data-configuration/fraud-category-and-type', seq: 2, view_privilege: [INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_FRAUD_CATEGORY_MAINTENANCE,INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_FRAUD_TYPE_MAINTENANCE]}
      , {name: 'Place Of Incorporation', path: '/master-data-configuration/place-of-incoporation', seq: 4, view_privilege: [INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_PLACE_OF_INCORPORATION_MAINTENANCE]}
      , {name: 'Reason For Suspicion', path: '/master-data-configuration/reason-for-suspicion', seq: 5, view_privilege: [INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_REASON_FOR_SUSPICION_MAINTENANCE]}
      , {name: 'Maintenance Alert', path: '/master-data-configuration/maintenance-alert', seq: 3, view_privilege: [INT_PRIVILEGE_MAINTENANCE_ALERT_MAINTENANCE]}
      , {name: 'Config Table', path: '/system-configuration/config-table', seq: 6, view_privilege: [INT_PRIVILEGE_INTELLIGENCE_SHARING_REPORT_CONFIGURATION_TABLE_MAINTENANCE]}

    ]

    let userMenuItems = [
      {name: 'Corporate User Management', path: '/user-management', seq: 1, view_privilege: [INT_PRIVILEGE_MANAGE_CORPORATE_MANAGER_USER]}
      , {name: 'Import User', path: '/user-import', seq: 2, view_privilege: [INT_PRIVILEGE_IMPORT_CORPORATE_MANAGER_USER]}
    ]

    const goToHKPFUserPage = () =>{

    }
    
    const masterDataMenuItemsSorted = sortBy(masterDataMenuItems,function(o) { return o.seq; });
    const userMenuItemsSorted = sortBy(userMenuItems,function(o) { return o.seq; });
    
    const [anchorUser, setAnchorUser] = React.useState<null | HTMLElement>(null);
    const userMenuOpened = Boolean(anchorUser);
    const handleClickUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
      setAnchorUser(null);
    };

    function isShowMasterConfigButton(){
      var privileges = []
      forEach(masterDataMenuItemsSorted,(i)=>{
        if(i.view_privilege && i.view_privilege.length > 0){
          privileges = privileges.concat(i.view_privilege);
        } 
      })
      console.log(map(privileges,(p)=>{return checkPrivilege(privilegesMap,p).hasPrivilege}))
      return some(map(privileges,(p)=>{return checkPrivilege(privilegesMap,p).hasPrivilege}));
    }

    function isShowUserManagementButton(){
      var privileges = []
      forEach(userMenuItemsSorted,(i)=>{
        if(i.view_privilege && i.view_privilege.length > 0){
          privileges = privileges.concat(i.view_privilege);
        } 
      })
      console.log(map(privileges,(p)=>{return checkPrivilege(privilegesMap,p).hasPrivilege}))
      return some(map(privileges,(p)=>{return checkPrivilege(privilegesMap,p).hasPrivilege}));
    }

    return (
      <Grid container sx={{position: 'relative', background: 'rgba(255, 255, 255, 0.8)', zIndex: 10}}>
        <Grid item container xs={12}>
            <Grid item container justifyContent={"flex-start"} xs={6} >
            <Button                
                id="fade-button"
                // onClick={() => goToUserPage()}
                aria-controls={userMenuOpened ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={userMenuOpened ? 'true' : undefined}
                // onClick={() => goToUserPage('user-management')}
                onClick={handleClickUserMenu}
                sx={{display: isShowUserManagementButton() ? 'inline' : 'none'}}
            >
                Corporate User Management
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorUser}
                open={userMenuOpened}
                onClose={handleCloseUserMenu}
                TransitionComponent={Fade}
            >
              {
                map(userMenuItemsSorted, (item)=>{
                  return some(map(item.view_privilege,(p)=>{return checkPrivilege(privilegesMap,p).hasPrivilege})) || !item.view_privilege ? (
                        <MenuItem key={item.name} onClick={() => {
                          goPage(item.path);
                          handleCloseUserMenu();
                        }}>
                          {item.name}
                        </MenuItem>
                  )
                  :
                  null
                })
              }
                
            </Menu>
            {
              checkPrivilege(privilegesMap, INT_PRIVILEGE_INTERNAL_HKPF_USER_MANAGEMENT).hasPrivilege ? 
              <Button                
                  id="fade-button"
                  // onClick={() => goToUserPage()}
                  onClick={() => goPage('hkpf-user-management')}
              >
                  HKPF User Management
              </Button>
              :
              null
            }
         
            <Button
                id="fade-button"
                aria-controls={intelMenuOpened ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={intelMenuOpened ? 'true' : undefined}
                // onClick={() => goToStrReportPage('/intelligence-sharing-report/search')}
                onClick={openIntelMenu}
            >
                Intelligence Sharing
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorIntel}
                open={intelMenuOpened}
                onClose={handleCloseIntelMenu}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={() => {
                    goPage('/intelligence-sharing-report/search');
                    handleCloseIntelMenu();
                  }}>
                  Search Intelligence Sharing Report
                </MenuItem>
            </Menu>

            
            <Button
                id="fade-button"
                aria-controls={configMenuOpened ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={configMenuOpened ? 'true' : undefined}
                // onClick={() => goToStrReportPage('/intelligence-sharing-report/search')}
                onClick={handleClickConfigMenu}
                sx={{display: isShowMasterConfigButton() ? 'inline' : 'none'}}
            >
                Master Data Configuration
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorConfig}
                open={configMenuOpened}
                onClose={handleCloseConfigMenu}
                TransitionComponent={Fade}
            >
              {
                map(masterDataMenuItemsSorted, (item)=>{
                  return some(map(item.view_privilege,(p)=>{return checkPrivilege(privilegesMap,p).hasPrivilege})) || !item.view_privilege ? (
                        <MenuItem key={item.name} onClick={() => {
                          goPage(item.path);
                          handleCloseConfigMenu();
                        }}>
                          {item.name}
                        </MenuItem>
                  )
                  :
                  null
                })
              }
            </Menu>
            {checkPrivilege(privilegesMap, INT_PRIVILEGE_AUDIT_LOG).hasPrivilege ? 
                <Button
                    id="fade-button"
                    aria-controls={intelMenuOpened ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={intelMenuOpened ? 'true' : undefined}
                    onClick={() => goPage('/audit-log/search')}                
                >
                    Audit Log
                </Button>
                :
                null
            }           
            </Grid>
            <Grid container item xs={6} justifyContent={"flex-end"}>
              <Grid item>
                <LanguageSelector xs={12}/>
              </Grid>
            </Grid>
        </Grid>
            
      </Grid>  
    );
}

export default AppMenu;
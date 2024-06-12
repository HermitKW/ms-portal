import { useContext, useState } from 'react';

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem,
  useTheme
} from '@mui/material';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { SidebarContext } from 'src/contexts/SidebarContext';

import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DisplaySettingsTwoToneIcon from '@mui/icons-material/DisplaySettingsTwoTone';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';
import { useTranslation } from 'react-i18next';
import { forEach } from 'lodash';
import './index.scss'
import {
  CATSLAS_PRIVILEGE_ENQUIRE_ACCESS_RIGHT_FOR_DOCUMENT_CLASS,
  CATSLAS_PRIVILEGE_REQUEST_ACCESS_FOR_DOCUMENT_CLASS,
  CATSLAS_PRIVILEGE_VERIFY_ACCESS_REQUEST_FOR_DOCUMENT_CLASS,
  CATSLAS_PRIVILEGE_APPROVE_ACCESS_REQUEST_FOR_DOCUMENT_CLASS,
  CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,

  CATSLAS_PRIVILEGE_SEARCH_USER_PROFILE,
  CATSLAS_PRIVILEGE_MAINTAIN_USER_PROFILE,
  CATSLAS_PRIVILEGE_MAINTAIN_DOCUMENT_CLASS,
  CATSLAS_PRIVILEGE_MAINTAIN_SYSTEM_PARAMETERS,
  CATSLAS_PRIVILEGE_IMPORT_TASKS_MAINTAIN,
  CATSLAS_PRIVILEGE_IMPORT_TASKS_ENQUIRY,
  CATSLAS_PRIVILEGE_MAINTAIN_TEAM_EMAIL_TEMPLATE,
  CATSLAS_PRIVILEGE_SEND_EMAIL_FOR_ACCOUNT_ACCESS_REVIEW,

  CATSLAS_PRIVILEGE_GENERATE_RGR_001,
  CATSLAS_PRIVILEGE_GENERATE_RGR_002,
  CATSLAS_PRIVILEGE_GENERATE_RGR_003,
  CATSLAS_PRIVILEGE_GENERATE_RGR_004,
  CATSLAS_PRIVILEGE_GENERATE_RGR_005,
  CATSLAS_PRIVILEGE_GENERATE_RGR_006,
  CATSLAS_PRIVILEGE_GENERATE_RGP_007,
  CATSLAS_PRIVILEGE_GENERATE_RGP_008,
  CATSLAS_PRIVILEGE_GENERATE_RGP_009,
  CATSLAS_PRIVILEGE_GENERATE_RGP_010,
  CATSLAS_PRIVILEGE_GENERATE_RGP_011,

  CATSLAS_PRIVILEGE_ENQUIRE_DISPOSAL_DATE_OF_ARCHIVAL_RECORDS,
  CATSLAS_PRIVILEGE_EXTEND_DISPOSAL_DATE_OF_ARCHIVAL_RECORDS,
  CATSLAS_PRIVILEGE_CHANGE_LANGUAGE,
  CATSLAS_PRIVILEGE_ONLINE_HELP,
  CATSLAS_PRIVILEGE_ENQUIRE_ACTIVITIES_LOG,

  CATSLAS_PRIVILEGE_TEST,
} from "src/constants";

import { UserInfoContext, checkPrivilege } from "src/authentication/UserInfoProvider";

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    
    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      //padding: ${theme.spacing(0, 2.5)};
      padding-left: 0;
      padding-right: 0;
      line-height: 1.4;

      span{
        padding: ${theme.spacing(0, 2.5)};
      }

      .MuiButton-root {
        color: #5569ff;
        padding: ${theme.spacing(1, 2.5)};
        width: 100%;
        justify-content: flex-start;
        &.active {color: ${theme.colors.alpha.customBlue[100]};},
        &:hover {
          background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
          // color: ${theme.colors.alpha.black[100]};
          color: ${theme.colors.alpha.customBlue[100]};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            // color: ${theme.colors.alpha.black[100]};
            color: ${theme.colors.alpha.customBlue[100]};
          }
        }
      }
    }
`
);

const menuClickableHeaderStyle = {
  textTransform: "uppercase",
  fontWeight: "bold",
  fontSize: "0.75rem",
  lineHeight: 1.4,
  //paddingLeft: "0px",
  textAlign: "left"
}

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
      padding-left: 0;
      padding-right: 0;
      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
          }
        }
    
        .MuiButton-root {
          display: flex;
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};
          text-align: left;
          color: #5569ff;

          .MuiButton-startIcon,
          .MuiButton-endIcon {

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }
          
          // &.active {color: ${theme.colors.alpha.black[100]};},
      
          &.active {color: ${theme.colors.alpha.customBlue[100]};},
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            // color: ${theme.colors.alpha.black[100]};
            color: ${theme.colors.alpha.customBlue[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              // color: ${theme.colors.alpha.black[100]};
              color: ${theme.colors.alpha.customBlue[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity'
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const location = useLocation();
  const { closeSidebar } = useContext(SidebarContext);

  const navigateWithLocale = useNavigateWithLocale();

  const [activeMenu, setActiveMenu] = useState<string>();
  const [selectedKey, setSelectedKey] = useState<string>("documentClassAccess");

  const userInfoContext = useContext(UserInfoContext);
  const privilegesMap = userInfoContext.userInfo?.privilegesMap;

  const { t } = useTranslation('menuItem')

  const menuLink = {
    "documentClassAccess": {
      "requestAccess": {
        link: "document-class-access",
        name: t("requestAccess"),
        privilege: CATSLAS_PRIVILEGE_ENQUIRE_ACCESS_RIGHT_FOR_DOCUMENT_CLASS,
      },
      "accessRightQuery": {
        link: "verify-access-right",
        name: t("verifyAccess"),
        privilege: CATSLAS_PRIVILEGE_VERIFY_ACCESS_REQUEST_FOR_DOCUMENT_CLASS,
      },
      "approveAccess": {
        link: "approve-access-right",
        name: t("approveAccess"),
        privilege: CATSLAS_PRIVILEGE_APPROVE_ACCESS_REQUEST_FOR_DOCUMENT_CLASS,
      },
      "retrieveRecord": {
        link: "retrieve-record",
        name: t("retrieveRecord"),
        privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
      }
    },
    "user": {
      "userProfile": {
        link: "user-profile",
        name: t("userProfile"),
        privilege: CATSLAS_PRIVILEGE_SEARCH_USER_PROFILE,
      }
    },
    "admin": {
      "maintainDocumentClass": {
        link: "maintain-document-class",
        name: t("maintainDocumentClass"),
        privilege: CATSLAS_PRIVILEGE_MAINTAIN_DOCUMENT_CLASS,
      },
      "maintainSystemParameters": {
        link: "maintain-system-parameters",
        name: t("maintainSystemParameters"),
        privilege: CATSLAS_PRIVILEGE_MAINTAIN_SYSTEM_PARAMETERS,
      }
    },
    "importTasks": {
      "importTasksMaintain": {
        link: "import-tasks-maintain",
        name: t("importTasksMaintain"),
        privilege: CATSLAS_PRIVILEGE_IMPORT_TASKS_MAINTAIN,
      },
      "importTasksEnquiry": {
        link: "import-tasks-enquiry",
        name: t("importTasksEnquiry"),
        privilege: CATSLAS_PRIVILEGE_IMPORT_TASKS_ENQUIRY,
      }
    },
    "report": {
      "retrieveReport": {
        link: "retrieve-reports",
        name: t("reports"),
        privilege: CATSLAS_PRIVILEGE_GENERATE_RGR_001,
      },
    },
    "onlineHelp": {
      "onlineHelp": {
        link: "online-help",
        name: t("onlineHelp"),
        // privilege: CATSLAS_PRIVILEGE_ENQUIRE_ACTIVITIES_LOG,
      }
    },
    "auditLog": {
      "activitiesLog": {
        link: "audit-log/search",
        name: t("activitiesLog"),
        privilege: CATSLAS_PRIVILEGE_ENQUIRE_ACTIVITIES_LOG,
      }
    },
    "SearchDisposalDate": {
      "activitiesSearchDisposalDate": {
        link: "search-disposal-date",
        name: t("searchDisposalDate"),
        privilege: CATSLAS_PRIVILEGE_ENQUIRE_DISPOSAL_DATE_OF_ARCHIVAL_RECORDS,
      }
    }
  }

  const menuSelected = Object.entries(menuLink[selectedKey]).reduce((acc, [key, val]) => {
    if (key === activeMenu) {
      acc[key] = true;
    }
    return acc;
  }, {})

  const goToMenu = (link, key: string, menuKey: string) => {
    setActiveMenu(menuKey);
    setSelectedKey(key);
    return navigateWithLocale(link[key][menuKey].link);
  }

  const theme = useTheme();

  return (
    <>
      <MenuWrapper sx={{ top: "145px", fontFamily: "Arial", minWidth: theme.sidebar.width, paddingTop: "9px" }} id="sidebar-menu-wrapper">

        {
/*           (checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_ENQUIRE_ACCESS_RIGHT_FOR_DOCUMENT_CLASS).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_REQUEST_ACCESS_FOR_DOCUMENT_CLASS).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_VERIFY_ACCESS_REQUEST_FOR_DOCUMENT_CLASS).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_APPROVE_ACCESS_REQUEST_FOR_DOCUMENT_CLASS).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS).hasPrivilege
          ) ? */
            <List
              component="div"
              className='menu-list-wrapper'
              subheader={
                <ListSubheader component="div" disableSticky>
                  <span>{t('documentClassAccess')}</span>

                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div"
                  className='sub-menu-list-wrapper'>
                  {
                    Object.entries(menuLink["documentClassAccess"]).map(([key, value]) => {

                      return (
/*                         checkPrivilege(privilegesMap, menuLink["documentClassAccess"][key].privilege).hasPrivilege ?
 */                          <ListItem key={key} component="div">
                            <Button
                              disableRipple
                              className={menuSelected[key] ? 'active' : ''}
                              onClick={() => { goToMenu(menuLink, "documentClassAccess", key)() }}
                              startIcon={<BrightnessLowTwoToneIcon />}
                            >
                              {value.name}
                            </Button>
                          </ListItem>
/*                           :
                          null */
                      );
                    })
                  }

                </List>
              </SubMenuWrapper>
            </List>
/*             :
            null */
        }


        {
          //checkPrivilege(privilegesMap, menuLink["user"]["userProfile"].privilege).hasPrivilege ?
            <List
              component="div"
              className='menu-list-wrapper'
              subheader={
                <ListSubheader component="div" disableSticky>
                  <span>{t('userManagement')}</span>
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div"
                  className='sub-menu-list-wrapper'>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      className={menuSelected["userProfile"] ? 'active' : ''}
                      onClick={() => { goToMenu(menuLink, "user", "userProfile")() }}
                      startIcon={<AccountCircleTwoToneIcon />}
                    >
                      {t('userProfile')}
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>
            //: null
        }


{/*         {checkPrivilege(privilegesMap, menuLink["admin"]["maintainDocumentClass"].privilege).hasPrivilege
          || checkPrivilege(privilegesMap, menuLink["admin"]["maintainSystemParameters"].privilege).hasPrivilege ? */}
          <List
            component="div"
            className='menu-list-wrapper'
            subheader={
              <ListSubheader component="div" disableSticky>
                <span>{t('admin')}</span>
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div"
                className='sub-menu-list-wrapper'>
{/*                 {checkPrivilege(privilegesMap, menuLink["admin"]["maintainDocumentClass"].privilege).hasPrivilege ?
 */}                  <ListItem component="div">
                    <Button
                      disableRipple
                      className={menuSelected["maintainDocumentClass"] ? 'active' : ''}
                      onClick={() => { goToMenu(menuLink, "admin", "maintainDocumentClass")() }}

                      startIcon={<AccountCircleTwoToneIcon />}
                    >
                      {t('documentClass')}
                    </Button>
                  </ListItem>
{/*                   :
                  null
                } */}
{/*                 {checkPrivilege(privilegesMap, menuLink["admin"]["maintainSystemParameters"].privilege).hasPrivilege ?
 */}                  <ListItem component="div">
                    <Button
                      disableRipple
                      className={menuSelected["maintainSystemParameters"] ? 'active' : ''}
                      onClick={() => { goToMenu(menuLink, "admin", "maintainSystemParameters")() }}

                      startIcon={<DisplaySettingsTwoToneIcon />}
                    >
                      {t('systemParameters')}
                    </Button>
                  </ListItem>
{/*                   :
                  null
                } */}
              </List>
            </SubMenuWrapper>
          </List>
{/*           :
          null 
        } */}


{/*         {
          checkPrivilege(privilegesMap, menuLink["importTasks"]["importTasksMaintain"].privilege).hasPrivilege
            || checkPrivilege(privilegesMap, menuLink["importTasks"]["importTasksEnquiry"].privilege).hasPrivilege ? */}
            <List
              component="div"
              className='menu-list-wrapper'
              subheader={
                <ListSubheader component="div" disableSticky>
                  <span>{t('importTasks')}</span>
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div"
                  className='sub-menu-list-wrapper'>
{/*                   {checkPrivilege(privilegesMap, menuLink["importTasks"]["importTasksMaintain"].privilege).hasPrivilege ?
 */}                    <ListItem component="div">
                      <Button
                        disableRipple
                        className={menuSelected["importTasksMaintain"] ? 'active' : ''}
                        onClick={() => { goToMenu(menuLink, "importTasks", "importTasksMaintain")() }}
                        startIcon={<AccountCircleTwoToneIcon />}
                      >
                        {t('maintain')}
                      </Button>
                    </ListItem>
{/*                     : null}
 */}
{/*                   {checkPrivilege(privilegesMap, menuLink["importTasks"]["importTasksEnquiry"].privilege).hasPrivilege ?
 */}                    <ListItem component="div">
                      <Button
                        disableRipple
                        className={menuSelected["importTasksEnquiry"] ? 'active' : ''}
                        onClick={() => { goToMenu(menuLink, "importTasks", "importTasksEnquiry")() }}
                        startIcon={<DisplaySettingsTwoToneIcon />}
                      >
                        {t('enquire')}
                      </Button>
                    </ListItem>
{/*                     : null}
 */}                </List>
              </SubMenuWrapper>
            </List>
{/*             : null
        } */}

{/*         {
          (
            checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_001).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_002).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_003).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_004).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_005).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGR_006).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGP_007).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGP_008).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGP_009).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGP_010).hasPrivilege
            || checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_GENERATE_RGP_011).hasPrivilege
          ) ? */}
            <List
              component="div"
              className='menu-list-wrapper'
              subheader={
                <ListSubheader component="div" disableSticky>
                  <Button
                    disableRipple
                    className={menuSelected["retrieveReport"] ? 'active' : ''}
                    onClick={() => { goToMenu(menuLink, "report", "retrieveReport")() }}
                    sx={menuClickableHeaderStyle}
                  >
                    {t('reports')}
                  </Button>
                </ListSubheader>
              }
            >
            </List>
{/*             :
            null
        } */}

{/*         {checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_ENQUIRE_DISPOSAL_DATE_OF_ARCHIVAL_RECORDS).hasPrivilege ?
 */}          <List
            component="div"
            className='menu-list-wrapper'
            subheader={
              <ListSubheader component="div" disableSticky>
                <span>{t('retentionCycle')}</span>
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div"
                className='sub-menu-list-wrapper'>
                <ListItem component="div">
                  <Button
                    disableRipple
                    className={menuSelected["activitiesSearchDisposalDate"] ? 'active' : ''}
                    onClick={() => { goToMenu(menuLink, "SearchDisposalDate", "activitiesSearchDisposalDate")() }}
                    startIcon={<CalendarMonthIcon />}
                  >
                    {t('searchDisposalDate')}
                  </Button>
                </ListItem>

              </List>
            </SubMenuWrapper>
          </List>
{/*           :
          null
        } */}


{/*         {checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_ENQUIRE_ACTIVITIES_LOG).hasPrivilege ?
 */}          <List
            component="div"
            className='menu-list-wrapper'
            subheader={
              <ListSubheader component="div" disableSticky>

                <Button
                  disableRipple
                  className={menuSelected["activitiesLog"] ? 'active' : ''}
                  onClick={() => { goToMenu(menuLink, "auditLog", "activitiesLog")() }}
                  sx={menuClickableHeaderStyle}
                >
                  {t('activitiesLog')}
                </Button>
              </ListSubheader>
            }
          >
          </List>
{/*           :
          null
        } */}
{/*          {checkPrivilege(privilegesMap, CATSLAS_PRIVILEGE_ONLINE_HELP).hasPrivilege ?
 */}          <List
            component="div"
            className='menu-list-wrapper'
            subheader={
              <ListSubheader component="div" disableSticky>
                <Button
                  disableRipple
                  className={menuSelected["onlineHelp"] ? 'active' : ''}
                  onClick={() => { goToMenu(menuLink, "onlineHelp", "onlineHelp")() }}
                  sx={menuClickableHeaderStyle}
                >
                  {t('onlineHelp')}
                </Button>
              </ListSubheader>
            }
          >
          </List>
{/*           :
          null
        } */}
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;

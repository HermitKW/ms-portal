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
import { forEach, values } from 'lodash';
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

function CaseSidebarMenu() {
  const location = useLocation();
  let pathname =location.pathname;
  // 如果路径以 '/en/' 开头，则去掉它
  if (pathname.startsWith('/en/')) {
    pathname = pathname.substring(4);
  }
  const { closeSidebar } = useContext(SidebarContext);

  const navigateWithLocale = useNavigateWithLocale();

  const [activeMenu, setActiveMenu] = useState<string>(pathname);
  const [selectedKey, setSelectedKey] = useState<string>();

  const userInfoContext = useContext(UserInfoContext);
  const privilegesMap = userInfoContext.userInfo?.privilegesMap;

  const { t } = useTranslation('menuItem')

  const menuLink = {
    "case-particular": {
      link: "case-particular",
      name: t("Case Particulars"),
      privilege: CATSLAS_PRIVILEGE_ENQUIRE_ACCESS_RIGHT_FOR_DOCUMENT_CLASS,
    },
    "com-particular": {
      link: "com-particular",
      name: t("Complainant"),
      privilege: CATSLAS_PRIVILEGE_VERIFY_ACCESS_REQUEST_FOR_DOCUMENT_CLASS,
    },
    "complainee": {
      link: "complainee",
      name: t("Complainee"),
      privilege: CATSLAS_PRIVILEGE_APPROVE_ACCESS_REQUEST_FOR_DOCUMENT_CLASS,
    },
    "retrieveRecord": {
      link: "Complainee",
      name: t("Witness"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Representative": {
      link: "Complainee",
      name: t("Representative"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Incident Location": {
      link: "Complainee",
      name: t("Incident Location"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Allegation": {
      link: "Complainee",
      name: t("Allegation"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Case Summary": {
      link: "Complainee",
      name: t("Case Summary"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Investigation": {
      link: "Complainee",
      name: t("Investigation"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Communication with IPCC": {
      link: "Complainee",
      name: t("Communication with IPCC"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Case Result": {
      link: "Complainee",
      name: t("Case Result"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Request for Review": {
      link: "Complainee",
      name: t("Request for Review"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Case Management": {
      link: "Complainee",
      name: t("Case Management"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Vetting Record": {
      link: "Complainee",
      name: t("Vetting Record"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Pol.964": {
      link: "Complainee",
      name: t("Pol.964"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    },
    "Pol.138": {
      link: "Complainee",
      name: t("Pol.138"),
      privilege: CATSLAS_PRIVILEGE_RETRIEVE_AND_DOWNLOAD_ARCHIVAL_RECORDS,
    }
  }
  
  const menuSelected = Object.entries(menuLink).reduce((acc, [key, val]) => {
    if (key === activeMenu) {
      acc[key] = true;
    }

    return acc;
  }, {})

  const goToMenu = (link, key: string) => {

    setActiveMenu(key);
    setSelectedKey(key);
    return navigateWithLocale(link[key].link);
  }

  const theme = useTheme();

  return (
    <>
      <MenuWrapper sx={{ fontFamily: "Arial", minWidth: theme.sidebar.width }} id="case-sidebar-menu-wrapper">

        {
            <List
              component="div"
              className='case-menu-list-wrapper'
            >
              <SubMenuWrapper>
                <List component="div"
                  className='sub-menu-list-wrapper'>
                  {
                    Object.entries(menuLink).map(([key, value]) => {
                      return (
                          <ListItem key={key} component="div">
                            <Button
                              style={{ color: 'white' }}
                              disableRipple
                              className={menuSelected[key] ? 'active' : ''}
                              onClick={() => { goToMenu(menuLink, key)() }}
                              // startIcon={<BrightnessLowTwoToneIcon />}
                            >
                              {value.name}
                            </Button>
                          </ListItem>
                      );
                    })
                  } 
                </List>
              </SubMenuWrapper>
            </List>
        }   
      </MenuWrapper>
    </>
  );
}

export default CaseSidebarMenu;

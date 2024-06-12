import { Box, styled, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useNavigateWithLocale } from 'src/helper/NavigateWithLocale';


const LogoWrapper = styled(Box)(
  ({ theme }) => `
        margin-top: 4px;
        color: ${theme.palette.text.primary};
        padding: ${theme.spacing(0, 1, 0, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Link)(
  () => `

`
);

const LogoSign = styled(Box)(
  ({ theme }) => `
        background: ${theme.general.reactFrameworkColor};
        width: 18px;
        height: 18px;
        border-radius: ${theme.general.borderRadiusSm};
        position: relative;
        transform: rotate(45deg);
        top: 3px;
        left: 17px;

        &:after, 
        &:before {
            content: "";
            display: block;
            width: 18px;
            height: 18px;
            position: absolute;
            top: -1px;
            right: -20px;
            transform: rotate(0deg);
            border-radius: ${theme.general.borderRadiusSm};
        }

        &:before {
            background: ${theme.palette.primary.main};
            right: auto;
            left: 0;
            top: 20px;
        }

        &:after {
            background: ${theme.palette.secondary.main};
        }
`
);

const LogoSignInner = styled(Box)(
  ({ theme }) => `
        width: 16px;
        height: 16px;
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 5;
        border-radius: ${theme.general.borderRadiusSm};
        background: ${theme.header.background};
`
);

const LogoTextWrapper = styled(Box)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
`
);

const VersionBadge = styled(Box)(
  ({ theme }) => `
        background: ${theme.palette.success.main};
        color: ${theme.palette.success.contrastText};
        padding: ${theme.spacing(0.4, 1)};
        border-radius: ${theme.general.borderRadiusSm};
        text-align: center;
        display: inline-block;
        line-height: 1;
        font-size: ${theme.typography.pxToRem(11)};
`
);

const LogoText = styled(Box)(
  ({ theme }) => `
        font-size: ${theme.typography.pxToRem(15)};
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoIcon = styled(Box)`
  cursor: pointer;
`

function Logo() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const gotoHome = useNavigateWithLocale("document-class-access");

  return (
    <LogoWrapper>
      <LogoIcon onClick={() => gotoHome()}>
          <img          
              style={{marginTop: "18px"}}     
              width="1px"
              height="1px"
              alt="STR Report"
              src="/static/images/logo/logo.png"
            />
      </LogoIcon>
      <Box
        component="div"
        sx={{
          display: { xs: 'none', sm: 'inline-block' }
        }}
      >
        <Box 
          component="div"
          sx={{
            marginLeft: "2rem"
          }}
        >
          <div style={{width: "83%", color: "#ffffff", fontSize: "15px", marginTop: "1rem", fontFamily: "Inter"}}>
          CAPO Case Management System (CCMS)          </div>
          {/* <div style={{color:"#5AA3DA", fontWeight: 500, fontSize: "19.2px", fontFamily: "Arial"}}>
            {t('hkpf')}
          </div> */}
        </Box>
      </Box>
    </LogoWrapper>
  );
}

export default Logo;

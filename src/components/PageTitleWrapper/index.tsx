import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, styled } from '@mui/material';

const PageTitle = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(1)};
`
);

interface PageTitleWrapperProps {
  children?: ReactNode;
}

const PageTitleWrapper: FC<PageTitleWrapperProps> = ({ children }) => {
  return (
    <div style={{width: "100%", position: "relative", background: "rgba(255, 255, 255, 0.8)"}}>
      <PageTitle className="MuiPageTitle-wrapper">
        <Container maxWidth={false}>{children}</Container>
      </PageTitle>
    </div>
  );
};

PageTitleWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default PageTitleWrapper;

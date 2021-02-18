import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { WaplLogo } from '../Icons';

const { Footer } = Layout;

const FooterWrapper = styled(Footer)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding: 0.63rem 0.94rem;
  background-color: #fff;
  box-shadow: 0 -0.8125rem 0.75rem -0.1875rem #fff;
  z-index: 5;
`;

const FriendsLNBFooter = () => {
  return (
    <FooterWrapper>
      <WaplLogo />
    </FooterWrapper>
  );
};

export default FriendsLNBFooter;

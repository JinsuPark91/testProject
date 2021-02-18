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
`;

const FriendsLNBFooter = () => {
  return (
    <FooterWrapper>
      <WaplLogo />
    </FooterWrapper>
  );
};

export default FriendsLNBFooter;

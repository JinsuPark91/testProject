import React from 'react';
import { WaplLogo } from '../Icons';
import { FooterWrapper } from '../../styles/friends/FriendsLNBStyle';

const FriendsLNBFooter = ({ shadow }) => {
  return (
    <FooterWrapper shadow={shadow ? 1 : 0}>
      <WaplLogo />
    </FooterWrapper>
  );
};

export default React.memo(FriendsLNBFooter);

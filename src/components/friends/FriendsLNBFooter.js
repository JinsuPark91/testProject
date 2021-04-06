import React from 'react';
import { WaplLogo } from '../Icons';
import { FooterWrapper } from '../../styles/friends/FriendsLNBStyle';

const FriendsLNBFooter = () => {
  return (
    <FooterWrapper>
      <WaplLogo />
    </FooterWrapper>
  );
};

export default React.memo(FriendsLNBFooter);

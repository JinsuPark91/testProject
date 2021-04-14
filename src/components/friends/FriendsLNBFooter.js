import React from 'react';
import { useCoreStores } from 'teespace-core';
import { WaplLogo } from '../Icons';
import { FooterWrapper } from '../../styles/friends/FriendsLNBStyle';

const FriendsLNBFooter = ({ shadow }) => {
  const { configStore } = useCoreStores();

  if (!configStore.isActivateComponent('Platform', 'LNB:Logo')) return null;

  return (
    <FooterWrapper shadow={shadow ? 1 : 0}>
      <WaplLogo />
    </FooterWrapper>
  );
};

export default React.memo(FriendsLNBFooter);

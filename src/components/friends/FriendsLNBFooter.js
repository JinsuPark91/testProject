import React, { useContext } from 'react';
import { useCoreStores } from 'teespace-core';
import { ThemeContext } from 'styled-components';
import { WaplLogo } from '../Icons';
import { FooterWrapper } from '../../styles/friends/FriendsLNBStyle';

/**
 * @param {boolean} props.shadow - 스크롤 있을 때 하단 shadow 유무
 */

const FriendsLNBFooter = ({ shadow }) => {
  const { configStore } = useCoreStores();
  const themeContext = useContext(ThemeContext);

  if (!configStore.isActivateComponent('Platform', 'LNB:Logo')) return null;

  return (
    <FooterWrapper shadow={shadow ? 1 : 0}>
      <WaplLogo textColor={themeContext.BasicDark} />
    </FooterWrapper>
  );
};

export default React.memo(FriendsLNBFooter);

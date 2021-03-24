import React, { useCallback, useState, useRef } from 'react';
import FriendsLNBHeader from './FriendsLNBHeader';
import FriendsLNBContent from './FriendsLNBContent';
import FriendsLNBFooter from './FriendsLNBFooter';
import { FriendsLnbWrapper } from '../../styles/friends/FriendsLNBStyle';

const FriendsLNB = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const lnbRef = useRef(null);

  const handleSearchKeyword = useCallback(value => {
    setSearchKeyword(value);
  }, []);
  const handleClearKeyword = useCallback(() => {
    setSearchKeyword('');
  }, []);

  const getPopupContainer = useCallback(() => lnbRef.current, []);

  return (
    <FriendsLnbWrapper>
      <FriendsLNBHeader
        handleInputChange={handleSearchKeyword}
        handleInputClear={handleClearKeyword}
      />
      <FriendsLNBContent
        ref={lnbRef}
        searchKeyword={searchKeyword}
        meTooltipPopupContainer={getPopupContainer}
      />
      <FriendsLNBFooter />
    </FriendsLnbWrapper>
  );
};

export default FriendsLNB;

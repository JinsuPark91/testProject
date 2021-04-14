import React, { useCallback, useState } from 'react';
import FriendsLNBHeader from './FriendsLNBHeader';
import FriendsLNBContent from './FriendsLNBContent';
import FriendsLNBFooter from './FriendsLNBFooter';
import { FriendsLnbWrapper } from '../../styles/friends/FriendsLNBStyle';

const FriendsLNB = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [shadowVisible, setShadowVisible] = useState(true);

  const handleSearchKeyword = useCallback(value => {
    setSearchKeyword(value);
  }, []);
  const handleClearKeyword = useCallback(() => {
    setSearchKeyword('');
  }, []);

  const handleShadow = useCallback(value => {
    setShadowVisible(value);
  }, []);

  return (
    <FriendsLnbWrapper>
      <FriendsLNBHeader
        handleInputChange={handleSearchKeyword}
        handleInputClear={handleClearKeyword}
      />
      <FriendsLNBContent
        searchKeyword={searchKeyword}
        handleShadow={handleShadow}
      />
      <FriendsLNBFooter shadow={shadowVisible} />
    </FriendsLnbWrapper>
  );
};

export default FriendsLNB;

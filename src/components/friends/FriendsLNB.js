import React, { useCallback, useState } from 'react';
import FriendsLNBHeader from './FriendsLNBHeader';
import FriendsLNBContent from './FriendsLNBContent';
import FriendsLNBFooter from './FriendsLNBFooter';
import { FriendsLnbWrapper } from '../../styles/friends/FriendsLNBStyle';

const FriendsLNB = () => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearchKeyword = useCallback(value => {
    setSearchKeyword(value);
  }, []);
  const handleClearKeyword = useCallback(() => {
    setSearchKeyword('');
  }, []);

  return (
    <FriendsLnbWrapper>
      <FriendsLNBHeader
        handleInputChange={handleSearchKeyword}
        handleInputClear={handleClearKeyword}
      />
      <FriendsLNBContent searchKeyword={searchKeyword} />
      <FriendsLNBFooter />
    </FriendsLnbWrapper>
  );
};

export default FriendsLNB;

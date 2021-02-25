import React, { useCallback, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import FriendsLNBHeader from './FriendsLNBHeader';
import FriendsLNBContent from './FriendsLNBContent';
import FriendsLNBFooter from './FriendsLNBFooter';
import { FriendsLnbWrapper } from '../../styles/friend/FriendsLnbStyle';

/**
 * 프렌즈 LNB
 * @param {Object} props
 */
const FriendsLNB = observer(({ userId }) => {
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
        activeUserId={userId}
      />
      <FriendsLNBFooter />
    </FriendsLnbWrapper>
  );
});

export default FriendsLNB;

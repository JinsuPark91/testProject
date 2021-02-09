import React, { useCallback, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Layout } from 'antd';
import FriendsLNBHeader from './FriendsLNBHeader';
import FriendsLNBContent from './FriendsLNBContent';
import FriendsLNBFooter from './FriendsLNBFooter';

const FriendsLNBWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
`;
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
    <FriendsLNBWrapper>
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
    </FriendsLNBWrapper>
  );
});

export default FriendsLNB;

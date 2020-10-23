import React, { useEffect, useCallback, useState, useRef } from 'react';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { Layout } from 'antd';
import FriendsLNBHeader from './FriendsLNBHeader';
import FriendsLNBContent from './FriendsLNBContent';
import FriendsLNBFooter from './FriendsLNBFooter';

const FriendsLNBWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5fb;
`;
/**
 * 프렌즈 LNB
 * @param {Object} props
 */
function FriendsLNB() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const lnbRef = useRef(null);

  const { friendStore, orgStore, userStore } = useCoreStores();
  useEffect(() => {
    friendStore.fetchFriends({ myUserId: userStore.myProfile.id });
    friendStore.fetchInvitedFriends({
      myUserId: userStore.myProfile.id,
    });
    friendStore.fetchRecommendedFriends({
      myUserId: userStore.myProfile.id,
    });
    friendStore.fetchUserInvitationLink({ myUserId: userStore.myProfile.id });
    orgStore.getOrgTree();
  }, [friendStore, orgStore, userStore.myProfile.id]);
  const handleSearchKeyword = useCallback(e => {
    setSearchKeyword(e.target.value);
  }, []);

  const handleClearKeyword = useCallback(() => {
    setSearchKeyword('');
  }, []);

  return (
    <FriendsLNBWrapper>
      <FriendsLNBHeader
        handleInputChange={handleSearchKeyword}
        handleInputClear={handleClearKeyword}
      />
      <FriendsLNBContent
        ref={lnbRef}
        searchKeyword={searchKeyword}
        meTooltipPopupContainer={useCallback(() => {
          return lnbRef.current;
        }, [])}
      />
      <FriendsLNBFooter />
    </FriendsLNBWrapper>
  );
}

export default FriendsLNB;

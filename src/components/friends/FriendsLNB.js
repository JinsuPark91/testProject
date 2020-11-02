import React, { useEffect, useCallback, useState, useRef } from 'react';
import styled from 'styled-components';
import { useCoreStores, Loader } from 'teespace-core';
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
function FriendsLNB({ userId }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const lnbRef = useRef(null);
  const [loader] = Loader.useLoader();
  const { friendStore, orgStore, userStore } = useCoreStores();
  useEffect(() => {
    (async () => {
      loader.loading();
      await friendStore.fetchFriends({ myUserId: userStore.myProfile.id });
      await friendStore.fetchInvitedFriends({
        myUserId: userStore.myProfile.id,
      });
      await friendStore.fetchRecommendedFriends({
        myUserId: userStore.myProfile.id,
      });
      await friendStore.fetchUserInvitationLink({
        myUserId: userStore.myProfile.id,
      });
      await orgStore.getOrgTree();
      loader.stop();
    })();
  }, [friendStore, loader, orgStore, userStore.myProfile.id]);

  const handleSearchKeyword = useCallback(e => {
    setSearchKeyword(e.target.value);
  }, []);

  const handleClearKeyword = useCallback(() => {
    setSearchKeyword('');
  }, []);

  const getPopupContainer = useCallback(() => lnbRef.current, []);

  return (
    <FriendsLNBWrapper>
      <Loader loader={loader}>
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
      </Loader>
    </FriendsLNBWrapper>
  );
}

export default FriendsLNB;

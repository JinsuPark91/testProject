import React, { useEffect, useCallback, useState, useRef } from 'react';
import { observer } from 'mobx-react';
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
const FriendsLNB = observer(({ userId }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const lnbRef = useRef(null);
  const [loader] = Loader.useLoader();
  const { friendStore, orgStore, userStore } = useCoreStores();
  useEffect(() => {
    (async () => {
      loader.loading();
      await Promise.all([
        // friendStore.fetchFriends({ myUserId: userStore.myProfile.id }),
        // friendStore.fetchInvitedFriends({
        //   myUserId: userStore.myProfile.id,
        // }),
        // friendStore.fetchRecommendedFriends({
        //   myUserId: userStore.myProfile.id,
        // }),
        // friendStore.fetchUserInvitationLink({
        //   myUserId: userStore.myProfile.id,
        // }),
        // orgStore.getOrgTree(),
      ]);
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
});

export default FriendsLNB;

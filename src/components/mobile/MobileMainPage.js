import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { EventBus, useCoreStores } from 'teespace-core';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { useStores } from '../../stores';
import MobileContent from './MobileContent';
import MobileFooter from './MobileFooter';
import LoadingImg from '../../assets/WAPL_Loading.gif';

const Wrapper = styled.div`
  height: 100%;
`;
const Loader = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  user-select: none;

  & img {
    width: 5rem;
    height: auto;
  }
`;

const MobileMainPage = () => {
  const history = useHistory();
  const { resourceType, resourceId } = useParams();
  const { uiStore } = useStores();
  const { spaceStore, userStore, friendStore, roomStore } = useCoreStores();
  const [isLoading, setIsLoading] = useState(true);
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    Promise.all([
      spaceStore.fetchSpaces({
        userId: myUserId,
        isLocal: process.env.REACT_APP_ENV === 'local',
      }),
      userStore.fetchRoomUserProfileList({}),
      friendStore.fetchFriends({ myUserId }),
      roomStore.fetchRoomList({ myUserId }),
    ]).then(async () => {
      EventBus.dispatch('Platform:initLNB');
      if (friendStore.friendInfoList.length) {
        const friendIdList = friendStore.friendInfoList.map(
          elem => elem.friendId,
        );
        await userStore.fetchProfileList(friendIdList);
      }
      // 룸 목록으로 항상 이동
      history.push('/room');
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    uiStore.resourceType = resourceType;
    uiStore.resourceId = resourceId;

    // TODO: 더 좋은 방법 고민
    if (resourceType === 'profile' || resourceType === 'image')
      uiStore.isFooterVisible = false;
    else uiStore.isFooterVisible = true;
  }, [uiStore, resourceType, resourceId]);

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loading" />
      </Loader>
    );
  }

  return (
    <Wrapper>
      <MobileContent />
      <Observer>
        {() => {
          const isVisible =
            uiStore.resourceType !== 'profile' &&
            uiStore.resourceType !== 'image';

          if (!isVisible) return null;
          return <MobileFooter />;
        }}
      </Observer>
    </Wrapper>
  );
};

export default MobileMainPage;

import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { EventBus, useCoreStores } from 'teespace-core';
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
  const { resourceType, resourceId } = useParams();
  const { uiStore } = useStores();
  const { userStore, friendStore, roomStore } = useCoreStores();
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    Promise.all([
      userStore.fetchRoomUserProfileList({}),
      friendStore.fetchFriends({ myUserId }),
      roomStore.fetchRoomList({ myUserId }),
    ]).then(async () => {
      EventBus.dispatch('Platform:initLNB');
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    uiStore.resourceType = resourceType;
    uiStore.resourceId = resourceId;
  }, [resourceType, resourceId]);

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
        {() => !uiStore.isProfileEditMode && <MobileFooter />}
      </Observer>
    </Wrapper>
  );
};

export default MobileMainPage;

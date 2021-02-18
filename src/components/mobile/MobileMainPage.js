import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import styled from 'styled-components';
import MobileRoomHeader from './MobileRoomHeader';
import MobileTalkHeader from './MobileTalkHeader';
import MobileContent from './MobileContent';
import LoadingImg from '../../assets/WAPL_Loading.gif';
import PlatformUIStore from '../../stores/PlatformUIStore';
import MobileRoomCreatePage from './MobileRoomCreatePage';

const Wrapper = styled.div`
  height: 100%;
`;
const Container = styled.div`
  padding-top: 3.1rem;
  height: 100%;
  overflow-y: scroll;
`;
const Loader = styled.div``;

const MobileMainPage = observer(() => {
  const history = useHistory();
  const { resourceType, resourceId } = useParams();
  const { userStore, friendStore, roomStore } = useCoreStores();
  const [isLoading, setIsLoading] = useState(true);
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    Promise.all([
      userStore.fetchRoomUserProfileList({}),
      friendStore.fetchFriends({ myUserId }),
      roomStore.fetchRoomList({ myUserId }),
    ]).then(async () => {
      await talkRoomStore.initialize(myUserId);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    PlatformUIStore.resourceType = resourceType;
    PlatformUIStore.resourceId = resourceId;
  }, [resourceType, resourceId]);

  const handleCreateRoom = () => {
    history.push(`/create/${myUserId}`);
  };

  const handleCancelRoom = () => {
    history.push(`/room/${myUserId}`);
  };

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loading" />
      </Loader>
    );
  }

  if (PlatformUIStore.resourceType === 'create') {
    return (
      <Wrapper>
        <MobileRoomCreatePage onCancel={handleCancelRoom} />
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper>
        {PlatformUIStore.resourceType === 'room' ? (
          <MobileRoomHeader onRoomCreate={handleCreateRoom} />
        ) : (
          <MobileTalkHeader />
        )}
        <Container>
          <MobileContent />
        </Container>
      </Wrapper>
    </>
  );
});

export default MobileMainPage;

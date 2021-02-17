import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  padding-top: 2.88rem;
  height: 100%;
  overflow-y: scroll;
`;
const Loader = styled.div``;

const MobileMainPage = observer(() => {
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

  const [isRoomCreateVisible, setIsRoomCreateVisible] = useState(false);
  const handleToggleModal = () => {
    setIsRoomCreateVisible(!isRoomCreateVisible);
  };

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loading" />
      </Loader>
    );
  }

  if (isRoomCreateVisible) {
    return (
      <Wrapper>
        <MobileRoomCreatePage
          onOk={handleToggleModal}
          onCancel={handleToggleModal}
        />
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper>
        {PlatformUIStore.resourceType === 'room' ? (
          <MobileRoomHeader onRoomCreate={() => setIsRoomCreateVisible(true)} />
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

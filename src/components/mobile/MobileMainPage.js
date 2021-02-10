import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import styled from 'styled-components';
import MobileRoomItem from './MobileRoomItem';

const Wrapper = styled.div`
  height: 100%;
`;
const Header = styled.div`
  height: 10%;
`;

const MobileMainPage = () => {
  const { userStore, roomStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    Promise.all([roomStore.fetchRoomList({ myUserId })]).then(async res => {
      await talkRoomStore.initialize(myUserId);
      console.log(roomStore.getRoomArray());
    });
  }, []);

  const roomFilter = roomInfo => roomInfo.visible;

  const RoomList = ({ roomList }) => {
    return (
      <>
        {roomList.map(roomInfo => (
          <MobileRoomItem roomInfo={roomInfo} />
        ))}
      </>
    );
  };

  return useObserver(() => (
    <Wrapper>
      <Header />
      <RoomList roomList={roomStore.getRoomArray()[0]} />
    </Wrapper>
  ));
};

export default MobileMainPage;

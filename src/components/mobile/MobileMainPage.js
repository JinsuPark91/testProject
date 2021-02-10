import React, { useEffect } from 'react';
import { Observer } from 'mobx-react';
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
  const { roomStore } = useCoreStores();
  const myUserId = '646e2725-7e82-4d54-9773-68c170efaf40';

  useEffect(() => {
    Promise.all([roomStore.fetchRoomList({ myUserId })]).then(async res => {
      await talkRoomStore.initialize(myUserId);
      console.log(roomStore.getRoomArray());
    });
  }, []);

  const roomFilter = roomInfo => roomInfo.visible;

  const renderRoomList = () => {
    return (
      <Observer>
        {() => {
          return roomStore
            .getRoomArray()
            .filter(roomFilter)
            .map(roomInfo => (
              <MobileRoomItem key={roomInfo.id} roomInfo={roomInfo} />
            ));
        }}
      </Observer>
    );
  };

  return (
    <Wrapper>
      <Header />
      <MobileRoomItem />
    </Wrapper>
  );
};

export default MobileMainPage;

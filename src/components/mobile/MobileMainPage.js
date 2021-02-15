import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import styled from 'styled-components';
import Header from './Header';
import MobileRoomItem from './MobileRoomItem';
import LoadingImg from '../../assets/WAPL_Loading.gif';
import PlatformUIStore from '../../stores/PlatformUIStore';

const Wrapper = styled.div`
  height: 100%;
`;

const Loader = styled.div``;

const MobileMainPage = () => {
  const history = useHistory();
  const { resourceId } = useParams();
  const { userStore, friendStore, roomStore } = useCoreStores();
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    Promise.all([
      userStore.fetchRoomUserProfileList({}),
      friendStore.fetchFriends({ myUserId }),
      roomStore.fetchRoomList({ myUserId }),
    ]).then(async res => {
      await talkRoomStore.initialize(myUserId);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    PlatformUIStore.resourceId = resourceId;
  }, [resourceId]);

  const roomFilter = room => room.isVisible;

  const handleSelectRoom = room => {
    history.push(`${room?.id}/talk`);
  };

  const RoomList = ({ roomList }) => {
    return (
      <>
        {roomList.map(roomInfo => (
          <MobileRoomItem
            key={roomInfo?.id}
            roomInfo={roomInfo}
            onClick={() => handleSelectRoom(roomInfo)}
          />
        ))}
      </>
    );
  };

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loading" />
      </Loader>
    );
  }

  const roomArray = roomStore.getRoomArray().filter(roomFilter);

  return (
    <Wrapper>
      <Header />
      {roomArray && <RoomList roomList={roomArray} />}
    </Wrapper>
  );
};

export default MobileMainPage;

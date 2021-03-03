import React from 'react';
import { useHistory } from 'react-router-dom';
import { Talk } from 'teespace-talk-app';
import { NoteApp } from 'teespace-note-app';
import { CalendarApp } from 'teespace-calendar-app';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import MobileRoomCreatePage from './MobileRoomCreatePage';
import MobileRoomItem from './MobileRoomItem';
import PlatformUIStore from '../../stores/PlatformUIStore';

const MobileContent = observer(() => {
  const history = useHistory();
  const { roomStore, userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  const roomFilter = room => room.isVisible;
  const getRoomArray = () => {
    return roomStore.getRoomArray().filter(roomFilter);
  };
  const RoomList = ({ roomList }) => {
    return (
      <>
        {roomList.map(roomInfo => (
          <MobileRoomItem key={roomInfo?.id} roomInfo={roomInfo} />
        ))}
      </>
    );
  };

  const getRoomId = () => {
    return PlatformUIStore.resourceId;
  };
  const getChannelId = type => {
    const roomId = getRoomId();
    return roomStore
      .getRoomMap()
      .get(roomId)
      ?.channelList?.find(channel => channel.type === type)?.id;
  };

  const handleSearchClose = () => {
    PlatformUIStore.isSearchVisible = false;
  };

  const handleCreateRoom = () => {
    history.push(`/create/${myUserId}`);
  };

  switch (PlatformUIStore.resourceType) {
    case 'room':
      return <RoomList roomList={getRoomArray()} />;
    case 'create':
      return <MobileRoomCreatePage />;
    case 'select':
      return <></>;
    case 'talk':
      return (
        <Talk
          roomId={getRoomId()}
          channelId={getChannelId('CHN0001')}
          isSearchInputVisible={PlatformUIStore.isSearchVisible}
          onSearchClose={handleSearchClose}
          isMini={false}
        />
      );
    case 'calendar':
      return (
        <CalendarApp roomId={getRoomId()} channel={getChannelId('CHN0005')} />
      );
    case 'note':
      return <NoteApp roomId={getRoomId()} channel={getChannelId('CHN0003')} />;
    default:
      return null;
  }
});

export default MobileContent;

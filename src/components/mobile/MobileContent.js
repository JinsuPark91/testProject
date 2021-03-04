import React from 'react';
import { Talk } from 'teespace-talk-app';
import { NoteApp } from 'teespace-note-app';
import { CalendarApp } from 'teespace-calendar-app';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import MobileRoomItem from './MobileRoomItem';
import MobileRoomCreatePage from './MobileRoomCreatePage';
import MobileSelectPage from './MobileSelectPage';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { getRoomId } from './MobileUtil';

const MobileContent = observer(() => {
  const { roomStore } = useCoreStores();

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

  switch (PlatformUIStore.resourceType) {
    case 'room':
      return <RoomList roomList={getRoomArray()} />;
    case 'create':
      return <MobileRoomCreatePage />;
    case 'select':
      return <MobileSelectPage />;
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
        <CalendarApp
          roomId={getRoomId()}
          channelId={getChannelId('CHN0005')}
          layoutState="collapse"
        />
      );
    case 'note':
      return (
        <NoteApp
          roomId={getRoomId()}
          channelId={getChannelId('CHN0003')}
          layoutState="collapse"
        />
      );
    default:
      return null;
  }
});

export default MobileContent;

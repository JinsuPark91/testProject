import React from 'react';
import { Talk } from 'teespace-talk-app';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import MobileRoomItem from './MobileRoomItem';
import PlatformUIStore from '../../stores/PlatformUIStore';

const MobileContent = observer(() => {
  const { roomStore } = useCoreStores();

  const roomFilter = room => room.isVisible;
  const roomArray = roomStore.getRoomArray().filter(roomFilter);

  const getRoomId = () => {
    return PlatformUIStore.resourceId;
  };

  const getChannelId = type => {
    const roomId = getRoomId();
    if (PlatformUIStore.resourceType !== 'f') {
      return roomStore
        .getRoomMap()
        .get(roomId)
        ?.channelList?.find(channel => channel.type === type)?.id;
    }
    return null;
  };

  const handleSearchClose = () => {
    PlatformUIStore.isSearchVisible = false;
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

  if (!roomArray?.length) {
    return <div>룸이 없습니다.</div>;
  }

  if (PlatformUIStore.resourceType === 'room') {
    return <RoomList roomList={roomArray} />;
  }

  return (
    <Talk
      roomId={getRoomId()}
      channelId={getChannelId('CHN0001')}
      isSearchInputVisible={PlatformUIStore.isSearchVisible}
      onSearchClose={handleSearchClose}
      isMini={false}
    />
  );
});

export default MobileContent;

import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { OfficeApp } from 'teespace-office-app';
import { useCoreStores } from 'teespace-core';

const OfficeFilePage = () => {
  const location = useLocation();
  const { fileId } = useParams();

  const { roomStore, userStore } = useCoreStores();
  const [roomId, setRoomId] = useState('');

  const getChannelId = type => {
    return roomStore
      .getRoomMap()
      .get(roomId)
      ?.channelList?.find(channel => channel.type === type)?.id;
  };

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    setRoomId(search.get('roomId'));
  }, [location.search]);

  return (
    <OfficeApp
      roomId={roomId}
      channelId={getChannelId()}
      userId={userStore.myProfile.id}
      userNick={userStore.myProfile.name}
      officeDocInfo={{ fileId }}
    />
  );
};

export default OfficeFilePage;

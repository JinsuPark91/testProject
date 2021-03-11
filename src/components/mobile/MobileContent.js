import React from 'react';
import { Talk } from 'teespace-talk-app';
import { NoteApp } from 'teespace-note-app';
import { CalendarApp } from 'teespace-calendar-app';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import MobileFriend from './friend/MobileFriend';
import MobileRoom from './room/MobileRoom';
import MobileSelectHeader from './MobileSelectHeader';
import MobileTalkHeader from './MobileTalkHeader';
import MobileProfile from './MobileProfile';
import MobileRoomCreatePage from './MobileRoomCreatePage';
import MobileSelectPage from './MobileSelectPage';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { getRoomId } from './MobileUtil';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  padding: 0.06rem 1rem 0.06rem 0.25rem;
  z-index: 100;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
`;

const handleSearchClose = () => {
  PlatformUIStore.isSearchVisible = false;
};

const MobileContent = observer(() => {
  const { roomStore } = useCoreStores();

  const getChannelId = type => {
    const roomId = getRoomId();
    return roomStore
      .getRoomMap()
      .get(roomId)
      ?.channelList?.find(channel => channel.type === type)?.id;
  };

  switch (PlatformUIStore.resourceType) {
    case 'friend':
      return <MobileFriend />;
    case 'profile':
      return <MobileProfile userId={PlatformUIStore.resourceId} />;
    case 'room':
      return <MobileRoom />;
    case 'addroom':
      return <MobileRoomCreatePage />;
    case 'select':
      return (
        <>
          <Header>
            <MobileSelectHeader />
          </Header>
          <MobileSelectPage />
        </>
      );
    case 'talk':
      return (
        <>
          <Header>
            <MobileTalkHeader />
          </Header>
          <Talk
            roomId={getRoomId()}
            channelId={getChannelId('CHN0001')}
            isSearchInputVisible={PlatformUIStore.isSearchVisible}
            onSearchClose={handleSearchClose}
            isMini={false}
          />
        </>
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

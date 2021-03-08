import React, { useState } from 'react';
import { Talk } from 'teespace-talk-app';
import { NoteApp } from 'teespace-note-app';
import { CalendarApp } from 'teespace-calendar-app';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Divider } from 'antd';
import MobileFriendHeader from './MobileFriendHeader';
import MobileRoomHeader from './MobileRoomHeader';
import MobileSelectHeader from './MobileSelectHeader';
import MobileTalkHeader from './MobileTalkHeader';
import MobileFriendItem from './MobileFriendItem';
import MobileProfile from './MobileProfile';
import MobileRoomItem from './MobileRoomItem';
import MobileRoomCreatePage from './MobileRoomCreatePage';
import MobileSelectPage from './MobileSelectPage';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { getRoomId } from './MobileUtil';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  z-index: 100;
  padding: 0rem 1rem;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
`;

const MobileContent = observer(() => {
  const { userStore, friendStore, roomStore } = useCoreStores();
  const [friendEditMode, setFriendEditMode] = useState(false);

  const handleFriendEditMode = () => {
    setFriendEditMode(!friendEditMode);
  };

  const FriendList = ({ myInfo, friendList, friendEditMode }) => {
    const friendNum = friendList.length;
    const noFriend = friendNum === 0;

    return (
      <>
        <MobileFriendItem key={myInfo?.id} friendInfo={myInfo} isMe />
        <Divider />
        {noFriend ? (
          <div>프렌즈가 없습니다.</div>
        ) : (
          <>
            <div>프렌즈 {friendNum}</div>
            {friendList.map(friendInfo => (
              <MobileFriendItem
                key={friendInfo?.friendId || friendInfo?.id}
                friendInfo={friendInfo}
                isMe={false}
                friendEditMode={friendEditMode}
              />
            ))}
          </>
        )}
      </>
    );
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

  const roomFilter = room => room.isVisible;
  const getRoomArray = () => {
    return roomStore.getRoomArray().filter(roomFilter);
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
    case 'friend':
      return (
        <>
          <Header>
            <MobileFriendHeader
              friendEditMode={friendEditMode}
              handleFriendEditMode={handleFriendEditMode}
            />
          </Header>
          <FriendList
            myInfo={userStore.myProfile}
            friendList={friendStore.friendInfoList}
            friendEditMode={friendEditMode}
          />
        </>
      );
    case 'profile':
      return <MobileProfile userId={PlatformUIStore.resourceId} />;
    case 'room':
      return (
        <>
          <Header>
            <MobileRoomHeader />
          </Header>
          <RoomList roomList={getRoomArray()} />
        </>
      );
    case 'create':
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

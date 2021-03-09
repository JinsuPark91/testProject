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
  padding: 0.63rem 1rem;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
`;

const FriendListHeader = styled.div`
  line-height: 0;
  margin: 0 1rem 0.5rem;
`;

const FriendTitle = styled.p`
  display: inline-block;
  font-size: 0.69rem;
  line-height: 1.06rem;
  color: #48423b;
  letter-spacing: 0;
  margin-right: 0.25rem;
  user-select: none;
`;

const Num = styled.span`
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: rgba(19, 19, 19, 0.5);
  letter-spacing: 0;
  user-select: none;
`;

const ListDivider = styled(Divider)`
  background-color: #f1f2f4;
  margin: 0.5rem 0.63rem;
  width: auto;
  min-width: auto;
`;

const RoomListBox = styled.div``;
const FriendListBox = styled.div``;
const MyInfoBox = styled.div`
  margin-top: 0.5rem;
`;
const MyInfoItem = styled(MobileFriendItem)`
  padding: 0 1rem;
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
        <MyInfoBox>
          <MyInfoItem key={myInfo?.id} friendInfo={myInfo} isMe />
        </MyInfoBox>
        <ListDivider />
        {noFriend ? (
          <div>프렌즈가 없습니다.</div>
        ) : (
          <>
            <FriendListHeader>
              <FriendTitle>프렌즈</FriendTitle>
              <Num>{friendNum}</Num>
            </FriendListHeader>
            <FriendListBox>
              {friendList.map(friendInfo => (
                <MobileFriendItem
                  key={friendInfo?.friendId || friendInfo?.id}
                  friendInfo={friendInfo}
                  isMe={false}
                  friendEditMode={friendEditMode}
                />
              ))}
            </FriendListBox>
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
          <FriendListBox>
            <FriendList
              myInfo={userStore.myProfile}
              friendList={friendStore.friendInfoList}
              friendEditMode={friendEditMode}
            />
          </FriendListBox>
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
          <RoomListBox>
            <RoomList roomList={getRoomArray()} />
          </RoomListBox>
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

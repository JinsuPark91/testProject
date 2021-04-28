import React, { useState } from 'react';
// import { NoteApp } from 'teespace-note-app';
// import { CalendarApp } from 'teespace-calendar-app';
import { useCoreStores } from 'teespace-core';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { useStores } from '../../stores';
import MobileFriend from './friend/MobileFriend';
import MobileAddFriend from './friend/MobileAddFriend';
import MobileProfile from './MobileProfile';
import MobileRoom from './room/MobileRoom';
import MobileRoomCreatePage from './room/MobileRoomCreatePage';
import MobileTalk from './apps/MobileTalk';
// import MobileSelect from './apps/MobileSelect';
import { getRoomId } from './MobileUtil';

const Container = styled.div`
  padding-top: 2.88rem;
  padding-bottom: 3.13rem;
  height: 100%;
  overflow-y: ${props =>
    props.appType === 'addfriend' ||
    (props.appType === 'addroom' && props.isMemberSelected)
      ? ''
      : 'auto'};
`;

//  ${props => {
//   switch (props.appType) {
//     case 'friend':
//     case 'profile':
//     case 'room':
//     case 'talk': {
//       return css`
//         height: 100%;
//         overflow-y: auto;
//       `;
//     }
//     case 'addroom': {
//       return css``;
//     }
//     case 'addfriend': {
//       return css``;
//     }
//   }
// }}

const MobileContent = () => {
  const { uiStore } = useStores();
  const { roomStore } = useCoreStores();
  const [isMemberSelected, setIsMemberSelected] = useState(false);

  const handleToggleSelected = () => {
    setIsMemberSelected(!isMemberSelected);
  };

  const handleSearchClose = () => {
    uiStore.isSearchVisible = false;
  };

  const getChannelId = type => {
    const roomId = getRoomId();
    return roomStore
      .getRoomMap()
      .get(roomId)
      ?.channelList?.find(channel => channel.type === type)?.id;
  };

  const getApplication = appType => {
    switch (appType) {
      case 'friend':
        return <MobileFriend />;
      case 'addfriend':
        return <MobileAddFriend />;
      case 'profile':
        return <MobileProfile userId={uiStore.resourceId} />;
      case 'room':
        return <MobileRoom />;
      case 'addroom':
        return <MobileRoomCreatePage onTabChange={handleToggleSelected} />;
      case 'talk':
        return (
          <MobileTalk
            roomId={getRoomId()}
            channelId={getChannelId('CHN0001')}
            isSearchInputVisible={uiStore.isSearchVisible}
            onSearchClose={handleSearchClose}
            isMini={false}
          />
        );
      // 2021. 3월 배포 제외
      // case 'select':
      //   return (
      //     <MobileSelect />
      // case 'calendar':
      //   return (
      //     <CalendarApp
      //       roomId={getRoomId()}
      //       channelId={getChannelId('CHN0005')}
      //       layoutState="collapse"
      //     />
      //   );
      // case 'note':
      //   return (
      //     <NoteApp
      //       roomId={getRoomId()}
      //       channelId={getChannelId('CHN0003')}
      //       layoutState="collapse"
      //     />
      //   );
      default:
        return null;
    }
  };

  return (
    <Observer>
      {() => (
        <Container
          appType={uiStore.resourceType}
          isMemberSelected={isMemberSelected}
        >
          {getApplication(uiStore.resourceType)}
        </Container>
      )}
    </Observer>
  );
};

export default MobileContent;

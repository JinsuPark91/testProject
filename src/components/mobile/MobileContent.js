import React, { useState } from 'react';
// import { NoteApp } from 'teespace-note-app';
// import { CalendarApp } from 'teespace-calendar-app';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { useStores } from '../../stores';
import MobileFriend from './friend/MobileFriend';
import MobileAddFriend from './friend/MobileAddFriend';
import MobileProfile from './MobileProfile';
import MobileProfileImage from './MobileProfileImage';
import MobileRoom from './room/MobileRoom';
import MobileRoomCreatePage from './room/MobileRoomCreatePage';
import MobileTalk from './apps/MobileTalk';
// import MobileSelect from './apps/MobileSelect';
import { getRoomId, findRoom } from './MobileUtil';

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

const MobileContent = () => {
  const { uiStore } = useStores();
  const [isMemberSelected, setIsMemberSelected] = useState(false);

  const handleToggleSelected = () => setIsMemberSelected(!isMemberSelected);

  const getChannelId = type => {
    return findRoom()?.channelList?.find(channel => channel.type === type)?.id;
  };

  const getApplication = appType => {
    switch (appType) {
      case 'friend':
        return <MobileFriend />;
      case 'addfriend':
        return <MobileAddFriend />;
      case 'profile':
        return <MobileProfile userId={uiStore.resourceId} />;
      case 'image':
        return <MobileProfileImage userId={uiStore.resourceId} />;
      case 'room':
        return <MobileRoom />;
      case 'addroom':
        return <MobileRoomCreatePage onTabChange={handleToggleSelected} />;
      case 'talk':
        return (
          <MobileTalk
            roomId={getRoomId()}
            channelId={getChannelId('CHN0001')}
            isMini={false}
            opts={{ autofocus: false }}
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

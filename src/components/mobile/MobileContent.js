import React from 'react';
// import { NoteApp } from 'teespace-note-app';
// import { CalendarApp } from 'teespace-calendar-app';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react';
import styled, { css } from 'styled-components';
import { useStores } from '../../stores';
import MobileFriend from './friend/MobileFriend';
import MobileAddFriend from './friend/MobileAddFriend';
import MobileProfile from './MobileProfile';
import MobileProfileImage from './MobileProfileImage';
import MobileRoom from './room/MobileRoom';
import MobileRoomCreatePage from './room/MobileRoomCreatePage';
import MobileOpenRoom from './room/open/MobileOpenRoom';
import MobileOpenRoomOptionPage from './room/open/MobileOpenRoomOptionPage';
import MobileOpenRoomCreatePage from './room/open/MobileOpenRoomCreatePage';
import MobileTalk from './apps/MobileTalk';
// import MobileSelect from './apps/MobileSelect';
import { getRoomId, findRoom } from './MobileUtil';
import MobileRoomSetting from './room/setting/MobileRoomSetting';
import MobileRoomEditName from './room/setting/MobileRoomEditName';
import MobileRoomEditMember from './room/setting/MobileRoomEditMember';

const MobileContent = () => {
  const { i18n } = useTranslation();
  const { uiStore } = useStores();

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
      case 'createroom':
        return <MobileRoomCreatePage />;
      case 'open':
        return <MobileOpenRoom />;
      case 'openoption':
        return <MobileOpenRoomOptionPage />;
      case 'createopen':
        return <MobileOpenRoomCreatePage />;
      case 'talk':
        return (
          <MobileTalk
            roomId={getRoomId()}
            channelId={getChannelId('CHN0001')}
            language={i18n.language}
            isMini={false}
            option={{ isAutoFocus: false }}
          />
        );
      case 'setting':
        return <MobileRoomSetting roomId={getRoomId()} />;
      case 'editName':
        return <MobileRoomEditName roomId={getRoomId()} />;
      case 'memberManagement':
        return <MobileRoomEditMember roomId={getRoomId()} />;
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
        <Container appType={uiStore.resourceType}>
          {getApplication(uiStore.resourceType)}
        </Container>
      )}
    </Observer>
  );
};

export default React.memo(MobileContent);

const Container = styled.div`
  padding-top: 2.88rem;
  ${props => {
    switch (props.appType) {
      default:
        return css`
          padding-bottom: 3.13rem;
        `;
      case 'editMember':
        return css`
          padding-bottom: 4.25rem;
        `;
      case 'setting':
      case 'editName':
        return css``;
    }
  }}
  height: 100%;
  overflow-y: ${props =>
    props.appType === 'addfriend' || props.appType === 'open' ? '' : 'auto'};
`;

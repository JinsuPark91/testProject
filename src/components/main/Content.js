import React, { useRef, useCallback } from 'react';
import { Observer } from 'mobx-react';
import { Talk } from 'teespace-talk-app';
import { NoteApp } from 'teespace-note-app';
import { CalendarApp } from 'teespace-calendar-app';
import { MailMainView, MailSubView } from 'teespace-mail-app';
import { DriveApp } from 'teespace-drive-app';
import { useCoreStores } from 'teespace-core';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { Wrapper, Splitter } from './ContentStyle';
import { MainAppContainer, SubAppContainer } from './AppContainer';

const Content = () => {
  const splitRef = useRef(null);
  const { roomStore } = useCoreStores();

  const getRoomId = useCallback(() => {
    if (PlatformUIStore.resourceType === 's') {
      return PlatformUIStore.resourceId;
    }
    return null;
  }, []);

  const getChannelId = useCallback(type => {
    if (PlatformUIStore.resourceType === 's') {
      const found = roomStore.rooms[
        PlatformUIStore.resourceId
      ].channelList.find(channel => channel.type === type);
      return found?.id;
    }
    return null;
  }, []);

  const getApplication = appName => {
    switch (appName) {
      case 'talk':
        return (
          <TalkApp
            roomId={getRoomId()}
            channelId={getChannelId('CHN0001')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'note':
        return (
          <NoteApp
            roomId={getRoomId()}
            channelId={getChannelId('CHN0003')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'drive':
        return (
          <DriveApp
            roomId={getRoomId()}
            channelId={getChannelId('CHN0006')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'files':
        return (
          <DriveApp
            roomId={getRoomId()}
            channelId={getChannelId('CHN0006')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'calendar':
        return (
          <CalendarApp
            roomId={getRoomId()}
            channelId={getChannelId('CHN0005')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'profile':
        return <ProfileApp />;
      case 'mail':
        return <MailMainView />;
      case 'mailSub':
        return <MailSubView />;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Splitter sizes={[75, 25]} minSize={400} gutterSize={10} ref={splitRef}>
        <MainAppContainer>
          <Observer>{() => getApplication(PlatformUIStore.mainApp)}</Observer>
        </MainAppContainer>

        <Observer>
          {() => (
            <SubAppContainer
              layoutState={PlatformUIStore.layout}
              splitRef={splitRef}
            >
              {getApplication(PlatformUIStore.subApp)}
            </SubAppContainer>
          )}
        </Observer>
      </Splitter>
    </Wrapper>
  );
};

const TalkApp = React.memo(({ channelId, roomId }) => {
  return (
    <div>{`Talk App (roomId : ${roomId} / channelId : ${channelId})`}</div>
  );
});

const ProfileApp = React.memo(() => {
  return <div>Profile!</div>;
});
export default Content;

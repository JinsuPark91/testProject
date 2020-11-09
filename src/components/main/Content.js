import React, { useRef } from 'react';
import { Observer } from 'mobx-react';
import { Talk } from 'teespace-talk-app';
import { NoteApp } from 'teespace-note-app';
import { CalendarApp } from 'teespace-calendar-app';
import { MailMainView, MailSubView } from 'teespace-mail-app';
import { DriveApp } from 'teespace-drive-app';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { Wrapper, Splitter } from './ContentStyle';
import { MainAppContainer, SubAppContainer } from './AppContainer';

const Content = () => {
  const splitRef = useRef(null);

  const getApplication = appName => {
    switch (appName) {
      case 'talk':
        return (
          <TalkApp
            channelId={PlatformUIStore.resourceId}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'note':
        return (
          <NoteApp
            channelId={PlatformUIStore.resourceId}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'drive':
        return (
          <DriveApp
            channelId={PlatformUIStore.resourceId}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'files':
        return (
          <DriveApp
            channelId={PlatformUIStore.resourceId}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'calendar':
        return (
          <CalendarApp
            channelId={PlatformUIStore.resourceId}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'profile':
        return <ProfileApp channelId={PlatformUIStore.resourceId} />;
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

const TalkApp = React.memo(({ channelId }) => {
  return <div>Talk App {channelId}</div>;
});

const ProfileApp = React.memo(() => {
  return <div>Profile!</div>;
});
export default Content;

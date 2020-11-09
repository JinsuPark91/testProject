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
        return <Talk />;
      case 'note':
        return <NoteApp layoutState={PlatformUIStore.layout} />;
      case 'drive':
        return <DriveApp />;
      case 'schedule':
        return <CalendarApp />;
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

const ProfileApp = React.memo(() => {
  return <div>Profile!</div>;
});
export default Content;

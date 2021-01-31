import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { Talk } from 'teespace-talk-app';
import { NoteApp } from 'teespace-note-app';
import { CalendarApp } from 'teespace-calendar-app';
import { MailMainView, MailSubView } from 'teespace-mail-app';
import { DriveApp, DriveAllApp } from 'teespace-drive-app';
import { App as MeetingApp } from 'teespace-meeting-app';
import { useCoreStores, AppState } from 'teespace-core';
import RoomSetting from '../Rooms/RoomSetting';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { Wrapper, Splitter } from './ContentStyle';
import { MainAppContainer, SubAppContainer } from './AppContainer';
import Profile from '../Profile';

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const Content = () => {
  const { userStore, roomStore } = useCoreStores();
  const history = useHistory();
  const splitRef = useRef(null);
  const contentRef = useRef(null);
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    if (contentRef) {
      PlatformUIStore.content.rect = contentRef.current.getBoundingClientRect();
    }
  });

  const getRoomId = () => {
    if (PlatformUIStore.resourceType !== 'f') {
      return PlatformUIStore.resourceId;
    }
    return null;
  };

  const getChannelId = type => {
    const roomId = getRoomId();
    if (PlatformUIStore.resourceType !== 'f') {
      return roomStore
        .getRoomMap()
        .get(roomId)
        ?.channelList?.find(channel => channel.type === type)?.id;
    }
    return null;
  };

  const handleSearchClose = () => {
    PlatformUIStore.isSearchVisible = false;
  };

  const handleSplitDragStart = ratio => {
    const splitter = splitRef?.current?.parent;
    const gutter = splitter.childNodes[1];

    if (gutter) {
      gutter.classList.add('gutter--active');
    }
  };

  const handleSplitDragEnd = ratio => {
    const splitter = splitRef?.current?.parent;
    const gutter = splitter.childNodes[1];

    if (gutter) {
      gutter.classList.remove('gutter--active');
    }
  };

  const getApplication = appName => {
    switch (appName) {
      case 'talk':
        return (
          <Talk
            roomId={getRoomId()}
            channelId={getChannelId('CHN0001')}
            layoutState={PlatformUIStore.layout}
            isSearchInputVisible={PlatformUIStore.isSearchVisible}
            onSearchClose={handleSearchClose}
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
            userId={myUserId}
            roomId={getRoomId()}
            channelId={getChannelId('CHN0006')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'files':
        return (
          <DriveAllApp
            userId={myUserId}
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
      case 'meeting':
        return (
          <MeetingApp
            roomId={getRoomId()}
            channelId={getChannelId('CHN0005')}
            layoutState={PlatformUIStore.layout}
            appState={PlatformUIStore.subAppState}
            onChangeAppState={state => {
              PlatformUIStore.subAppState = state;
              if (state === AppState.STOPPED) {
                history.push(PlatformUIStore.nextLocation);
              }
            }}
          />
        );
      case 'mail':
        return <MailMainView />;
      case 'mailsub':
        return <MailSubView />;
      case 'profile':
        return <Profile userId={PlatformUIStore.resourceId} />;
      case 'setting':
        return (
          <RoomSetting roomInfo={roomStore.getRoomMap().get(getRoomId())} />
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper ref={contentRef}>
      <Observer>
        {() => {
          const width = window.innerWidth;
          const mainDefaultWidth = 50 - (remToPixel(16.19) * 100) / width;
          const subDefaultWidth = 100 - mainDefaultWidth;

          const mainMinWidth = width / 2 - remToPixel(16.19);
          const subMinWidth = (width * 2) / 7;

          return (
            <Splitter
              sizes={
                PlatformUIStore.resourceType === 'm'
                  ? [38, 62]
                  : [mainDefaultWidth, subDefaultWidth]
              }
              minSize={[mainMinWidth, subMinWidth]}
              gutter={() => {
                const gutter = document.createElement('div');
                gutter.classList.add('gutter', 'gutter-horizontal');

                const rect = document.createElement('span');
                rect.classList.add('gutter__rect');

                gutter.appendChild(rect);
                return gutter;
              }}
              gutterStyle={() => {
                return {
                  width: '0.3125rem',
                };
              }}
              onDragStart={handleSplitDragStart}
              onDragEnd={handleSplitDragEnd}
              ref={splitRef}
            >
              <MainAppContainer>
                {getApplication(PlatformUIStore.mainApp)}
              </MainAppContainer>

              <SubAppContainer
                layoutState={PlatformUIStore.layout}
                splitRef={splitRef}
              >
                {getApplication(PlatformUIStore.subApp)}
              </SubAppContainer>
            </Splitter>
          );
        }}
      </Observer>
    </Wrapper>
  );
};

export default Content;

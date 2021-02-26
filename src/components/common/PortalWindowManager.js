import React, { useEffect, useRef, useState } from 'react';
import { Observer } from 'mobx-react';
import { usePortalWindow, useCoreStores, AppState } from 'teespace-core';
import { Talk } from 'teespace-talk-app';
import { App as MeetingApp } from 'teespace-meeting-app';
import PlatformUIStore from '../../stores/PlatformUIStore';
import LoadingImg from '../../assets/WAPL_Loading.gif';
import FloatingButton from './FloatingButton';

const WindowEventListener = ({
  onOpen = () => {},
  onClose = () => {},
  children,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      onOpen();
      const window = ref.current?.ownerDocument?.defaultView;
      window.addEventListener('beforeunload', e => {
        e.preventDefault();
        e.returnValue = '';
        onClose();
      });
    }
  }, [ref]);

  return <div ref={ref}>{children}</div>;
};

const Window = ({ windowInfo, children }) => {
  const openWindow = usePortalWindow();

  const handleClose = () => {
    PlatformUIStore.closeWindow('meeting', windowInfo.id);
    // PlatformUIStore.subAppState = AppState.STOPPED;
  };

  useEffect(() => {
    const info = openWindow({
      element: (
        <WindowEventListener onClose={handleClose}>
          {children}
        </WindowEventListener>
      ),
      // opts: windowInfo.type === 'talk' ? 'width=600, height=900' : '',
      opts: '',
      title: 'Hyper Meeting',
    });

    const window = PlatformUIStore.getWindow('meeting', windowInfo.id);
    window.handler = Array.from(info.values())?.[0]?.handler;
  }, []);

  return null;
};

const PortalWindowManager = () => {
  const { roomStore } = useCoreStores();

  const getChannelId = (roomId, type) => {
    return roomStore
      .getRoomMap()
      .get(roomId)
      ?.channelList?.find(channel => channel.type === type)?.id;
  };

  const getComponent = windowInfo => {
    const { id: roomId, type: app } = windowInfo;
    switch (app) {
      // case 'talk':
      //   return (
      //     <Talk
      //       roomId={roomId}
      //       channelId={getChannelId(roomId, 'CHN0001')}
      //       layoutState="expand"
      //       isSearchInputVisible={false}
      //       onSearchClose={() => {}}
      //       isMini
      //     />
      //   );
      case 'meeting':
        return (
          <MeetingApp
            roomId={roomId}
            channelId={getChannelId(roomId, 'CHN0005')}
            layoutState="collapse"
            // appState={PlatformUIStore.subAppState}
            // onChangeAppState={state => {
            //   PlatformUIStore.subAppState = state;
            //   // LAUNCHING: 'launching',
            //   // INITIALIZING: 'initializing',
            //   // RUNNING: 'running',
            //   // BEFORE_STOP: 'before_stop',
            //   // STOPPED: 'stopped',
            //   // ERROR: 'error'
            // }}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Observer>
      {() =>
        PlatformUIStore.getWindows('meeting').map(windowInfo => {
          console.log('Observer');
          return (
            <Window key={windowInfo.id} windowInfo={windowInfo}>
              {getComponent(windowInfo)}
              {/* <span>{`New Window : ${windowInfo.id}`}</span> */}
            </Window>
          );
        })
      }
    </Observer>
  );
};

export default PortalWindowManager;

import React, { useEffect } from 'react';
import { Observer } from 'mobx-react';
import FloatingButton from './FloatingButton';
import { runWatcher, stopWatcher } from '../../utils/Watcher';
import { useStores } from '../../stores';

const Window = ({ windowInfo }) => {
  const { uiStore } = useStores();
  const { id: windowId, type: app } = windowInfo;
  const url = `/s/${windowId}/${app}?mini=true`;

  const getSpecs = appName => {
    if (appName === 'meeting') return '';

    const width = 600;
    const height = 800;
    const options = {
      width,
      height,
      top: (window.innerHeight - height) / 2 + window.screenY,
      left: (window.innerWidth - width) / 2 + window.screenX,
    };
    return Object.entries(options)
      .map(entry => entry.join('='))
      .join(',');
  };

  useEffect(() => {
    const handler = window.open(url, '_blank', getSpecs(app));
    const info = uiStore.getWindow(app, windowId);
    if (info) {
      info.handler = handler;
      handler.focus();
    }
  }, []);

  return null;
};

const WindowManager = () => {
  const { uiStore } = useStores();

  useEffect(() => {
    runWatcher();

    return () => stopWatcher();
  }, []);

  return (
    <Observer>
      {() => {
        const talkWindows = uiStore.getWindows('talk');
        return (
          <>
            {uiStore.getWindows('talk').map(window => (
              <Window key={window.id} windowInfo={window} />
            ))}
            {uiStore.getWindows('meeting').map(window => (
              <Window key={window.id} windowInfo={window} />
            ))}
            <FloatingButton
              // visible={talkWindows.length}
              visible={false}
              rooms={talkWindows}
              count={5}
              onItemClick={roomInfo => {
                uiStore.focusWindow('talk', roomInfo.id);
              }}
              onItemClose={roomInfo => {
                console.log('ROOM INFO : ', roomInfo);
                uiStore.closeWindow('talk', roomInfo.id);
              }}
              onCloseAll={() => {
                uiStore.closeAllWindow('talk');
              }}
            />
          </>
        );
      }}
    </Observer>
  );
};

export default WindowManager;

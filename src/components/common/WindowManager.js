import React from 'react';
import { Observer } from 'mobx-react';
import { useStores } from '../../stores';
import WindowItem from './WindowItem';

const WindowManager = () => {
  const { uiStore } = useStores();

  return (
    <Observer>
      {() => {
        const talkWindows = uiStore.getWindows('talk')?.length;
        const meetingWindows = uiStore.getWindows('meeting')?.length;

        if (!talkWindows && !meetingWindows) return null;
        return <WindowItem />;
      }}
    </Observer>
  );
};

export default WindowManager;

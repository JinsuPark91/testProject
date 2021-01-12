import React from 'react';
import { Observer } from 'mobx-react';
import { talkRoomStore } from 'teespace-talk-app';
// import PlatformUIStore from '../../stores/PlatformUIStore';

const FaviconChanger = () => {
  const changeFavicon = isAlarm => {
    const favicon = document.getElementById('favicon');
    favicon.href = `/favicon${isAlarm ? '_alarm' : ''}.ico`;
  };

  return (
    <Observer>
      {() => {
        let isAlarm = false;
        if (talkRoomStore.totalUnreadCount > 0) {
          // if (PlatformUIStore.layout === 'collapse') {
          isAlarm = true;
        }
        changeFavicon(isAlarm);
        return null;
      }}
    </Observer>
  );
};

export default FaviconChanger;

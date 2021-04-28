import React from 'react';
import { Observer } from 'mobx-react';
import { useStores } from '../../stores';

const FaviconChanger = () => {
  const { uiStore } = useStores();
  const changeFavicon = isAlarm => {
    const favicon = document.getElementById('favicon');
    favicon.href = `/favicon${isAlarm ? '_alarm' : ''}.ico`;
  };

  return (
    <Observer>
      {() => {
        let isAlarm = false;
        if (uiStore.totalUnreadCount > 0) {
          // if (uiStore.layout === 'collapse') {
          isAlarm = true;
        }
        changeFavicon(isAlarm);
        return null;
      }}
    </Observer>
  );
};

export default FaviconChanger;

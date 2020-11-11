import React from 'react';
import { Observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { NoteIcon } from 'teespace-note-app';
import { DriveIcon, ViewFileIcon } from 'teespace-drive-app';
import { CalendarIcon } from 'teespace-calendar-app';
import { useCoreStores } from 'teespace-core';
import { Wrapper, Title, AppIconContainer, UserMenu } from './HeaderStyle';
import Photos from '../Photos';
import PlatformUIStore from '../../stores/PlatformUIStore';

const apps = ['note', 'drive', 'calendar', 'files'];

const Header = () => {
  const history = useHistory();
  const { roomStore } = useCoreStores();

  const getRoomName = () => {
    if (PlatformUIStore.resourceType === 's') {
      const roomInfo = roomStore.rooms[PlatformUIStore.resourceId];
      if (roomInfo?.name) return roomInfo.name;
      return '이름 없음';
    }
    return null;
  };

  const thumbs = [
    'https://w.namu.la/s/f5ebe7f90296e3147f623f79083cf4487d82549ada2b5c022fae52c794009a31bccc8972f5aebe70d95edf52cec56a9681e6b33764cf22d5cfb380bacfd1cc22526e6de9e8bf99f658c761da4ccc545dd942c0f38dd11d91fe98558c68335488',
    'https://w.namu.la/s/ac4e43dffb27074a0e00149053c9121d1f23da8865d58a4cf942f9227270664358ac17e2244d1e9f20f4fd57cddcbff4aaa5be427ce2db3640ae3736815338ca8ba7bf58f062446c05f205a3fcbc9ddc4771a3b046662b66138069d3804a9fb6',
    'https://w.namu.la/s/aa021c62d70f9f4a21e3b25adf4bf5cac54073fb0ae1620cc67c668be226a0f63a35da80f8c2552a7bd92ab3a8fdf0f76cc0cff470579d51c94236b34a1438ff1050f62581bbf341ec817ad3002f1c4bdc6cf9780458304dc72269965d068791',
  ];

  const handleAppClick = appName => {
    history.push({
      pathname: history.location.pathname,
      search: `?sub=${appName}`,
    });
  };

  const getAppIcon = appName => {
    const props = {
      key: appName,
      state: PlatformUIStore.subApp === appName ? 'active' : 'default',
      onClick: () => handleAppClick(appName),
    };

    switch (appName) {
      case 'note':
        return <NoteIcon {...props} />;
      case 'drive':
        return <DriveIcon {...props} />;
      case 'calendar':
        return <CalendarIcon {...props} />;
      case 'files':
        return <ViewFileIcon {...props} />;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Title>
        <Observer>
          {() => {
            return PlatformUIStore.resourceType === 's' ? (
              <>
                <Photos srcList={thumbs} maxCount={4} />
                <span>{getRoomName()}</span>
              </>
            ) : null;
          }}
        </Observer>
      </Title>

      <AppIconContainer>
        <Observer>{() => apps.map(appName => getAppIcon(appName))}</Observer>
      </AppIconContainer>

      <UserMenu>
        <span>User</span>
      </UserMenu>
    </Wrapper>
  );
};

export default Header;

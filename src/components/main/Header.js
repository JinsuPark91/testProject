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
  const { roomStore, userStore } = useCoreStores();

  const getRoomName = () => {
    if (PlatformUIStore.resourceType === 's') {
      const roomInfo = roomStore.rooms[PlatformUIStore.resourceId];
      if (roomInfo?.name) return roomInfo.name;
      return '이름 없음';
    }
    return null;
  };

  const getUserPhotos = () => {
    if (PlatformUIStore.resourceType === 's') {
      return roomStore.rooms[PlatformUIStore.resourceId].memberIdListString
        .split(',')
        .splice(0, 4)
        .map(
          userId =>
            `/${userStore.getUserProfilePhoto({
              userId,
              size: 'small',
              isLocal: true,
            })}`,
        );
    }
    return null;
  };

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
                <Photos srcList={getUserPhotos()} maxCount={4} />
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

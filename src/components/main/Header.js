import React from 'react';
import { Observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { NoteIcon } from 'teespace-note-app';
import { DriveIcon, ViewFileIcon } from 'teespace-drive-app';
import { CalendarIcon } from 'teespace-calendar-app';
import { useCoreStores } from 'teespace-core';
import {
  Wrapper,
  TitleWrapper,
  Title,
  AppIconContainer,
  UserMenu,
  TitleText,
  UserCountText,
  IconWrapper,
  SystemIconContainer,
} from './HeaderStyle';
import Photos from '../Photos';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { ExportIcon, SearchIcon, AddAcountIcon } from '../Icons';

const apps = ['note', 'drive', 'calendar', 'files', 'meeting'];

const Header = () => {
  const history = useHistory();
  const { roomStore, userStore } = useCoreStores();

  const findRoom = () => {
    if (PlatformUIStore.resourceType === 's') {
      return roomStore.rooms?.[PlatformUIStore.resourceId];
    }
    return null;
  };

  const getRoomName = () => {
    const found = findRoom();
    if (found && found?.name) {
      return found.name;
    }
    return null;
  };

  const getUserCount = () => {
    const found = findRoom();
    if (found && found?.userCount) {
      return found.userCount;
    }
    return null;
  };

  const getUserPhotos = () => {
    const found = findRoom();
    if (found && found?.memberIdListString) {
      return found.memberIdListString
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
    return [];
  };

  const handleExport = () => {
    console.log('handleExport');
  };
  const handleSearch = () => {
    console.log('handleSearch');
  };
  const handleAddMember = () => {
    console.log('handleAddMember');
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
      case 'meeting':
        return <span {...props}>meeting icon</span>;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>
          <Observer>
            {() => {
              return PlatformUIStore.resourceType === 's' ? (
                <>
                  <Photos srcList={getUserPhotos()} />
                  <TitleText>{getRoomName()}</TitleText>
                  <UserCountText>{getUserCount()}</UserCountText>
                </>
              ) : null;
            }}
          </Observer>
        </Title>
        <SystemIconContainer>
          <IconWrapper onClick={handleExport}>
            <ExportIcon />
          </IconWrapper>
          <IconWrapper onClick={handleSearch}>
            <SearchIcon />
          </IconWrapper>
          <IconWrapper onClick={handleAddMember}>
            <AddAcountIcon />
          </IconWrapper>
        </SystemIconContainer>
      </TitleWrapper>

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

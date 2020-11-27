import React from 'react';
import { Observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
// import { NoteIcon } from 'teespace-note-app';
// import { DriveIcon, ViewFileIcon } from 'teespace-drive-app';
// import { CalendarIcon } from 'teespace-calendar-app';
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
  AppIconWrapper,
} from './HeaderStyle';
import Photos from '../Photos';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { ProfileContextProvider } from '../profile/ProfileContextProvider';
import MyProfileInfo from '../profile/MyProfileInfo';
import {
  ExportIcon,
  SearchIcon,
  AddAcountIcon,
  NoteIcon,
  NoteActiveIcon,
  DriveIcon,
  DriveActiveIcon,
  CalendarIcon,
  CalendarActiveIcon,
  ViewFileIcon,
  ViewFileActiveIcon,
  MeetingIcon,
  MeetingActiveIcon,
} from '../Icons';

const apps = [
  {
    name: 'drive',
    icons: {
      active: <DriveActiveIcon width={1.5} height={1.5} />,
      default: <DriveIcon width={1.5} height={1.5} />,
    },
  },
  {
    name: 'calendar',
    icons: {
      active: <CalendarActiveIcon width={1.5} height={1.5} />,
      default: <CalendarIcon width={1.5} height={1.5} />,
    },
  },
  {
    name: 'note',
    icons: {
      active: <NoteActiveIcon width={1.5} height={1.5} />,
      default: <NoteIcon width={1.5} height={1.5} />,
    },
  },

  {
    name: 'meeting',
    icons: {
      active: <MeetingActiveIcon width={1.5} height={1.5} />,
      default: <MeetingIcon width={1.5} height={1.5} />,
    },
  },
  {
    name: 'files',
    icons: {
      active: <ViewFileActiveIcon width={1.5} height={1.5} />,
      default: <ViewFileIcon width={1.5} height={1.5} />,
    },
  },
];

const AppIcon = React.memo(
  ({ subApp, appName, onClick, defaultIcon, activeIcon }) => {
    const handleAppClick = () => {
      onClick(appName);
    };

    return (
      <AppIconWrapper key={appName} onClick={handleAppClick}>
        {subApp === appName ? activeIcon : defaultIcon}
      </AppIconWrapper>
    );
  },
);

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
        <Observer>
          {() =>
            apps.map(({ name, icons }) => (
              <AppIcon
                subApp={PlatformUIStore.subApp}
                appName={name}
                onClick={handleAppClick}
                defaultIcon={icons.default}
                activeIcon={icons.active}
              />
            ))
          }
        </Observer>
      </AppIconContainer>

      <UserMenu>
        <ProfileContextProvider>
          <MyProfileInfo />
        </ProfileContextProvider>
      </UserMenu>
    </Wrapper>
  );
};

export default Header;

import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
// import { NoteIcon } from 'teespace-note-app';
// import { DriveIcon, ViewFileIcon } from 'teespace-drive-app';
// import { CalendarIcon } from 'teespace-calendar-app';
import { useCoreStores } from 'teespace-core';
import MeetingApp from 'teespace-meeting-app';
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
import MyProfileInfo from '../profile/MyProfileInfo';
import RoomInquiryModal from '../Rooms/RoomInquiryModal';
import RoomAddMemberModal from '../Rooms/RoomAddMemberModal';
import ProfileInfoModal from '../profile/ProfileInfoModal';
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
  MeetingDisabledIcon,
} from '../Icons';
import { getQueryParams, getQueryString } from '../../utils/UrlUtil';

const apps = [
  {
    name: 'drive',
    icons: {
      active: <DriveActiveIcon width={1.5} height={1.5} />,
      disabled: <DriveIcon width={1.5} height={1.5} />,
      default: <DriveIcon width={1.5} height={1.5} />,
    },
    isUsedInMyRoom: true,
  },
  {
    name: 'calendar',
    icons: {
      active: <CalendarActiveIcon width={1.5} height={1.5} />,
      disabled: <CalendarIcon width={1.5} height={1.5} />,
      default: <CalendarIcon width={1.5} height={1.5} />,
    },
    isUsedInMyRoom: true,
  },
  {
    name: 'note',
    icons: {
      active: <NoteActiveIcon width={1.5} height={1.5} />,
      disabled: <NoteIcon width={1.5} height={1.5} />,
      default: <NoteIcon width={1.5} height={1.5} />,
    },
    isUsedInMyRoom: true,
  },

  {
    name: 'meeting',
    icons: {
      active: <MeetingActiveIcon width={1.5} height={1.5} />,
      disabled: <MeetingDisabledIcon width={1.5} height={1.5} />,
      default: <MeetingIcon width={1.5} height={1.5} />,
    },
    isUsedInMyRoom: false,
  },
  {
    name: 'files',
    icons: {
      active: <ViewFileActiveIcon width={1.5} height={1.5} />,
      disabled: <ViewFileIcon width={1.5} height={1.5} />,
      default: <ViewFileIcon width={1.5} height={1.5} />,
    },
    isUsedInMyRoom: true,
  },
];

const AppIcon = React.memo(
  ({
    subApp,
    appName,
    onClick,
    defaultIcon,
    activeIcon,
    disabledIcon,
    disabled,
  }) => {
    const handleAppClick = () => {
      onClick(appName);
    };

    let icon = defaultIcon;
    if (disabled) {
      icon = disabledIcon;
    } else {
      icon = subApp === appName ? activeIcon : defaultIcon;
    }

    return (
      <AppIconWrapper
        className="header__app-icon"
        key={appName}
        onClick={handleAppClick}
        disabled={disabled}
      >
        {icon}
      </AppIconWrapper>
    );
  },
);

const Header = observer(() => {
  const history = useHistory();
  const { roomStore, userStore } = useCoreStores();
  const [isRoomProfileVisible, setRoomProfileVisible] = useState(false);
  const [isAddMemberVisible, setAddMemberVisible] = useState(false);
  const [appConfirm, setAppConfirm] = useState();

  const findRoom = () => {
    if (PlatformUIStore.resourceType !== 'f') {
      return roomStore.getRoomMap().get(PlatformUIStore.resourceId);
    }
    return null;
  };

  const getRoomName = () => {
    const found = findRoom();
    if (found) {
      if (found?.type === 'WKS0001') {
        return userStore.myProfile.nick || userStore.myProfile.name;
      }
      if (found?.customName || found?.name) {
        return found?.customName || found?.name;
      }
    }

    return null;
  };

  const isMyRoom = () => {
    const found = findRoom();
    return found?.type === 'WKS0001';
  };

  const isDMRoom = () => {
    const found = findRoom();
    return !!found?.isDirectMsg;
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
      let userIds = found.memberIdListString.split(',').splice(0, 4);

      if (found.isDirectMsg) {
        userIds = userIds.filter(userId => userId !== userStore.myProfile.id);
      }

      return userIds.map(
        userId => `${userStore.getProfilePhotoURL(userId, 'small')}`,
      );
    }
    return [];
  };

  const roomId = findRoom()?.id;
  const members = roomStore.roomMembers[roomId] || [];

  const handleExport = () => {
    console.log('handleExport');
  };

  const handleSearch = () => {
    PlatformUIStore.isSearchVisible = true;
  };

  const openSubApp = async appName => {
    const queryParams = { ...getQueryParams(), sub: appName };
    const queryString = getQueryString(queryParams);

    if (PlatformUIStore.resourceType === 'f') {
      try {
        const response = await roomStore.getDMRoom(
          userStore.myProfile.id,
          userStore.myProfile.id,
        );
        if (!response.result) {
          throw Error('DM ROOM GET FAILED');
        }
        history.push(`/s/${response.roomInfo.id}/talk?${queryString}`);
      } catch (e) {
        console.error(`Error is${e}`);
      }
    } else {
      history.push(`${history.location.pathname}?${queryString}`);
    }
  };

  const closeSubApp = () => {
    history.push({
      pathname: history.location.pathname,
    });
  };

  const handleAppClick = async appName => {
    if (PlatformUIStore.subApp !== appName) {
      if (appName === 'meeting') {
        const meetingAppConfirm = (
          <MeetingApp.ConfirmLaunchApp
            onConfirm={() => {
              setAppConfirm(null);
              openSubApp(appName);
            }}
            onCancel={() => {
              setAppConfirm(null);
            }}
          />
        );
        setAppConfirm(meetingAppConfirm);
      } else {
        openSubApp(appName);
      }
    } else {
      closeSubApp();
    }
  };

  const handleClickRoomPhoto = useCallback(() => {
    setRoomProfileVisible(true);
  }, []);

  const handleCancelRoomMemeberModal = useCallback(() => {
    setRoomProfileVisible(false);
  }, []);

  const handleAddMember = () => {
    setAddMemberVisible(true);
  };

  const handleInviteUsers = async (_, resultRoomId) => {
    // 1:1 룸에 초대한 경우 새로운 룸이 생성되는데, 이 경우 그 룸으로 이동해야함.
    if (findRoom()?.id !== resultRoomId) {
      history.push(`/s/${resultRoomId}/talk`);
    }

    setAddMemberVisible(false);
  };

  const handleCancelInviteUsers = () => {
    setAddMemberVisible(false);
  };

  const currRoomInfo = findRoom();
  let profileModal;

  if (isMyRoom()) {
    profileModal = (
      <ProfileInfoModal
        userId={userStore.myProfile.id}
        visible={isRoomProfileVisible}
        onClose={handleCancelRoomMemeberModal}
        position={{ top: '3.5rem', left: '17rem' }}
      />
    );
  } else if (currRoomInfo?.userCount === 2) {
    const dmUserId = currRoomInfo.memberIdListString
      .split(',')
      .find(userId => userId !== userStore.myProfile.id);

    profileModal = (
      <ProfileInfoModal
        userId={dmUserId}
        visible={isRoomProfileVisible}
        onClose={handleCancelRoomMemeberModal}
        position={{ top: '3.5rem', left: '17rem' }}
      />
    );
  } else {
    profileModal = (
      <RoomInquiryModal
        roomId={findRoom()?.id}
        visible={isRoomProfileVisible}
        onCancel={handleCancelRoomMemeberModal}
        width="17.5rem"
        top="3.5rem"
        left="17rem"
      />
    );
  }

  return (
    <Wrapper>
      <TitleWrapper>
        {PlatformUIStore.resourceType !== 'f' && (
          <>
            <Title>
              <Photos
                srcList={getUserPhotos()}
                onClick={handleClickRoomPhoto}
              />
              <TitleText>{getRoomName()}</TitleText>
              {!(isMyRoom() || isDMRoom()) ? (
                <UserCountText>{getUserCount()}</UserCountText>
              ) : null}
              {profileModal}
            </Title>

            {PlatformUIStore.resourceType !== 'm' && (
              <SystemIconContainer>
                {/* <IconWrapper onClick={handleExport}>
                  <ExportIcon />
                </IconWrapper> */}
                {PlatformUIStore.layout !== 'expand' && (
                  <IconWrapper onClick={handleSearch}>
                    <SearchIcon />
                  </IconWrapper>
                )}
                {!isMyRoom() && (
                  <>
                    <IconWrapper onClick={handleAddMember}>
                      <AddAcountIcon />
                    </IconWrapper>
                    {isAddMemberVisible && (
                      <RoomAddMemberModal
                        visible={isAddMemberVisible}
                        roomId={findRoom()?.id}
                        roomMembers={members}
                        onInviteUsers={handleInviteUsers}
                        onCancel={handleCancelInviteUsers}
                      />
                    )}
                  </>
                )}
              </SystemIconContainer>
            )}
          </>
        )}
      </TitleWrapper>

      <AppIconContainer>
        {appConfirm}
        {apps.map(({ name, icons, isUsedInMyRoom }) => (
          <AppIcon
            key={name}
            subApp={PlatformUIStore.subApp}
            appName={name}
            onClick={handleAppClick}
            defaultIcon={icons.default}
            activeIcon={icons.active}
            disabledIcon={icons.disabled}
            disabled={isMyRoom() && !isUsedInMyRoom}
          />
        ))}
      </AppIconContainer>

      <UserMenu>
        <MyProfileInfo />
      </UserMenu>
    </Wrapper>
  );
});

export default Header;

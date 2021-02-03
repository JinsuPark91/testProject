import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useCoreStores, ProfileInfoModal } from 'teespace-core';
import MeetingApp from 'teespace-meeting-app';
import { Tooltip } from 'antd';
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
  StyledPhotos,
  VerticalBar,
} from './HeaderStyle';
import PlatformUIStore from '../../stores/PlatformUIStore';
import MyProfileInfo from '../profile/MyProfileInfo';
import RoomInquiryModal from '../Rooms/RoomInquiryModal';
import RoomAddMemberModal from '../Rooms/RoomAddMemberModal';
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
import { getQueryParams, getQueryString } from '../../utils/UrlUtil';

const getIconStyle = (isDisabled = false) => {
  return {
    width: 1.38,
    height: 1.38,
    color: isDisabled ? 'rgba(68, 77, 89, 0.3)' : '#232D3B',
  };
};

const apps = [
  {
    name: 'drive',
    icons: {
      active: <DriveActiveIcon {...getIconStyle()} />,
      disabled: <DriveIcon {...getIconStyle(true)} />,
      default: <DriveIcon {...getIconStyle()} />,
    },
    isUsedInMyRoom: true,
    isSeperated: false,
    isUsedInProfile: true,
  },
  {
    name: 'calendar',
    icons: {
      active: <CalendarActiveIcon {...getIconStyle()} />,
      disabled: <CalendarIcon {...getIconStyle(true)} />,
      default: <CalendarIcon {...getIconStyle()} />,
    },
    isUsedInMyRoom: true,
    isSeperated: false,
    isUsedInProfile: true,
  },
  {
    name: 'note',
    icons: {
      active: <NoteActiveIcon {...getIconStyle()} />,
      disabled: <NoteIcon {...getIconStyle(true)} />,
      default: <NoteIcon {...getIconStyle()} />,
    },
    isUsedInMyRoom: true,
    isSeperated: false,
    isUsedInProfile: true,
  },

  {
    name: 'meeting',
    icons: {
      active: <MeetingActiveIcon {...getIconStyle()} />,
      disabled: <MeetingIcon {...getIconStyle(true)} />,
      default: <MeetingIcon {...getIconStyle()} />,
    },
    isUsedInMyRoom: false,
    isSeperated: false,
    isUsedInProfile: false,
  },
  {
    name: 'files',
    icons: {
      active: <ViewFileActiveIcon {...getIconStyle()} />,
      disabled: <ViewFileIcon {...getIconStyle(true)} />,
      default: <ViewFileIcon {...getIconStyle()} />,
    },
    isUsedInMyRoom: true,
    isSeperated: true,
    isUsedInProfile: true,
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
    const AppToolTipName = appName.charAt(0).toUpperCase() + appName.slice(1);
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
      <Tooltip
        placement="bottom"
        title={
          AppToolTipName.toLowerCase() === 'files' ? '모아보기' : AppToolTipName
        }
        color="#232D3B"
      >
        <AppIconWrapper
          className="header__app-icon"
          key={appName}
          onClick={handleAppClick}
          disabled={disabled}
        >
          {icon}
        </AppIconWrapper>
      </Tooltip>
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
    const roomInfo = findRoom();

    const isOpened = PlatformUIStore.getWindow(roomInfo.id);
    if (!isOpened) {
      PlatformUIStore.openWindow({
        id: roomInfo.id,
        type: 'talk',
        name: roomInfo.name,
        userCount: roomInfo.userCount,
        handler: null,
      });
    } else {
      PlatformUIStore.focusWindow(roomInfo.id);
    }
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
    const queryParams = getQueryParams();
    delete queryParams.sub;
    const queryString = getQueryString(queryParams);

    history.push(`${history.location.pathname}?${queryString}`);
  };

  const openMeeting = () => {
    const roomInfo = findRoom();

    PlatformUIStore.openWindow({
      id: roomInfo.id,
      type: 'meeting',
      name: roomInfo.name,
      userCount: roomInfo.userCount,
      handler: null,
    });
    // const isOpened = PlatformUIStore.getWindow(roomInfo.id);
    // if (!isOpened) {
    //   PlatformUIStore.openWindow({
    //     id: roomInfo.id,
    //     type: 'meeting',
    //     name: roomInfo.name,
    //     userCount: roomInfo.userCount,
    //     handler: null,
    //   });
    // } else {
    //   PlatformUIStore.focusWindow(roomInfo.id);
    // }
  };

  const handleAppClick = async appName => {
    if (PlatformUIStore.subApp !== appName) {
      if (appName === 'meeting') {
        const meetingAppConfirm = (
          <MeetingApp.ConfirmLaunchApp
            onConfirm={() => {
              setAppConfirm(null);
              openMeeting();

              // openSubApp(appName);
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
              <StyledPhotos
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
                {PlatformUIStore.layout !== 'expand' && (
                  <>
                    <IconWrapper
                      onClick={handleExport}
                      style={{ marginRight: '0.44rem' }}
                    >
                      <ExportIcon width={1.25} height={1.25} color="#232D3B" />
                    </IconWrapper>
                    <IconWrapper
                      onClick={handleSearch}
                      style={{ marginRight: '0.44rem' }}
                    >
                      <SearchIcon width={1.25} height={1.25} color="#232D3B" />
                    </IconWrapper>
                  </>
                )}
                {!isMyRoom() && (
                  <>
                    <IconWrapper
                      onClick={handleAddMember}
                      style={{ marginRight: '0.69rem' }}
                    >
                      <AddAcountIcon
                        width={1.25}
                        height={1.25}
                        color="#232D3B"
                      />
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
        {apps.map(
          ({ name, icons, isUsedInMyRoom, isSeperated, isUsedInProfile }) => (
            <div key={name}>
              {isSeperated ? <VerticalBar /> : null}
              <AppIcon
                key={name}
                subApp={PlatformUIStore.subApp}
                appName={name}
                onClick={handleAppClick}
                defaultIcon={icons.default}
                activeIcon={icons.active}
                disabledIcon={icons.disabled}
                disabled={
                  (isMyRoom() && !isUsedInMyRoom) ||
                  (PlatformUIStore.resourceType === 'f' && !isUsedInProfile)
                }
              />
            </div>
          ),
        )}
      </AppIconContainer>

      <UserMenu>
        <MyProfileInfo />
      </UserMenu>
    </Wrapper>
  );
});

export default Header;

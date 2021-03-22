import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useCoreStores, ProfileInfoModal, logEvent } from 'teespace-core';
import MeetingApp from 'teespace-meeting-app';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  Wrapper,
  TitleWrapper,
  Title,
  AppIconContainer,
  AppIconbutton,
  UserMenu,
  TitleText,
  UserCountText,
  IconWrapper,
  SystemIconContainer,
  AppIconInner,
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
  OpenChatIcon,
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
    i18n: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_18',
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
    i18n: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_17',
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
    i18n: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_19',
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
    i18n: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_20',
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
    i18n: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_16',
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
    isActive,
    appName,
    i18n,
    onClick,
    defaultIcon,
    activeIcon,
    disabledIcon,
    disabled,
  }) => {
    const { t } = useTranslation();

    const handleAppClick = () => {
      onClick(appName);
    };

    let icon = defaultIcon;
    if (disabled) {
      icon = disabledIcon;
    } else {
      icon = isActive ? activeIcon : defaultIcon;
    }

    return (
      <Tooltip placement="bottom" title={t(i18n)} color="#4C535D">
        <AppIconInner
          className={`header__${appName}-button`}
          key={appName}
          onClick={handleAppClick}
          disabled={disabled}
        >
          {icon}
        </AppIconInner>
      </Tooltip>
    );
  },
);

const Header = observer(() => {
  const history = useHistory();
  const { t } = useTranslation();
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

  const handleExport = () => {
    const roomInfo = findRoom();

    PlatformUIStore.openWindow({
      id: roomInfo.id,
      type: 'talk',
      name: roomInfo.name,
      userCount: roomInfo.userCount,
      handler: null,
    });
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
      name: null,
      userCount: null,
      handler: null,
    });
  };

  const handleAppClick = async appName => {
    if (appName === 'meeting') {
      const { id } = findRoom();
      const meetingWindow = PlatformUIStore.getWindow('meeting', id);
      if (meetingWindow) {
        PlatformUIStore.focusWindow('meeting', id);
      } else {
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
      }
    } else if (PlatformUIStore.subApp !== appName) {
      openSubApp(appName);
    } else {
      closeSubApp();
    }

    // 최대한 기존 코드 안 건드리려고 했는데, 수정해도 무방함
    switch (appName) {
      case 'drive':
        logEvent('gnb', 'clickTeeDriveBtn');
        break;
      case 'calendar':
        logEvent('gnb', 'clickTeeCalendarBtn');
        break;
      case 'note':
        logEvent('gnb', 'clickTeeNoteBtn');
        break;
      case 'meeting':
        logEvent('gnb', 'clickTeeMeetingBtn');
        break;
      case 'files':
        logEvent('gnb', 'clickPlusBtn');
        break;
      default:
        break;
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
        onClickMeeting={_roomId => {
          PlatformUIStore.openWindow({
            id: _roomId,
            type: 'meeting',
            name: null,
            userCount: null,
            handler: null,
          });
        }}
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
        onClickMeeting={_roomId => {
          PlatformUIStore.openWindow({
            id: _roomId,
            type: 'meeting',
            name: null,
            userCount: null,
            handler: null,
          });
        }}
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
                className="header__photo"
                srcList={getUserPhotos()}
                onClick={handleClickRoomPhoto}
              />
              {findRoom()?.type === 'WKS0003' && (
                <div style={{ display: 'flex', marginRight: '0.25rem' }}>
                  <OpenChatIcon
                    width={0.9}
                    height={0.9}
                    color="rgb(0, 73, 61)"
                  />
                </div>
              )}
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
                    <Tooltip
                      placement="bottom"
                      title={t('CM_TEMP_MINI_CHAT')}
                      color="#4C535D"
                    >
                      <IconWrapper
                        className="header__export-button"
                        onClick={handleExport}
                      >
                        <ExportIcon
                          width={1.25}
                          height={1.25}
                          color="#232D3B"
                        />
                      </IconWrapper>
                    </Tooltip>
                    <Tooltip
                      placement="bottom"
                      title={t('CM_ROOMTITLE_TOOLTIP_02')}
                      color="#4C535D"
                    >
                      <IconWrapper
                        className="header__search-button"
                        onClick={handleSearch}
                      >
                        <SearchIcon
                          width={1.25}
                          height={1.25}
                          color="#4C535D"
                        />
                      </IconWrapper>
                    </Tooltip>
                  </>
                )}
                {!isMyRoom() && (
                  <>
                    <Tooltip
                      placement="bottom"
                      title={t('CM_ROOM_INVITE_USER')}
                      color="#4C535D"
                    >
                      <IconWrapper
                        className="header__invite-button"
                        onClick={handleAddMember}
                      >
                        <AddAcountIcon
                          width={1.25}
                          height={1.25}
                          color="#232D3B"
                        />
                      </IconWrapper>
                    </Tooltip>

                    <RoomAddMemberModal
                      visible={isAddMemberVisible}
                      roomId={findRoom()?.id}
                      onInviteUsers={handleInviteUsers}
                      onCancel={handleCancelInviteUsers}
                    />
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
          ({
            name,
            i18n,
            icons,
            isUsedInMyRoom,
            isSeperated,
            isUsedInProfile,
          }) => (
            <AppIconbutton key={name}>
              {isSeperated ? <VerticalBar /> : null}
              <AppIcon
                key={name}
                // isActive={PlatformUIStore.subApp === name}
                isActive={
                  name !== 'meeting'
                    ? PlatformUIStore.subApp === name
                    : !!PlatformUIStore.getWindow('meeting', findRoom()?.id)
                }
                appName={name}
                i18n={i18n}
                onClick={handleAppClick}
                defaultIcon={icons.default}
                activeIcon={icons.active}
                disabledIcon={icons.disabled}
                disabled={
                  (isMyRoom() && !isUsedInMyRoom) ||
                  (PlatformUIStore.resourceType === 'f' && !isUsedInProfile)
                }
              />
            </AppIconbutton>
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

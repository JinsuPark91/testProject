import React, { useContext, useEffect, useCallback } from 'react';
import { useLocalStore, Observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import {
  useCoreStores,
  ProfileInfoModal,
  logEvent,
  EventBus,
  Tooltip,
} from 'teespace-core';
import MeetingApp from 'teespace-meeting-app';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
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
import { useStores, rootStore } from '../../stores';
import HeaderProfile from '../profile/HeaderProfile';
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
  OpenChatBgIcon,
} from '../Icons';
import { getQueryParams, getQueryString } from '../../utils/UrlUtil';
import * as useCommand from '../../hook/Command';

const getIconStyle = (isDisabled = false) => {
  const { uiStore } = rootStore;

  return {
    width: 1.38,
    height: 1.38,
    color: isDisabled ? 'rgba(68, 77, 89, 0.3)' : uiStore.theme.NavyWhiteColor,
  };
};

const apps = [
  {
    name: 'drive',
    tooltip: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_18',
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
    tooltip: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_17',
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
    tooltip: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_19',
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
    tooltip: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_20',
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
    tooltip: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_16',
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
    color,
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
          {React.cloneElement(icon, { color })}
        </AppIconInner>
      </Tooltip>
    );
  },
);

const Header = () => {
  const themeContext = useContext(ThemeContext);
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const { uiStore } = useStores();
  const { roomStore, userStore, configStore } = useCoreStores();
  const store = useLocalStore(() => ({
    appConfirm: null,
    inviteRoomId: null,
    visible: {
      roomProfileModal: false,
      addMemberModal: false,
    },
  }));

  useEffect(() => {
    const inviteUserHandler = EventBus.on(
      'Platform:inviteUser',
      ({ roomId }) => {
        store.inviteRoomId = roomId;
        store.visible.addMemberModal = true;
      },
    );

    return () => EventBus.off('Platform:inviteUser', inviteUserHandler);
  }, []);

  const findRoom = () => {
    if (uiStore.resourceType !== 'f') {
      return roomStore.getRoomMap().get(uiStore.resourceId);
    }
    return null;
  };

  const getRoomName = () => {
    const found = findRoom();
    if (found) {
      if (found?.type === 'WKS0001') {
        return userStore.myProfile.displayName;
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

  const isBotRoom = () => {
    const found = findRoom();
    return found?.isBotRoom;
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
      const userIdArr = found?.memberIdListString.split(',');
      const userIds =
        userIdArr.length === 1 && !found?.isDirectMsg
          ? userIdArr
          : userIdArr
              .filter(userId => userId !== userStore.myProfile.id)
              .splice(0, 4);

      return userIds.map(
        userId => `${userStore.getProfilePhotoURL(userId, 'small')}`,
      );
    }
    return [];
  };

  const handleExport = () => {
    const roomInfo = findRoom();

    uiStore.openWindow({
      id: roomInfo.id,
      type: 'talk',
      name: roomInfo.name,
      userCount: roomInfo.userCount,
      handler: null,
    });
  };

  const handleSearch = () => EventBus.dispatch('Talk:OpenSearch');

  const openSubApp = useCallback(
    async appName => {
      const queryParams = { ...getQueryParams(), sub: appName };
      const queryString = getQueryString(queryParams);

      if (uiStore.resourceType === 'f') {
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
    },
    [history, roomStore, uiStore.resourceType, userStore.myProfile.id],
  );

  const closeSubApp = () => {
    const queryParams = getQueryParams();
    delete queryParams.sub;
    const queryString = getQueryString(queryParams);

    history.push(`${history.location.pathname}?${queryString}`);
  };

  const openMeeting = () => {
    const roomInfo = findRoom();

    uiStore.openWindow({
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
      const meetingWindow = uiStore.getWindow('meeting', id);
      if (meetingWindow) {
        uiStore.focusWindow('meeting', id);
      } else {
        const meetingAppConfirm = (
          <MeetingApp.ConfirmLaunchApp
            language={i18n.language}
            onConfirm={() => {
              store.appConfirm = null;
              openMeeting();
            }}
            onCancel={() => {
              store.appConfirm = null;
            }}
          />
        );
        store.appConfirm = meetingAppConfirm;
      }
    } else if (uiStore.subApp !== appName) {
      openSubApp(appName);
    } else {
      closeSubApp();
    }

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

  const handleClickRoomPhoto = () => {
    store.visible.roomProfileModal = true;
  };

  const handleCancelRoomMemeberModal = () => {
    store.visible.roomProfileModal = false;
  };

  const handleAddMember = useCallback(() => {
    store.visible.addMemberModal = true;
  }, [store.visible]);

  const handleInviteUsers = async (_, resultRoomId) => {
    // 1:1 룸에 초대한 경우 새로운 룸이 생성되는데, 이 경우 그 룸으로 이동해야함.
    if (findRoom()?.id !== resultRoomId) {
      history.push(`/s/${resultRoomId}/talk`);
    }

    store.visible.addMemberModal = false;
  };

  const handleCancelInviteUsers = () => {
    store.visible.addMemberModal = false;
  };

  const currRoomInfo = findRoom();

  const isActive = name => {
    if (name === 'meeting')
      return !!uiStore.getWindow('meeting', findRoom()?.id);
    return uiStore.subApp === name;
  };

  const getProfileModal = () => {
    if (isMyRoom()) {
      return (
        <ProfileInfoModal
          userId={userStore.myProfile.id}
          visible={store.visible.roomProfileModal}
          onClickMeeting={_roomId => {
            uiStore.openWindow({
              id: _roomId,
              type: 'meeting',
              name: null,
              userCount: null,
              handler: null,
            });
          }}
          onClose={handleCancelRoomMemeberModal}
          position={{ top: '3.5rem', left: '20.125rem' }}
        />
      );
    }
    if (currRoomInfo?.userCount === 2) {
      const dmUserId = currRoomInfo.memberIdListString
        .split(',')
        .find(userId => userId !== userStore.myProfile.id);

      return (
        <ProfileInfoModal
          userId={dmUserId}
          visible={store.visible.roomProfileModal}
          onClose={handleCancelRoomMemeberModal}
          onClickMeeting={_roomId => {
            uiStore.openWindow({
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
    }
    return (
      <RoomInquiryModal
        roomId={findRoom()?.id}
        visible={store.visible.roomProfileModal}
        onCancel={handleCancelRoomMemeberModal}
        width="17.5rem"
        top="3.5rem"
        left="17rem"
      />
    );
  };

  const handleNewNote = useCallback(() => {
    openSubApp('note');
    // Eventbus.~~~
  }, [openSubApp]);

  useCommand.InviteMember(handleAddMember);
  useCommand.NewNote(handleNewNote);

  return (
    <Wrapper>
      <TitleWrapper>
        <Observer>
          {() =>
            uiStore.resourceType !== 'f' && (
              <>
                <Title>
                  {/* 룸 사진 */}
                  <Observer>
                    {() => (
                      <StyledPhotos
                        className="header__photo"
                        srcList={getUserPhotos()}
                        onClick={handleClickRoomPhoto}
                      />
                    )}
                  </Observer>

                  {/* 오픈룸 아이콘 */}
                  <Observer>
                    {() =>
                      findRoom()?.type === 'WKS0003' && (
                        <div
                          style={{ display: 'flex', marginRight: '0.25rem' }}
                        >
                          <OpenChatBgIcon
                            width={1.125}
                            height={1.125}
                            color="rgb(0, 73, 61)"
                          />
                        </div>
                      )
                    }
                  </Observer>

                  {/* 룸 이름 */}
                  <Observer>
                    {() => <TitleText>{getRoomName()}</TitleText>}
                  </Observer>

                  {/* 유저 수 */}
                  <Observer>
                    {() =>
                      !(isMyRoom() || isDMRoom()) ? (
                        <UserCountText>{getUserCount()}</UserCountText>
                      ) : null
                    }
                  </Observer>

                  {/* 모달 */}
                  <Observer>{() => getProfileModal()}</Observer>
                </Title>

                <Observer>
                  {() =>
                    uiStore.resourceType !== 'm' && (
                      <SystemIconContainer>
                        {uiStore.layout !== 'expand' && (
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
                                  color={uiStore.theme.NavyWhiteColor}
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
                                  color={uiStore.theme.NavyWhiteColor}
                                />
                              </IconWrapper>
                            </Tooltip>
                          </>
                        )}
                        <Observer>
                          {() =>
                            !isMyRoom() &&
                            userStore.myProfile?.isGuest === false && (
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
                                      color={uiStore.theme.NavyWhiteColor}
                                    />
                                  </IconWrapper>
                                </Tooltip>

                                <Observer>
                                  {() => (
                                    <RoomAddMemberModal
                                      visible={store.visible.addMemberModal}
                                      roomId={
                                        store.inviteRoomId || findRoom()?.id
                                      }
                                      onInviteUsers={handleInviteUsers}
                                      onCancel={handleCancelInviteUsers}
                                    />
                                  )}
                                </Observer>
                              </>
                            )
                          }
                        </Observer>
                      </SystemIconContainer>
                    )
                  }
                </Observer>
              </>
            )
          }
        </Observer>
      </TitleWrapper>

      <AppIconContainer>
        <Observer>{() => store.appConfirm}</Observer>
        <Observer>
          {() =>
            apps.map(
              ({
                name,
                tooltip,
                icons,
                isUsedInMyRoom,
                isSeperated,
                isUsedInProfile,
              }) =>
                configStore.isActivateForCNU(
                  `${name.charAt(0).toUpperCase()}${name.slice(
                    1,
                    name.length,
                  )}`,
                ) ? (
                  <AppIconbutton key={name}>
                    {isSeperated ? <VerticalBar /> : null}
                    <AppIcon
                      key={name}
                      isActive={isActive(name)}
                      color={themeContext.NavyWhiteColor}
                      appName={name}
                      i18n={tooltip}
                      onClick={handleAppClick}
                      defaultIcon={icons.default}
                      activeIcon={icons.active}
                      disabledIcon={icons.disabled}
                      disabled={
                        isBotRoom() ||
                        (isMyRoom() && !isUsedInMyRoom) ||
                        (uiStore.resourceType === 'f' && !isUsedInProfile)
                      }
                    />
                  </AppIconbutton>
                ) : null,
            )
          }
        </Observer>
      </AppIconContainer>

      <UserMenu>
        <HeaderProfile />
      </UserMenu>
    </Wrapper>
  );
};

export default Header;

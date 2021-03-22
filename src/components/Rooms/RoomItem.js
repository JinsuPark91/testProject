import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { List, Menu, Dropdown, Tooltip } from 'antd';
import styled, { css } from 'styled-components';
import { Observer } from 'mobx-react';
import { isEqual } from 'lodash';
import { useCoreStores } from 'teespace-core';
import { talkOnDrop } from 'teespace-talk-app';
import { useDrop } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import { ACCEPT_ITEMS, TALK_ACCEPT_ITEMS } from '../../utils/DndConstant';
import Photos from '../Photos';
import {
  ViewMoreIcon,
  DisableAlarmIcon,
  PinIcon,
  OpenChatBgIcon,
  ExportIcon,
} from '../Icons';
import PlatformUIStore from '../../stores/PlatformUIStore';
import mySign from '../../assets/wapl_me.svg';

const RoomDropdown = React.memo(
  ({ children, roomInfo, onMenuClick, onClickMenuItem }) => {
    const { t } = useTranslation();
    const { roomStore, userStore } = useCoreStores();

    const { id: roomId } = roomInfo;
    const myUserId = userStore.myProfile.id;
    const [visible, setVisible] = useState(false);

    const history = useHistory();

    const handleVisibleChange = flag => {
      setVisible(flag);
    };

    const handleMenuClick = e => {
      e.stopPropagation();
      onMenuClick(roomInfo);
    };

    const handleSetting = e => {
      e.domEvent.stopPropagation();
      setVisible(false);
      onClickMenuItem({ key: 'setting' });

      history.push(`/s/${roomInfo.id}/setting`);
    };

    const updateRoomSetting = async options => {
      try {
        const result = await roomStore.updateRoomMemberSetting({
          roomId,
          myUserId,
          ...options,
        });
        return result;
      } catch (e) {
        console.log('ROOM UPDATE FAILED : ', e);
      }
    };

    const handleBookmarkDisable = e => {
      e.domEvent.stopPropagation();
      setVisible(false);

      updateRoomSetting({ newIsRoomBookmarked: false });
      onClickMenuItem({ key: 'disableBookmark' });
    };
    const handleBookmarkEnable = e => {
      e.domEvent.stopPropagation();
      setVisible(false);

      updateRoomSetting({ newIsRoomBookmarked: true });

      onClickMenuItem({ key: 'enableBookmark' });
    };

    const handleViewMember = e => {
      e.domEvent.stopPropagation();
      setVisible(false);

      onClickMenuItem({
        key: 'member',
        item: roomInfo,
        value: {
          isEdit: false,
        },
      });
    };

    const handleNameChange = e => {
      e.domEvent.stopPropagation();
      setVisible(false);
      onClickMenuItem({
        key: 'changeName',
        item: roomInfo,
        value: {
          isEdit: true,
        },
      });
    };

    const handleAlarmEnable = e => {
      e.domEvent.stopPropagation();
      setVisible(false);

      updateRoomSetting({ newIsAlarmUsed: true });
      onClickMenuItem({ key: 'enableAlarm' });
    };

    const handleAlarmDisable = e => {
      e.domEvent.stopPropagation();
      setVisible(false);

      updateRoomSetting({ newIsAlarmUsed: false });
      onClickMenuItem({ key: 'disableAlarm' });
    };

    const handleExit = e => {
      e.domEvent.stopPropagation();

      const isDMRoom = roomInfo.isDirectMsg;
      const isAdmin = roomInfo.adminId === myUserId;
      const isAlone = roomInfo.userCount === 1;

      setVisible(false);
      if (isAdmin && !isDMRoom && !isAlone) {
        onClickMenuItem({ key: 'exitAdmin', item: roomInfo });
      } else {
        onClickMenuItem({ key: 'exitNormal', item: roomInfo });
      }
      return false;
    };

    const roomMenu = () => {
      const isDMRoom = roomInfo.isDirectMsg;
      const isAdmin = roomInfo.adminId === myUserId;

      return (
        <StyledMenu>
          {
            // NOTE. 마이룸과 1:1 룸은 이름 변경할 수 있음
            // NOTE. 마이름은 메뉴 자체가 없다. (체크할 필요 없음)
            !isDMRoom && (
              <Menu.Item key="changeName" onClick={handleNameChange}>
                {t('CM_CHANGE_NAME_02')}
              </Menu.Item>
            )
          }
          {roomInfo.isRoomBookmarked ? (
            <Menu.Item key="disableBookmark" onClick={handleBookmarkDisable}>
              {t('CM_FIX_TOP_ROOM_03')}
            </Menu.Item>
          ) : (
            <Menu.Item key="enableBookmark" onClick={handleBookmarkEnable}>
              {t('CM_CHANGE_NAME_03')}
            </Menu.Item>
          )}
          {roomInfo.isAlarmUsed ? (
            <Menu.Item key="disableAlarm" onClick={handleAlarmDisable}>
              {t('CM_CHANGE_NAME_04')}
            </Menu.Item>
          ) : (
            <Menu.Item key="enableAlarm" onClick={handleAlarmEnable}>
              {t('CM_NOTI_SETTING_01')}
            </Menu.Item>
          )}
          <Menu.Item key="member" onClick={handleViewMember}>
            {t('CM_ROOM_CONTEXT_MENU_01')}
          </Menu.Item>
          {
            // NOTE. 마이룸과 1:1 룸은 룸설정 할 수 없음
            // NOTE. 1:1 방이 아니고, 내가 관리자면 세팅페이지를 볼수 있다.
            !isDMRoom && isAdmin && (
              <Menu.Item key="setting" onClick={handleSetting}>
                {t('CM_ROOM_SETTING')}
              </Menu.Item>
            )
          }
          <Menu.Item key="exit" onClick={handleExit}>
            {t('CM_LEAVE')}
          </Menu.Item>
        </StyledMenu>
      );
    };

    return (
      <Dropdown
        overlay={roomMenu}
        onClick={handleMenuClick}
        visible={visible}
        onVisibleChange={handleVisibleChange}
        trigger={['click']}
      >
        {children}
      </Dropdown>
    );
  },
);

const RoomItemContent = ({
  roomInfo,
  isMyRoom,
  onMenuClick,
  onClickMenuItem,
  onClickRoomPhoto,
}) => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const isDMRoom = roomInfo.isDirectMsg;

  const handleExport = e => {
    e.stopPropagation();

    PlatformUIStore.openWindow({
      id: roomInfo.id,
      type: 'talk',
      name: roomInfo.name,
      userCount: roomInfo.userCount,
      handler: null,
    });
  };

  const handleMenuClick = _roomInfo => {
    onMenuClick(_roomInfo);
  };

  const handleClickRootPhoto = e => {
    // 룸 사진 클릭 시 룸 선택 안 되게 이벤트 전파 방지 처리
    e.stopPropagation();

    onClickRoomPhoto(roomInfo);
  };

  return (
    <>
      <List.Item.Meta
        avatar={
          <Observer>
            {() => {
              let userPhotos = null;
              if (isMyRoom) {
                userPhotos = [
                  userStore.getProfilePhotoURL(userStore.myProfile.id, 'small'),
                ];
              } else {
                let userIds = roomInfo.memberIdListString
                  .split(',')
                  .splice(0, 4);

                if (isDMRoom) {
                  userIds = userIds.filter(
                    userId => userId !== userStore.myProfile.id,
                  );
                }

                userPhotos = userIds.map(userId =>
                  userStore.getProfilePhotoURL(userId, 'small'),
                );
              }
              return (
                <Photos
                  defaultDiameter="2.13"
                  srcList={userPhotos}
                  onClick={handleClickRootPhoto}
                  className="photos rooms__item__photo"
                />
              );
            }}
          </Observer>
        }
        title={
          <Title>
            <Observer>
              {() => (
                <>
                  {roomInfo.type === 'WKS0003' && (
                    <OpenChatIconBox>
                      <OpenChatBgIcon width={0.88} height={0.88} />
                    </OpenChatIconBox>
                  )}
                  <>
                    {isMyRoom ? (
                      <MyIcon>
                        <img src={mySign} alt="me" />
                      </MyIcon>
                    ) : null}
                    <RoomNameText>
                      {isMyRoom
                        ? userStore.myProfile.nick || userStore.myProfile.name
                        : roomInfo.customName || roomInfo.name}
                    </RoomNameText>
                  </>
                </>
              )}
            </Observer>
            {!(isMyRoom || roomInfo.isDirectMsg) ? (
              <Observer>
                {() => <UserCountText>{roomInfo.userCount}</UserCountText>}
              </Observer>
            ) : null}

            <Observer>
              {() =>
                roomInfo.isAlarmUsed ? null : (
                  <TitleIconWrapper>
                    <DisableAlarmIcon width={0.8} height={0.8} />
                  </TitleIconWrapper>
                )
              }
            </Observer>
            <Observer>
              {() =>
                roomInfo.isRoomBookmarked ? (
                  <TitleIconWrapper>
                    <PinIcon width={0.8} height={0.8} />
                  </TitleIconWrapper>
                ) : null
              }
            </Observer>
          </Title>
        }
        description={
          <Observer>
            {() => (
              <StyleRoomMessage>
                {roomInfo.metadata?.lastMessage}
              </StyleRoomMessage>
            )}
          </Observer>
        }
      />
      <Observer>
        {() => {
          return roomInfo.metadata?.count ? (
            <UnreadCount className="rooms__item__unread">
              {roomInfo.metadata?.count > 99 ? '99+' : roomInfo.metadata?.count}
            </UnreadCount>
          ) : null;
        }}
      </Observer>
      {!isMyRoom && (
        <RoomDropdown
          roomInfo={roomInfo}
          onMenuClick={handleMenuClick}
          onClickMenuItem={onClickMenuItem}
        >
          <IconWrapper className="rooms__item__config-button">
            <ViewMoreIcon />
          </IconWrapper>
        </RoomDropdown>
      )}
      <Tooltip placement="top" title={t('CM_TEMP_MINI_CHAT')} color="#4C535D">
        <IconWrapper
          className="rooms__item__export-button"
          onClick={handleExport}
        >
          <ExportIcon width={1} height={1} color="#49423A" />
        </IconWrapper>
      </Tooltip>
    </>
  );
};

// TODO: Content.js 와 동일한 함수로 리팩토링 필요
const getRoomId = () => {
  if (PlatformUIStore.resourceType !== 'f') {
    return PlatformUIStore.resourceId;
  }
  return null;
};

const RoomItem = ({
  roomInfo,
  selected,
  onClick,
  onMenuClick,
  onClickMenuItem = () => {},
  onClickRoomPhoto = () => {},
}) => {
  const { componentStore } = useCoreStores();
  const FileDndDialog = componentStore.get('Talk:FileDndDialog');
  const [isDndDialogVisible, setDndDialogVisible] = useState(false);
  const [dndTargetFiles, setDndTargetFiles] = useState([]);
  const [dndTargetRoom, setDndTargetRoom] = useState(getRoomId());

  const isMyRoom = roomInfo.type === 'WKS0001';

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ACCEPT_ITEMS,
    drop: item => {
      //
      // Item Type에 따라서 처리해야 될 일들
      //
      if (TALK_ACCEPT_ITEMS.includes(item.type)) {
        const type = /[a-zA-Z]+:([a-zA-Z]+):[a-zA-Z]+/.exec(
          item.type.toLowerCase(),
        );
        switch (type[1]) {
          case 'note':
            talkOnDrop({
              room: roomInfo,
              data: item.data,
              type: type[1] ? type[1] : 'unknown',
              target: 'Platform:Room',
              currentRoomId: getRoomId(),
            });
            break;
          case 'drive':
            setDndDialogVisible(true);
            setDndTargetFiles(item.data);
            setDndTargetRoom(roomInfo.id);
            break;
          default:
            break;
        }
      }

      // Drag 시작한 쪽이 정보를 알아야 하는 경우 고려
      return {
        source: item.type, // "Item:Note:Chapter"
        sourceData: item.data,
        target: 'Platform:Room',
        targetData: roomInfo,
      };
    },
    collect: monitor => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  const isActive = canDrop && isOver;

  const handleRoomClick = useCallback(() => {
    onClick(roomInfo);
  }, [onClick, roomInfo]);

  const handleMenuClick = _roomInfo => {
    onMenuClick(_roomInfo);
  };

  const handleCloseDndDialog = useCallback(() => {
    setDndDialogVisible(false);
  }, []);

  return (
    <StyledItem ref={drop} className="rooms__item" onClick={handleRoomClick}>
      <ItemWrapper selected={selected} isActiveDropEffect={isActive}>
        <RoomItemContent
          roomInfo={roomInfo}
          isMyRoom={isMyRoom}
          onMenuClick={handleMenuClick}
          onClickMenuItem={onClickMenuItem}
          onClickRoomPhoto={onClickRoomPhoto}
        />
      </ItemWrapper>
      <FileDndDialog
        visible={isDndDialogVisible}
        target="Platform:Room"
        targetRoomId={dndTargetRoom}
        fileList={dndTargetFiles}
        onClose={handleCloseDndDialog}
      />
    </StyledItem>
  );
};

const MyIcon = styled.div`
  width: 0.88rem;
  height: 0.88rem;
  flex-shrink: 0;
  margin-right: 0.25rem;
  line-height: 0;
  img {
    width: 100%;
    height: 100%;
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0.25rem;
  padding: 0.69rem 0.38rem 0.69rem 0.5rem;
  border-radius: 0.8125rem;
  ${({ selected }) =>
    selected &&
    css`
      background-color: #f2efec;
    `}

  ${({ isActiveDropEffect }) =>
    isActiveDropEffect &&
    css`
      background-color: rgba(236, 98, 34, 0.05);
      box-shadow: 0 0 0 1px #ec6222 inset;
    `}

  &:hover {
    background: #faf8f7;

    .rooms__item__unread {
      display: none;
    }

    .rooms__item__config-button,
    .rooms__item__export-button {
      display: flex;
    }
  }
`;
const StyledMenu = styled(Menu)`
  background: #ffffff;
  border: 1px solid #d0ccc7;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;

  .ant-dropdown-menu-item {
    font-size: 0.75rem;
    color: #000;

    &:hover {
      background-color: #faf8f7;
    }
    &:active,
    &:focus {
      background-color: #f2efec;
    }
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
`;

const StyleRoomMessage = styled.span`
  color: #666;
`;

const RoomNameText = styled.span`
  font-size: 0.81rem;
  font-weight: 500;
  line-height: 1.19rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const UserCountText = styled.span`
  margin-left: 0.25rem;
  font-size: 0.81rem;
  line-height: 1.19rem;
  color: #7f7f7f;
`;

const StyledItem = styled.div`
  position: relative;
  user-select: none;
  cursor: pointer;

  .ant-list-item-meta {
    align-items: center;
  }

  .ant-list-item-meta-avatar {
    margin-right: 0.4375rem;
    position: relative;
    .photos > div {
      border: 1px solid #fff;
      &::after {
        display: none;
      }
    }
  }

  .ant-list-item-meta-content {
    margin-right: 0.3rem;
  }

  button {
    display: none;
  }

  .ant-list-item-meta-title {
    margin: 0;
    line-height: 1.188rem;
  }
  .ant-list-item-meta-description {
    margin-top: 0.125rem;
    font-size: 0.69rem;
    line-height: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const UnreadCount = styled.div`
  align-self: flex-start;
  padding: 0 0.25rem;
  font-size: 0.69rem;
  color: #fff;
  font-weight: 400;
  border-radius: 0.56rem;
  background-color: #dc4547;
`;

const TitleIconWrapper = styled.div`
  display: flex;
  flex: 0 0 0.81rem;
  padding: 0 0.15rem;
`;
const IconWrapper = styled.div`
  display: none;
  width: 1.5rem;
  height: 1.5rem;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover {
    background: #eae6e0;
  }
`;
const OpenChatIconBox = styled.div`
  margin-right: 0.25rem;
  line-height: 0;
`;

export default React.memo(
  RoomItem,
  (prevProps, nextProps) =>
    prevProps.selected === nextProps.selected &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.onMenuClick === nextProps.onMenuClick &&
    prevProps.onClickMenuItem === nextProps.onClickMenuItem &&
    prevProps.onClickRoomPhoto === nextProps.onClickRoomPhoto &&
    isEqual(prevProps.roomInfo, nextProps.roomInfo),
);

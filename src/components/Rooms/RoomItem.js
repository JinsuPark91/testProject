import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { List, Menu, Dropdown } from 'antd';
import styled, { css } from 'styled-components';
import { Observer } from 'mobx-react';
import { useCoreStores, usePortalWindow } from 'teespace-core';
import { Talk } from 'teespace-talk-app';
import { useDrop } from 'react-dnd';
import Photos from '../Photos';
import { ViewMoreIcon, ExportIcon, DisableAlarmIcon, PinIcon } from '../Icons';
import PlatformUIStore from '../../stores/PlatformUIStore';

const RoomDropdown = React.memo(
  ({ children, roomInfo, onMenuClick, onClickMenuItem }) => {
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

    const handleExit = async e => {
      e.domEvent.stopPropagation();
      setVisible(false);

      try {
        const result = await roomStore.deleteRoomMember({
          userId: userStore.myProfile.id,
          roomId: roomInfo.id,
        });

        if (result) {
          if (
            PlatformUIStore.resourceType === 's' &&
            PlatformUIStore.resourceId === roomInfo.id
          ) {
            const firstRoomId = roomStore.getRoomArray()?.[0].id;
            if (firstRoomId) history.push(`/s/${firstRoomId}/talk`);
          }
        }
      } catch (e1) {
        console.log('DELETE ROOM MEMBER ERROR : ', e1);
      } finally {
        onClickMenuItem({ key: 'exit' });
      }
    };

    const roomMenu = () => (
      <StyledMenu>
        <Menu.Item key="setting" onClick={handleSetting}>
          룸 설정
        </Menu.Item>
        {roomInfo.isRoomBookmarked ? (
          <Menu.Item key="disableBookmark" onClick={handleBookmarkDisable}>
            룸 상단 고정 해제
          </Menu.Item>
        ) : (
          <Menu.Item key="enableBookmark" onClick={handleBookmarkEnable}>
            룸 상단 고정
          </Menu.Item>
        )}
        <Menu.Item key="member" onClick={handleViewMember}>
          멤버 보기
        </Menu.Item>
        <Menu.Item key="changeName" onClick={handleNameChange}>
          이름 변경
        </Menu.Item>
        {roomInfo.isAlarmUsed ? (
          <Menu.Item key="disableAlarm" onClick={handleAlarmDisable}>
            알림 끄기
          </Menu.Item>
        ) : (
          <Menu.Item key="enableAlarm" onClick={handleAlarmEnable}>
            알림 켜기
          </Menu.Item>
        )}
        <Menu.Item key="exit" onClick={handleExit}>
          나가기
        </Menu.Item>
      </StyledMenu>
    );

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
  const { userStore, roomStore } = useCoreStores();
  const openTalkWindow = usePortalWindow();
  const handleExport = async e => {
    e.stopPropagation();
    openTalkWindow({
      element: (
        <Talk
          roomId={roomInfo.id}
          channelId={
            roomStore
              .getRoomMap()
              .get(roomInfo.id)
              ?.channelList?.find(channel => channel.type === 'CHN0001')?.id
          }
        />
      ),
      opts: 'width=600, height=900',
      title: 'mini-talk',
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
                userPhotos = roomInfo.memberIdListString
                  .split(',')
                  .splice(0, 4)
                  .map(userId => userStore.getProfilePhotoURL(userId, 'small'));
              }
              return (
                <>
                  {isMyRoom && <MyTooltip>나</MyTooltip>}
                  <Photos srcList={userPhotos} onClick={handleClickRootPhoto} />
                </>
              );
            }}
          </Observer>
        }
        title={
          <Title>
            <Observer>
              {() => (
                <RoomNameText>
                  {isMyRoom
                    ? userStore.myProfile.name
                    : roomInfo.customName || roomInfo.name}
                </RoomNameText>
              )}
            </Observer>
            <Observer>
              {() => <UserCountText>{roomInfo.userCount}</UserCountText>}
            </Observer>

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
            <UnreadCount className="room-item__unread">
              {roomInfo.metadata?.count}
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
          <IconWrapper className="room-item__icon">
            <ViewMoreIcon />
          </IconWrapper>
        </RoomDropdown>
      )}
      <IconWrapper className="room-item__icon" onClick={handleExport}>
        <ExportIcon width={1} height={1} />
      </IconWrapper>
    </>
  );
};

const ACCEPT_ITEMS = [
  'Item:Drive:Files',
  'Item:Note:Pages',
  'Item:Note:SharedPages',
  'Item:Calendar:ShareSchedules',
];
const TALK_ACCEPT_ITEMS = [
  'Item:Note:Pages',
  'Item:Note:SharedPages',
  'Item:Calendar:ShareSchedules',
];

const RoomItem = ({
  roomInfo,
  selected,
  onClick,
  onMenuClick,
  onClickMenuItem = () => {},
  onClickRoomPhoto = () => {},
}) => {
  const isMyRoom = roomInfo.type === 'WKS0001';
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ACCEPT_ITEMS,
    drop: item => {
      //
      // Item Type에 따라서 처리해야 될 일들
      //
      if (TALK_ACCEPT_ITEMS.includes(item.type)) {
        console.log('TALK 로 아이템 전달. ', item.data);
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

  let backgroundColor = 'transparent';
  if (isActive) {
    backgroundColor = 'rgba(255, 123, 123, 0.2)';
  }

  const handleRoomClick = useCallback(() => {
    onClick(roomInfo);
  }, [onClick, roomInfo]);

  const handleMenuClick = _roomInfo => {
    onMenuClick(_roomInfo);
  };

  return (
    <StyledItem ref={drop} onClick={handleRoomClick} isMyRoom={isMyRoom}>
      {isActive && <DropEffect style={{ backgroundColor }} />}
      <ItemWrapper selected={selected}>
        <RoomItemContent
          roomInfo={roomInfo}
          isMyRoom={isMyRoom}
          onMenuClick={handleMenuClick}
          onClickMenuItem={onClickMenuItem}
          onClickRoomPhoto={onClickRoomPhoto}
        />
      </ItemWrapper>
    </StyledItem>
  );
};

const DropEffect = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  ${({ selected }) =>
    selected &&
    css`
      background: #e2e3fb;
    `}

  border-radius: 1.875rem;
  padding: 0.625rem;
  &:hover {
    background: #eaeafb;

    .room-item__unread {
      display: none;
    }

    .room-item__icon {
      display: flex;
    }
  }
`;
const StyledMenu = styled(Menu)`
  & {
    background: #ffffff;
    border: 1px solid #c6ced6;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  & .ant-dropdown-menu-item {
    font-size: 0.75rem;
    color: #000;

    :hover {
      background-color: #dcddff;
      border-radius: 0.8125rem;
    }
  }
`;

const MyTooltip = styled.div`
  display: flex;
  font-size: 0.56rem;
  background-color: #523dc7;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  color: #fff;
  top: -0.5rem;
  padding: 0.06rem 0.25rem;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -0.2rem;
    border-width: 0.2rem;
    border-style: solid;
    border-color: #523dc7 transparent transparent transparent;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
`;

const StyleRoomMessage = styled.span`
  font-size: 0.69rem;
  color: #47474d;
`;

const RoomNameText = styled.span`
  font-size: 0.81rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const UserCountText = styled.span`
  font-size: 0.81rem;
  opacity: 0.5;
  color: #000000;
  margin-left: 0.375rem;
`;

const StyledItem = styled.div`
  position: relative;
  user-select: none;
  cursor: pointer;
  padding: 0;

  ${({ isMyRoom }) =>
    isMyRoom &&
    css`
      border-bottom: 0.0625rem solid #e3e7eb;
    `}

  & .ant-list-item-meta-avatar {
    margin-right: 0.3125rem;
    position: relative;
  }

  & .ant-list-item-meta-content {
    margin-right: 0.3rem;
  }

  & button {
    display: none;
  }

  & .ant-list-item-meta-title {
    margin: 0;
    line-height: 1.188rem;
  }
  & .ant-list-item-meta-description {
    font-size: 0.6875rem;
    color: #47474d;
    line-height: 1.063rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const UnreadCount = styled.div`
  background-color: #ff486d;
  height: fit-content;
  color: #fff;
  font-weight: 400;
  font-size: 0.63rem;
  padding: 0.06rem 0.19rem;
  border-radius: 0.56rem;
`;

const TitleIconWrapper = styled.div`
  display: flex;
  flex: 0 0 0.81rem;
  padding: 0 0.15rem;
`;
const IconWrapper = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  &:hover {
    background: #dcddff;
  }
`;

export default RoomItem;

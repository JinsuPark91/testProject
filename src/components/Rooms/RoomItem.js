import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { List, Menu, Dropdown } from 'antd';
import styled, { css } from 'styled-components';
import { Observer } from 'mobx-react';
import { useCoreStores, usePortalWindow } from 'teespace-core';
import { Talk, talkOnDrop } from 'teespace-talk-app';
import { useDrop } from 'react-dnd';
import Photos from '../Photos';
import {
  ViewMoreIcon,
  DisableAlarmIcon,
  PinIcon,
  OpenChatIcon,
} from '../Icons';
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
                이름 변경
              </Menu.Item>
            )
          }
          {roomInfo.isRoomBookmarked ? (
            <Menu.Item key="disableBookmark" onClick={handleBookmarkDisable}>
              룸 상단 고정 해제
            </Menu.Item>
          ) : (
            <Menu.Item key="enableBookmark" onClick={handleBookmarkEnable}>
              룸 상단 고정
            </Menu.Item>
          )}
          {roomInfo.isAlarmUsed ? (
            <Menu.Item key="disableAlarm" onClick={handleAlarmDisable}>
              알림 끄기
            </Menu.Item>
          ) : (
            <Menu.Item key="enableAlarm" onClick={handleAlarmEnable}>
              알림 켜기
            </Menu.Item>
          )}
          <Menu.Item key="member" onClick={handleViewMember}>
            룸 구성원 보기
          </Menu.Item>
          {
            // NOTE. 마이룸과 1:1 룸은 룸설정 할 수 없음
            // NOTE. 1:1 방이 아니고, 내가 관리자면 세팅페이지를 볼수 있다.
            !isDMRoom && isAdmin && (
              <Menu.Item key="setting" onClick={handleSetting}>
                룸 설정
              </Menu.Item>
            )
          }
          <Menu.Item key="exit" onClick={handleExit}>
            나가기
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
  const { userStore, roomStore } = useCoreStores();
  const isDMRoom = roomInfo.isDirectMsg;

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
                  srcList={userPhotos}
                  onClick={handleClickRootPhoto}
                  className="photos"
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
                    <div style={{ display: 'flex', marginRight: '0.25rem' }}>
                      <OpenChatIcon
                        width={0.88}
                        height={0.88}
                        color="rgb(0, 73, 61)"
                      />
                    </div>
                  )}
                  <>
                    <RoomNameText>
                      {isMyRoom
                        ? userStore.myProfile.nick || userStore.myProfile.name
                        : roomInfo.customName || roomInfo.name}
                    </RoomNameText>
                    {isMyRoom ? <MyIcon>나</MyIcon> : null}
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
            <UnreadCount className="room-item__unread">
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
          <IconWrapper className="room-item__icon">
            <ViewMoreIcon />
          </IconWrapper>
        </RoomDropdown>
      )}
      {/* 미니챗 기능 추후 업데이트 */}
      {/* <IconWrapper className="room-item__icon" onClick={handleExport}>
        <ExportIcon width={1} height={1} />
      </IconWrapper> */}
    </>
  );
};

const ACCEPT_ITEMS = [
  'Item:Drive:Files',
  'Item:Note:Pages',
  'Item:Note:SharedPages',
  'Item:Note:Chapters',
  'Item:Note:SharedChapters',
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
        talkOnDrop({
          room: roomInfo,
          data: item.data,
        });
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
    backgroundColor = '#F2EFEC';
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

const MyIcon = styled.div`
  display: inline-flex;
  flex: 0 0 1rem;
  height: 1rem;
  align-items: center;
  justify-content: center;
  background: #232d3b;
  font-size: 0.69rem;
  color: white;
  font-weight: 400;
  border-radius: 0.25rem;
  margin-left: 0.25rem;
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  ${({ selected }) =>
    selected &&
    css`
      background: #f2efec;
    `}

  border-radius: 0.8125rem;
  padding: 0.625rem;
  margin: 0 0.25rem;

  &:hover {
    background: #faf8f7;

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

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
`;

const StyleRoomMessage = styled.span`
  font-size: 0.69rem;
  color: #414141;
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
  color: #7f7f7f;
  margin-left: 0.25rem;
`;

const StyledItem = styled.div`
  position: relative;
  user-select: none;
  cursor: pointer;

  ${({ isMyRoom }) =>
    isMyRoom &&
    css`
      &:after {
        content: '';
        display: block;
        height: 1px;
        margin: 0.25rem 0.625rem;
        background-color: #e3e7eb;
      }
      .photos {
        width: 2.38rem;
        height: 2.38rem;
        border: 2px solid #fff;
        border-radius: 50%;
        div {
          width: 100%;
          height: 100%;
        }
      }
    `}

  .ant-list-item-meta-avatar {
    margin-right: 0.4375rem;
    position: relative;
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
    font-size: 0.6875rem;
    color: #47474d;
    line-height: 1.063rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const UnreadCount = styled.div`
  align-self: flex-start;
  padding: 0 0.38rem;
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

export default RoomItem;

import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { List, Menu, Dropdown } from 'antd';
import styled, { css } from 'styled-components';
import { Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import Photos from '../Photos';
import { ViewMoreIcon, ExportIcon, DisableAlarmIcon, PinIcon } from '../Icons';
import PlatformUIStore from '../../stores/PlatformUIStore';

const MAX_PROFILE_COUNT = 4;

const RoomDropdown = React.memo(({ children, roomInfo, onMenuClick }) => {
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
  };
  const handleBookmarkEnable = e => {
    e.domEvent.stopPropagation();
    setVisible(false);

    updateRoomSetting({ newIsRoomBookmarked: true });
  };

  const handleViewMember = e => {
    e.domEvent.stopPropagation();
    setVisible(false);

    PlatformUIStore.roomMemberModal.open({
      top: `${PlatformUIStore.content.rect.top}px`,
      left: `${PlatformUIStore.content.rect.left}px`,
    });
  };

  const handleNameChange = e => {
    e.domEvent.stopPropagation();
    console.log('handleNameChange');
    setVisible(false);
  };

  const handleAlarmEnable = e => {
    e.domEvent.stopPropagation();
    setVisible(false);

    updateRoomSetting({ newIsAlarmUsed: true });
  };

  const handleAlarmDisable = e => {
    e.domEvent.stopPropagation();
    setVisible(false);

    updateRoomSetting({ newIsAlarmUsed: false });
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
    } catch (e) {
      console.log('DELETE ROOM MEMBER ERROR : ', e);
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
});

const RoomItemContent = React.memo(({ roomInfo, isMyRoom, onMenuClick }) => {
  const { userStore } = useCoreStores();

  const userPhotos = roomInfo.memberIdListString
    .split(',')
    .splice(0, MAX_PROFILE_COUNT)
    .map(
      userId =>
        `${userStore.getUserProfilePhoto({
          userId,
          size: 'small',
          isLocal: true,
        })}`,
    );

  const handleExport = e => {
    e.stopPropagation();
    console.log('handleExport');
  };

  const handleMenuClick = _roomInfo => {
    onMenuClick(_roomInfo);
  };

  return (
    <>
      <List.Item.Meta
        avatar={
          <>
            {isMyRoom && <MyTooltip>나</MyTooltip>}
            <Photos srcList={userPhotos} />
          </>
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
      {roomInfo.metadata?.unreadCount ? (
        <UnreadCount className="room-item__unread">
          {roomInfo.metadata?.unreadCount}
        </UnreadCount>
      ) : null}
      {!isMyRoom && (
        <RoomDropdown roomInfo={roomInfo} onMenuClick={handleMenuClick}>
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
});

const RoomItem = React.memo(({ roomInfo, selected, onClick, onMenuClick }) => {
  const isMyRoom = roomInfo.type === 'WKS0001';

  const handleRoomClick = useCallback(() => {
    onClick(roomInfo);
  }, []);

  const handleMenuClick = _roomInfo => {
    onMenuClick(_roomInfo);
  };

  return (
    <StyledItem onClick={handleRoomClick} isMyRoom={isMyRoom}>
      <ItemWrapper selected={selected}>
        <RoomItemContent
          roomInfo={roomInfo}
          isMyRoom={isMyRoom}
          onMenuClick={handleMenuClick}
        />
      </ItemWrapper>
    </StyledItem>
  );
});

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

/* https://milooy.wordpress.com/2019/09/19/react-external-component%EB%A5%BC-styledcomponent%EB%A1%9C-%EA%B0%90%EC%8C%8C%EC%9D%84-%EB%95%8C-warning-unknown-props-%EC%9B%8C%EB%8B%9D-%ED%95%B4%EA%B2%B0/ */
const StyledItem = styled(({ isMyRoom, children, ...rest }) => (
  <List.Item {...rest}>{children}</List.Item>
))`
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

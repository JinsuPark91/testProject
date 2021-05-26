import React, { useCallback, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer, useLocalStore } from 'mobx-react';
import styled, { css, ThemeContext } from 'styled-components';
import {
  useCoreStores,
  Toast,
  ProfileInfoModal,
  Message,
  logEvent,
  WaplSearch,
  EventBus,
} from 'teespace-core';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { throttle } from 'lodash';
import { WaplLogo, AddRoomIcon } from '../Icons';
import RoomItem from './RoomItem';
import { useStores } from '../../stores';
import SelectRoomTypeDialog from './SelectRoomTypeDialog';
import RoomInquiryModal from './RoomInquiryModal';
import * as useCommand from '../../hook/Command';

const RoomList = () => {
  const containerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { roomStore, userStore, configStore, authStore } = useCoreStores();
  const { uiStore, historyStore } = useStores();
  const store = useLocalStore(() => ({
    keyword: '',
    targetRoom: null,
    exitTargetRoom: null,
    targetUserId: null,
    roomMemberAttr: {},
    isScrollEnd: false,
    toast: {
      visible: false,
      text: '',
    },
    visible: {
      profileModal: false,
      roomMemberModal: false,
      exitAdminModal: false,
      exitNormalModal: false,
      selectRoomTypeModal: false,
    },
  }));

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [uiStore.tabType]);

  const handleScroll = throttle(() => {
    const container = containerRef.current;
    const { scrollTop, clientHeight, scrollHeight } = container;

    if (scrollTop + clientHeight === scrollHeight) {
      store.isScrollEnd = true;
    } else {
      store.isScrollEnd = false;
    }
  }, 200);

  useEffect(() => {
    EventBus.dispatch('Platform:initLNB');
  }, [i18n.language]);

  const handleCreateRoom = useCallback(() => {
    store.visible.selectRoomTypeModal = true;
    EventBus.dispatch('Note:onEditClose');
    logEvent('main', 'clickRoomCreateBtn');
  }, [store]);

  const handleSelectRoom = async roomInfo => {
    const isSameRoom =
      uiStore.resourceType === 's' && uiStore.resourceId === roomInfo.id;
    if (isSameRoom) return;

    const { lastUrl } = await historyStore.getHistory({ roomId: roomInfo.id });
    if (lastUrl) {
      history.push(lastUrl);
    } else {
      history.push(`/s/${roomInfo.id}/talk`);
    }
  };

  const handleChange = value => {
    store.keyword = value;
  };

  const handleClear = () => {
    store.keyword = '';
  };

  const handleSelectRoomTypeCancel = () => {
    store.visible.selectRoomTypeModal = false;
  };

  const handleRoomMemeberModalCancel = () => {
    store.visible.roomMemberModal = false;
  };

  const handleMenuClick = roomInfo => {
    store.targetRoom = roomInfo;
  };

  const handleClickMenuItem = useCallback(
    ({ key, item, value }) => {
      switch (key) {
        case 'profile':
          store.targetUserId = item;
          store.visible.profileModal = true;
          break;
        case 'member':
        case 'changeName':
          store.roomMemberAttr = value;
          store.targetRoom = item;
          store.visible.roomMemberModal = true;
          break;
        case 'exitAdmin': // 룸 관리자가 '나가기' 버튼 누른 경우
          store.exitTargetRoom = item;
          store.visible.exitAdminModal = true;
          break;
        case 'exitNormal': // 일반 사용자가 '나가기' 버튼 누른 경우
          store.exitTargetRoom = item;
          store.visible.exitNormalModal = true;
          break;
        default:
      }
    },
    [store],
  );

  const handleClickRoomPhoto = roomInfo => {
    // NOTE. 마이룸인 경우 나의 프로파일 정보를,
    //  1:1 방의 경우 상대 유저의 프로파일 정보를 보여줌.
    const isDMRoom = roomInfo.isDirectMsg;
    const isMyRoom = roomInfo.type === 'WKS0001';

    if (isMyRoom) {
      store.targetUserId = userStore.myProfile.id;
      store.visible.profileModal = true;
    } else if (isDMRoom) {
      const found = roomInfo.memberIdListString
        .split(',')
        .find(userId => userId !== userStore.myProfile.id);

      store.targetUserId = found;
      store.visible.profileModal = true;
    } else {
      store.targetRoom = roomInfo;
      store.roomMemberAttr = { isEdit: false };
      store.visible.roomMemberModal = true;
    }
  };

  const handleCloseProfileInfoModal = () => {
    store.visible.profileModal = false;
  };

  const handleCloseExitAdminModal = () => {
    store.visible.exitAdminModal = false;
  };

  const handleConfirmExitAdminModal = () => {
    if (store.exitTargetRoom === null) return;

    history.push(`/s/${store.exitTargetRoom.id}/setting`);
    store.visible.exitAdminModal = false;
  };

  const handleCloseExitNormalModal = () => {
    store.visible.exitNormalModal = false;
  };

  const handleConfirmExitNormalModal = async () => {
    if (store.exitTargetRoom === null) return;

    try {
      const result = await roomStore.deleteRoomMember({
        userId: userStore.myProfile.id,
        roomId: store.exitTargetRoom.id,
      });

      if (result) {
        if (
          uiStore.resourceType === 's' &&
          uiStore.resourceId === store.exitTargetRoom.id
        ) {
          const firstRoomId = roomStore.getRoomArray()?.[0].id;
          if (firstRoomId) history.push(`/s/${firstRoomId}/talk`);
        }
      }
    } catch (e1) {
      console.log('DELETE ROOM MEMBER ERROR : ', e1);
    } finally {
      store.exitTargetRoom = null;
      store.visible.exitNormalModal = false;
    }
  };

  const getRoomName = roomInfo => {
    const isMyRoom = roomInfo.type === 'WKS0001';
    return isMyRoom
      ? userStore.myProfile.name
      : roomInfo.customName || roomInfo.name;
  };

  // 이름과 표시 여부로 필터
  // TODO 멤버 이름으로 검색은 아직 안 됨. 이를 위해서는 모든 룸에 대한 멤버 목록을 가져와야함.
  const roomFilter = roomInfo =>
    roomInfo.isVisible &&
    (!store.keyword ||
      getRoomName(roomInfo)
        ?.toLowerCase()
        ?.includes(store.keyword.toLowerCase()));

  const handleToastClose = () => {
    store.toast.visible = false;
  };

  const themeContext = useContext(ThemeContext);

  useCommand.NewRoom(handleCreateRoom);
  useCommand.Mute();
  useCommand.OrgChart();
  useCommand.MyRoom();

  return (
    <Wrapper>
      <Observer>
        {() => {
          return (
            <RoomInquiryModal
              roomId={store.targetRoom?.id}
              visible={store.visible.roomMemberModal}
              onCancel={handleRoomMemeberModalCancel}
              width="17.5rem"
              top="calc(50% - 15rem)"
              left="16.81rem"
              isEdit={store.roomMemberAttr.isEdit}
            />
          );
        }}
      </Observer>

      <Observer>
        {() => {
          return store.targetUserId ? (
            <ProfileInfoModal
              userId={store.targetUserId}
              visible={store.visible.profileModal}
              onClickMeeting={_roomId => {
                uiStore.openWindow({
                  id: _roomId,
                  type: 'meeting',
                  name: null,
                  userCount: null,
                  handler: null,
                });
              }}
              onClose={handleCloseProfileInfoModal}
              position={{ left: '16.81rem' }}
            />
          ) : null;
        }}
      </Observer>

      <Observer>
        {() => (
          <Message
            visible={store.visible.exitNormalModal}
            title={t('CM_Q_LEAVE_ROOM')}
            subtitle={t('CM_DEL_ROOM_GUIDE')}
            type="error"
            btns={[
              {
                text: t('CM_LEAVE'),
                type: 'solid',
                onClick: handleConfirmExitNormalModal,
              },
              {
                text: t('CM_CANCEL'),
                type: 'outlined',
                onClick: handleCloseExitNormalModal,
              },
            ]}
          />
        )}
      </Observer>

      <Observer>
        {() => (
          <Message
            visible={store.visible.exitAdminModal}
            title={t('CM_DEL_ROOM_GROUP_05')}
            subtitle={t('CM_DEL_ROOM_GROUP_06')}
            type="warning"
            btns={[
              {
                text: t('CM_DEL_ROOM_GROUP_07'),
                type: 'solid',
                onClick: handleConfirmExitAdminModal,
              },
              {
                text: t('CM_CANCEL'),
                type: 'outlined',
                onClick: handleCloseExitAdminModal,
              },
            ]}
          />
        )}
      </Observer>

      <Observer>
        {() => (
          <SelectRoomTypeDialog
            visible={store.visible.selectRoomTypeModal}
            onCancel={handleSelectRoomTypeCancel}
            onCreateRoom={({ selectedUsers, isNewRoom }) => {
              if (isNewRoom) {
                store.toast = {
                  visible: true,
                  text: t('CM_INVITE_MEMBER', {
                    num: selectedUsers.length,
                  }),
                };
              }
            }}
          />
        )}
      </Observer>

      <TopWrapper>
        <FriendSearch
          className="friendSearch"
          type="underline"
          searchIconColor={{
            active: themeContext.IconActive2,
            default: themeContext.TextHinted,
          }}
          clearIconColor={{
            active: themeContext.ClearActiveIcon,
            default: themeContext.ClearNormalIcon,
          }}
          onChange={handleChange}
          onClear={handleClear}
          placeholder={t('CM_SEARCH_NAME')}
          isCountExist={false}
        />
        <Tooltip
          title={t('CM_CREATE_ROOM')}
          placement="bottomLeft"
          color={themeContext.CoreLight}
        >
          <AddRoomIconWrapper
            className="rooms__create-button"
            onClick={handleCreateRoom}
          >
            <AddRoomIcon
              width={1.38}
              height={1.38}
              color={themeContext.IconNormal2}
            />
          </AddRoomIconWrapper>
        </Tooltip>
      </TopWrapper>
      <RoomContainer
        id="lnb__room-container"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <Observer>
          {() => {
            const botRoom = roomStore.getBotRoom();
            const rooms = roomStore.getRoomArray();
            if (botRoom) rooms.splice(1, 0, botRoom);

            return rooms
              .filter(roomFilter)
              .map(roomInfo => (
                <RoomItem
                  key={roomInfo.id}
                  roomInfo={roomInfo}
                  onClick={handleSelectRoom}
                  onMenuClick={handleMenuClick}
                  onClickMenuItem={handleClickMenuItem}
                  onClickRoomPhoto={handleClickRoomPhoto}
                />
              ));
          }}
        </Observer>
      </RoomContainer>

      <Observer>
        {() => {
          return configStore.isActivateComponent('Platform', 'LNB:Logo') ? (
            <ButtonWrapper isScrollEnd={store.isScrollEnd}>
              <WaplLogo textColor={themeContext.BasicDark} />
            </ButtonWrapper>
          ) : null;
        }}
      </Observer>

      <Observer>
        {() => (
          <Toast
            visible={store.toast.visible}
            timeoutMs={1000}
            onClose={handleToastClose}
          >
            {store.toast.text}
          </Toast>
        )}
      </Observer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${props => props.theme.StateNormal};
  overflow-y: auto;
  height: 100%;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  input {
    width: 100%;
  }
`;

const RoomContainer = styled.div`
  overflow: hidden auto;
  flex: 1;
`;

const AddRoomIconWrapper = styled.div`
  display: flex;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${props => props.theme.StateNormal};
  box-shadow: 0 0 0.31rem 0 ${props => props.theme.ModalShadow};
  pointer-events: ${({ $isDisable }) => ($isDisable ? 'none' : '')};
  cursor: ${({ $isDisable }) => ($isDisable ? '' : 'pointer')};

  &:hover {
    background-color: ${props => props.theme.SubStateBright};
  }

  &:active {
    background-color: ${props => props.theme.SubStateDark};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.69rem 0.94rem;
  ${({ isScrollEnd }) => {
    return (
      !isScrollEnd &&
      css`
        box-shadow: 0 -0.8125rem 0.75rem -0.1875rem
          ${props => props.theme.StateNormal};
      `
    );
  }}
  z-index: 5;
`;

export const FriendSearch = styled(WaplSearch)`
  &.friendSearch {
    display: flex;
    flex: 1 1 0%;
    margin-right: 0.63rem;
    height: 1.75rem;
    padding: 0;
  }
`;

export default RoomList;

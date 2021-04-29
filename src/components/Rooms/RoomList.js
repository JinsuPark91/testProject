import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import styled, { css } from 'styled-components';
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

function RoomList() {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { uiStore, historyStore } = useStores();
  const [keyword, setKeyword] = useState('');
  const [targetRoom, setTargetRoom] = useState(null);
  const [exitTargetRoom, setExitTargetRoom] = useState(null);
  const [isRoomMemberModalVisible, setIsRoomMemberModalVisible] = useState(
    false,
  );
  const [isExitAdminModalVisible, setIsExitAdminModalVisible] = useState(false);
  const [isExitNormalModalVisible, setIsExitNormalModalVisible] = useState(
    false,
  );
  const [roomMemberAttr, setRoomMemberAttr] = useState({});
  const { roomStore, userStore, configStore, authStore } = useCoreStores();
  const [isProfileInfoModalVisible, setIsProfileInfoModalVisible] = useState(
    false,
  );
  const [targetUserId, setTargetUserId] = useState(null);

  const [visible, setVisible] = useState({
    selectRoomType: false,
  });
  const [toastText, setToastText] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [uiStore.tabType]);

  // LNB lastMessage i18n 임시
  useEffect(() => {
    EventBus.dispatch('Platform:initLNB');
  }, [i18n.language]);

  const handleScroll = throttle(() => {
    const container = containerRef.current;
    const { scrollTop, clientHeight, scrollHeight } = container;

    if (scrollTop + clientHeight === scrollHeight) {
      setIsScrollEnd(true);
    } else {
      setIsScrollEnd(false);
    }
  }, 200);

  const handleCreateRoom = () => {
    setVisible({ ...visible, selectRoomType: true });
    logEvent('main', 'clickRoomCreateBtn');
  };

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
    setKeyword(value);
  };

  const handleClear = () => {
    setKeyword('');
  };

  const handleSelectRoomTypeCancel = () => {
    setVisible(false);
  };

  const handleRoomMemeberModalCancel = () => {
    setIsRoomMemberModalVisible(false);
  };

  const handleMenuClick = useCallback(roomInfo => {
    setTargetRoom(roomInfo);
  }, []);

  const handleClickMenuItem = useCallback(({ key, item, value }) => {
    switch (key) {
      case 'profile':
        setTargetUserId(item);
        setIsProfileInfoModalVisible(true);
        break;
      case 'member':
      case 'changeName':
        setRoomMemberAttr(value);
        setTargetRoom(item);
        setIsRoomMemberModalVisible(true);
        break;
      case 'exitAdmin': // 룸 관리자가 '나가기' 버튼 누른 경우
        setExitTargetRoom(item);
        setIsExitAdminModalVisible(true);
        break;
      case 'exitNormal': // 일반 사용자가 '나가기' 버튼 누른 경우
        setExitTargetRoom(item);
        setIsExitNormalModalVisible(true);
        break;
      default:
    }
  }, []);

  const handleClickRoomPhoto = useCallback(
    roomInfo => {
      // NOTE. 마이룸인 경우 나의 프로파일 정보를,
      //  1:1 방의 경우 상대 유저의 프로파일 정보를 보여줌.
      const isDMRoom = roomInfo.isDirectMsg;
      const isMyRoom = roomInfo.type === 'WKS0001';

      if (isMyRoom) {
        setTargetUserId(userStore.myProfile.id);
        setIsProfileInfoModalVisible(true);
      } else if (isDMRoom) {
        const found = roomInfo.memberIdListString
          .split(',')
          .find(userId => userId !== userStore.myProfile.id);

        setTargetUserId(found);
        setIsProfileInfoModalVisible(true);
      } else {
        setTargetRoom(roomInfo);
        setRoomMemberAttr({ isEdit: false });
        setIsRoomMemberModalVisible(true);
      }
    },
    [userStore],
  );

  const handleCloseProfileInfoModal = useCallback(() => {
    setIsProfileInfoModalVisible(false);
  }, []);

  const handleCloseExitAdminModal = useCallback(() => {
    setIsExitAdminModalVisible(false);
  }, []);

  const handleConfirmExitAdminModal = useCallback(() => {
    if (exitTargetRoom === null) return;

    history.push(`/s/${exitTargetRoom.id}/setting`);
    setIsExitAdminModalVisible(false);
  }, [exitTargetRoom]);

  const handleCloseExitNormalModal = useCallback(() => {
    setIsExitNormalModalVisible(false);
  }, []);

  const handleConfirmExitNormalModal = useCallback(async () => {
    if (exitTargetRoom === null) return;

    try {
      const result = await roomStore.deleteRoomMember({
        userId: userStore.myProfile.id,
        roomId: exitTargetRoom.id,
      });

      if (result) {
        if (
          uiStore.resourceType === 's' &&
          uiStore.resourceId === exitTargetRoom.id
        ) {
          const firstRoomId = roomStore.getRoomArray()?.[0].id;
          if (firstRoomId) history.push(`/s/${firstRoomId}/talk`);
        }
      }
    } catch (e1) {
      console.log('DELETE ROOM MEMBER ERROR : ', e1);
    } finally {
      setExitTargetRoom(null);
      setIsExitNormalModalVisible(false);
    }
  }, [exitTargetRoom, userStore, roomStore]);

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
    (!keyword ||
      getRoomName(roomInfo)?.toLowerCase()?.includes(keyword.toLowerCase()));

  const handleToastClose = () => {
    setIsToastVisible(false);
  };

  const hasMemberCreatePermission = authStore.hasPermission('members', 'C');

  return (
    <Wrapper>
      <Observer>
        {() => {
          return (
            <RoomInquiryModal
              roomId={targetRoom?.id}
              visible={isRoomMemberModalVisible}
              onCancel={handleRoomMemeberModalCancel}
              width="17.5rem"
              top="calc(50% - 15rem)"
              left="16.81rem"
              isEdit={roomMemberAttr.isEdit}
            />
          );
        }}
      </Observer>
      <Observer>
        {() => {
          return targetUserId ? (
            <ProfileInfoModal
              userId={targetUserId}
              visible={isProfileInfoModalVisible}
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

      <Message
        visible={isExitNormalModalVisible}
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

      <Message
        visible={isExitAdminModalVisible}
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

      <SelectRoomTypeDialog
        visible={visible.selectRoomType}
        onCancel={handleSelectRoomTypeCancel}
        onCreateRoom={({ selectedUsers, isNewRoom }) => {
          if (isNewRoom) {
            setIsToastVisible(true);
            setToastText(
              t('CM_INVITE_MEMBER', {
                num: selectedUsers.length,
              }),
            );
          }
        }}
      />

      <TopWrapper>
        <FriendSearch
          className="friendSearch"
          type="underline"
          searchIconColor={{ active: '#000', default: '#000' }}
          clearIconColor={{ active: '#17202B', default: '#C6CED6' }}
          onChange={handleChange}
          onClear={handleClear}
          placeholder={t('CM_SEARCH_NAME')}
          isCountExist={false}
        />
        <Tooltip
          title={t('CM_CREATE_ROOM')}
          placement="bottomLeft"
          color="#4C535D"
        >
          <AddRoomIconWrapper
            className="rooms__create-button"
            onClick={handleCreateRoom}
            $isDisable={!hasMemberCreatePermission}
          >
            <AddRoomIcon
              width={1.38}
              height={1.38}
              color={hasMemberCreatePermission ? '#232D3B' : '#999'}
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
            return roomStore
              .getRoomArray()
              .filter(roomFilter)
              .map(roomInfo => (
                <RoomItem
                  key={roomInfo.id}
                  roomInfo={roomInfo}
                  selected={uiStore.resourceId === roomInfo.id}
                  onClick={handleSelectRoom}
                  onMenuClick={handleMenuClick}
                  onClickMenuItem={handleClickMenuItem}
                  onClickRoomPhoto={handleClickRoomPhoto}
                />
              ));
          }}
        </Observer>
      </RoomContainer>
      {configStore.isActivateComponent('Platform', 'LNB:Logo') ? (
        <ButtomWrapper
          isScrollEnd={isScrollEnd}
          // onClick={() => {
          //   const store = uiStore;
          //   const currentTheme = store.getTheme();
          //   if (currentTheme === 'white') store.setTheme('dark');
          //   else if (currentTheme === 'dark') store.setTheme('green');
          //   else store.setTheme('white');
          // }}
        >
          <WaplLogo />
        </ButtomWrapper>
      ) : null}
      <Toast
        visible={isToastVisible}
        timeoutMs={1000}
        onClose={handleToastClose}
      >
        {toastText}
      </Toast>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // background: ${props => props.theme.bg_color};
  background: #ffffff;
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
  background-color: #fff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  pointer-events: ${({ $isDisable }) => ($isDisable ? 'none' : '')};

  &:hover {
    background-color: #ebe6df;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  }

  &:active {
    background-color: #ddd7cd;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  }
`;

const ButtomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.69rem 0.94rem;
  ${({ isScrollEnd }) => {
    return (
      !isScrollEnd &&
      css`
        box-shadow: 0 -0.8125rem 0.75rem -0.1875rem #fff;
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

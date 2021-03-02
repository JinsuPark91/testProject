import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import {
  useCoreStores,
  Toast,
  ProfileInfoModal,
  Message,
  logEvent,
} from 'teespace-core';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { WaplLogo, AddRoomIcon } from '../Icons';
import RoomItem from './RoomItem';
import PlatformUIStore from '../../stores/PlatformUIStore';
import SelectRoomTypeDialog from './SelectRoomTypeDialog';
import RoomInquiryModal from './RoomInquiryModal';
import Search from '../common/Search';

function RoomList() {
  const history = useHistory();
  const { t, i18n } = useTranslation();
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
  const { roomStore, userStore } = useCoreStores();
  const [isProfileInfoModalVisible, setIsProfileInfoModalVisible] = useState(
    false,
  );
  const [targetUserId, setTargetUserId] = useState(null);

  const [visible, setVisible] = useState({
    selectRoomType: false,
  });
  const [toastText, setToastText] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleCreateRoom = () => {
    setVisible({ ...visible, selectRoomType: true });
    logEvent('main', 'clickRoomCreateBtn');
  };

  const handleSelectRoom = useCallback(
    roomInfo => {
      (async () => {
        // NOTE : 같은 방을 누르면 history 부르지 않는다.
        const isSameRoom =
          PlatformUIStore.resourceType === 's' &&
          PlatformUIStore.resourceId === roomInfo.id;
        if (isSameRoom) return Promise.resolve();

        try {
          const routingHistory = (
            await userStore.getRoutingHistory({
              userId: userStore.myProfile.id,
              roomId: roomInfo.id,
            })
          )?.[0];

          history.push(routingHistory?.lastUrl || `/s/${roomInfo.id}/talk`);
        } catch (err) {
          console.log('[Platform] Get routing history 에러 : ', err);
          history.push(`/s/${roomInfo.id}/talk`);
        }
      })();
    },
    [history, userStore],
  );

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
          PlatformUIStore.resourceType === 's' &&
          PlatformUIStore.resourceId === exitTargetRoom.id
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
              left="17rem"
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
                PlatformUIStore.openWindow({
                  id: _roomId,
                  type: 'meeting',
                  name: null,
                  userCount: null,
                  handler: null,
                });
              }}
              onClose={handleCloseProfileInfoModal}
              position={{ left: '17rem' }}
            />
          ) : null;
        }}
      </Observer>

      <Message
        visible={isExitNormalModalVisible}
        title="룸에서 나가시겠습니까?"
        subtitle="룸을 나가면, 모바일 WAPL에서도 룸이 삭제됩니다. 중요한 데이터는 미리 백업해 주세요."
        type="error"
        btns={[
          {
            text: '나가기',
            type: 'solid',
            onClick: handleConfirmExitNormalModal,
          },
          {
            text: '취소',
            type: 'outlined',
            onClick: handleCloseExitNormalModal,
          },
        ]}
      />

      <Message
        visible={isExitAdminModalVisible}
        title="룸 관리자는 룸을 나갈 수 없습니다"
        subtitle="룸을 나가시려면, 먼저 룸 설정에서 다른 멤버에게 룸 관리자 권한을 이양해주세요."
        type="warning"
        btns={[
          {
            text: '룸 설정으로 이동',
            type: 'solid',
            onClick: handleConfirmExitAdminModal,
          },
          {
            text: '취소',
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
              `${selectedUsers.length}명의 구성원이 초대되었습니다.`,
            );
          }
        }}
      />

      <TopWrapper>
        <InputWrapper>
          <Search
            placeholder={t('WEB_COMMON_B2C_LNB_EMPTY_PAGE_01')}
            onChange={handleChange}
            onClear={handleClear}
            searchIconColor={{ active: '#17202B', default: '#C6CED6' }}
            clearIconColor={{ active: '#17202B', default: '#C6CED6' }}
            type="underline"
          />
        </InputWrapper>
        <Tooltip
          title={t('WEB_COMMON_B2C_LNB_EMPTY_PAGE_05')}
          placement="bottomLeft"
          color="#232D3B"
        >
          <AddRoomIconWrapper onClick={handleCreateRoom}>
            <AddRoomIcon width={1.38} height={1.38} color="#232D3B" />
          </AddRoomIconWrapper>
        </Tooltip>
      </TopWrapper>
      <RoomContainer>
        <Observer>
          {() => {
            return roomStore
              .getRoomArray()
              .filter(roomFilter)
              .map(roomInfo => (
                <RoomItem
                  key={roomInfo.id}
                  roomInfo={roomInfo}
                  selected={PlatformUIStore.resourceId === roomInfo.id}
                  onClick={handleSelectRoom}
                  onMenuClick={handleMenuClick}
                  onClickMenuItem={handleClickMenuItem}
                  onClickRoomPhoto={handleClickRoomPhoto}
                />
              ));
          }}
        </Observer>
      </RoomContainer>
      <ButtomWrapper>
        <div
          onClick={() => {
            if (i18n.language === 'ko') i18n.changeLanguage('en');
            else i18n.changeLanguage('ko');
          }}
        >
          <WaplLogo />
        </div>
        <Toast
          visible={isToastVisible}
          timeoutMs={1000}
          onClose={handleToastClose}
        >
          {toastText}
        </Toast>
      </ButtomWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #ffffff;
  overflow-y: auto;
  height: 100%;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.63rem 0.75rem;
  input {
    width: 100%;
  }
`;

const RoomContainer = styled.div`
  overflow: hidden auto;
  flex: 1;
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  margin-right: 0.56rem;
`;

const AddRoomIconWrapper = styled.div`
  display: flex;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);

  &:hover {
    background: #ebe6df;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  }
`;

const ButtomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.69rem 0.94rem;
  box-shadow: 0 -0.8125rem 0.75rem -0.1875rem #fff;
  z-index: 5;
`;

export default RoomList;

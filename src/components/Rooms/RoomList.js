import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { useCoreStores, Toast } from 'teespace-core';
import { Tooltip } from 'antd';
import { WaplLogo, AddRoomIcon, OpenChatIcon, SearchIcon } from '../Icons';
import EmptyRoomIllust from '../../assets/space_make.svg';
import RoomItem from './RoomItem';
import OpenRoomHome from './OpenRoomHome';
import PlatformUIStore from '../../stores/PlatformUIStore';
import SelectRoomTypeDialog from './SelectRoomTypeDialog';
import RoomInquiryModal from './RoomInquiryModal';
import ProfileInfoModal from '../profile/ProfileInfoModal';

function RoomList() {
  const history = useHistory();
  const [keyword, setKeyword] = useState('');
  const [openRoomDialogVisible, setOpenRoomDialogVisible] = useState(false);
  const [targetRoom, setTargetRoom] = useState(null);
  const [isRoomMemberModalVisible, setIsRoomMemberModalVisible] = useState(
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
  };

  const handleOpenChat = useCallback(() => {
    setOpenRoomDialogVisible(true);
  }, []);

  const handleSelectRoom = async roomInfo => {
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
  };

  const handleChange = useCallback(e => {
    setKeyword(e.target.value);
  }, []);

  const handleSelectRoomTypeCancel = () => {
    setVisible(false);
  };

  const handleRoomMemeberModalCancel = () => {
    setIsRoomMemberModalVisible(false);
  };

  const handleMenuClick = roomInfo => {
    setTargetRoom(roomInfo);
  };

  const handleClickMenuItem = ({ key, item, value }) => {
    switch (key) {
      case 'member':
      case 'changeName':
        setRoomMemberAttr(value);
        setTargetRoom(item);
        setIsRoomMemberModalVisible(true);
        break;
      default:
    }
  };

  const handleOpenRoomModalCancel = () => {
    setOpenRoomDialogVisible(false);
  };

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
        setIsRoomMemberModalVisible(true);
      }
    },
    [userStore],
  );

  const handleCloseProfileInfoModal = useCallback(() => {
    setIsProfileInfoModalVisible(false);
  }, []);

  const isOnlyMyRoom = () => {
    const rooms = roomStore
      .getRoomArray()
      .filter(roomInfo => roomInfo.isVisible);
    return rooms.length === 1 && rooms[0].type === 'WKS0001';
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
    (!keyword || getRoomName(roomInfo)?.includes(keyword));

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
          return (
            targetUserId && (
              <ProfileInfoModal
                userId={targetUserId}
                visible={isProfileInfoModalVisible}
                onClose={handleCloseProfileInfoModal}
                position={{ left: '17rem' }}
              />
            )
          );
        }}
      </Observer>

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
          <SearchIcon width={1} height={1} color="rgb(133, 133, 133)" />
          <input
            type="text"
            value={keyword}
            onChange={handleChange}
            placeholder="룸 이름, 구성원 검색"
          />
        </InputWrapper>
        <Tooltip placement="bottomLeft" title="오픈 룸 홈" color="#0b1d41">
          <OpenChatIconWrapper onClick={handleOpenChat}>
            <OpenChatIcon />
          </OpenChatIconWrapper>
        </Tooltip>
        <OpenRoomHome
          visible={openRoomDialogVisible}
          onCancel={handleOpenRoomModalCancel}
        />
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
      <Observer>
        {() =>
          isOnlyMyRoom() ? (
            <div>
              <StyledInfoTitle>
                {`${userStore.myProfile.name}님, 환영합니다.`}
                <br />
                룸을 만들어 보세요!
              </StyledInfoTitle>
              <StyledSubInfo>
                구성원들과 Talk 중심의
                <br />
                다양한 앱을 경험 할 수 있습니다.
              </StyledSubInfo>
              <WelcomeBackgroundImage />
            </div>
          ) : null
        }
      </Observer>
      <ButtomWrapper>
        <WaplLogo />
        <Tooltip title="룸 만들기" placement="top" color="#0B1D41">
          <AddRoomIconWrapper onClick={handleCreateRoom}>
            <AddRoomIcon />
          </AddRoomIconWrapper>
        </Tooltip>
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
  background: rgb(245, 245, 251);
  overflow-y: auto;
  height: 100%;
`;

const TopWrapper = styled.div`
  display: flex;
  padding: 0.5rem 0.75rem;
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
  margin-right: 0.5rem;
  padding: 0 0.63rem;
  background: #fff;
  border-radius: 25px;
  border: 1px solid #e3e7eb;

  &:focus-within {
    border: 1px solid #6c56e5;
  }

  input {
    margin-left: 0.44rem;
    height: 1.13rem;
    border: 0;
    font-size: 0.75rem;

    &:focus {
      outline: 0;
    }
  }
`;

const StyledInfoTitle = styled.p`
  margin-bottom: 0.94rem;
  font-size: 0.94rem;
  color: #523dc7;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.38rem;
`;

const StyledSubInfo = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  color: #6c56e5;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.06rem;
`;

const WelcomeBackgroundImage = styled.div`
  width: 12.5rem;
  height: 12.5rem;
  margin: 0 auto;
  background: url('${EmptyRoomIllust}') center 0 no-repeat;
  background-size: contain;
`;

const AddRoomIconWrapper = styled.div`
  display: flex;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #232d3b;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
`;

const OpenChatIconWrapper = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 1.81rem;
  height: 1.81rem;
  border: 1px solid #e3e7eb;
  border-radius: 50%;
  background: #ffffff;
`;

const ButtomWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0.75rem 0.69rem 0.75rem 0.94rem;
`;

export default RoomList;

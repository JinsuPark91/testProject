import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, Button, Modal } from 'antd';
import { useCoreStores } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import privateRoomImg from '../../assets/private_room.svg';
import openRoomImg from '../../assets/open_room.svg';
import CreatePrivateRoomDialog from '../dialogs/CreatePrivateRoomDialog';
import CreatePublicRoomDialog from '../dialogs/CreatePublicRoomDialog';
import { getQueryParams, getQueryString } from '../../utils/UrlUtil';

const { Title } = Typography;

const SelectRoomType = styled.div`
  width: 100%;
  padding: 2.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-item: center;
`;

const RoomInformation = styled.div`
  width: 100%;
  max-width: 50%;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  &:last-of-type {
    margin-left: 3.75rem;
  }
`;
const StyledInfoTitle = styled(Title)`
  font-size: 0.94rem;
  line-height: 1.38rem;
  color: #000000;
  letter-spacing: 0;
  margin-bottom: 0.63rem;
`;
const StyledInfoText = styled.p`
  margin-bottom: 0.13rem;
  font-size: 0.75rem;
  word-break: break-all;
  color: #696969;
  letter-spacing: 0;
  text-align: center;
  line-height: 1rem;
`;
const StyledInfoImg = styled.img`
  width: 6.88rem;
  margin-bottom: 0.63rem;
`;
const StyledButton = styled(Button)`
  &.ant-btn {
    width: 8.38rem;
    height: 1.88rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
    color: #fff;
    text-align: center;
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
`;

function SelectRoomTypeDialog({ visible, onCancel, onCreateRoom = () => {} }) {
  const { userStore, roomStore } = useCoreStores();
  const history = useHistory();
  // Private Room
  const [isVisible, setIsVisible] = useState({
    createPrivateRoom: false,
    createPublicRoom: false,
  });

  const handleCancel = () => {
    onCancel();
  };

  const handlePrivateRoomCreate = () => {
    onCancel();
    setIsVisible({ ...isVisible, createPrivateRoom: true });
  };

  const handleOpenRoomCreate = () => {
    onCancel();
    setIsVisible({ ...isVisible, createPublicRoom: true });
  };

  // Private Room
  const handleCreatePrivateRoomOk = async ({
    isChangeName,
    isStartMeeting,
    roomName,
    selectedUsers,
  }) => {
    const data = {
      creatorId: userStore.myProfile.id,
      userList: selectedUsers.map(user => ({
        userId: user.friendId || user.id,
      })),
    };

    if (selectedUsers.length > 1 && isChangeName && !!roomName) {
      Object.defineProperty(data, 'name', { value: roomName });
    }

    const prevRoomList = roomStore.roomArray;

    setIsVisible({ ...isVisible, createPrivateRoom: false });
    const { roomId } = await roomStore.createRoom(data);

    const existRoom = roomStore.getRoomMap().get(roomId);
    if (existRoom) {
      const myUserId = userStore.myProfile.id;
      await roomStore.updateRoomMemberSetting({
        roomId,
        myUserId,
        newIsVisible: true,
      });
    }

    await talkRoomStore.initialize(userStore.myProfile.id, roomId);

    // NOTE. 룸 목록 컴포넌트에서 토스트를 띄우기 위해 전달
    onCreateRoom({
      selectedUsers,
      isNewRoom: !prevRoomList.some(prevRoom => prevRoom.id === roomId),
    });

    history.push(`/s/${roomId}/talk${isStartMeeting ? '?sub=meeting' : ''}`);
  };

  const handleCreatePrivateRoomCancel = () => {
    setIsVisible({ ...isVisible, createPrivateRoom: false });
  };

  // Public Room
  const handleCreatePublicRoomOk = async ({
    roomName,
    selectedUsers,
    isStartMeeting,
  }) => {
    const data = {
      name: roomName,
      creatorId: userStore.myProfile.id,
      userList: selectedUsers.map(user => ({
        userId: user.friendId || user.id,
      })),
      type: 'open',
    };

    setIsVisible({ ...isVisible, createPublicRoom: false });
    const { roomId } = await roomStore.createRoom(data);

    await talkRoomStore.initialize(userStore.myProfile.id, roomId);

    history.push(`/s/${roomId}/talk${isStartMeeting ? '?sub=meeting' : ''}`);
  };

  const handleCreatePublicRoomCancel = () => {
    setIsVisible({ ...isVisible, createPublicRoom: false });
  };

  return (
    <>
      <CreatePrivateRoomDialog
        visible={isVisible.createPrivateRoom}
        onOk={handleCreatePrivateRoomOk}
        onCancel={handleCreatePrivateRoomCancel}
      />
      <CreatePublicRoomDialog
        visible={isVisible.createPublicRoom}
        onOk={handleCreatePublicRoomOk}
        onCancel={handleCreatePublicRoomCancel}
      />
      <StyledModal
        visible={visible}
        mask={false}
        footer={null}
        width="31.25rem"
        onCancel={handleCancel}
      >
        <SelectRoomType>
          <RoomInformation>
            <StyledInfoTitle level={4}>프라이빗 룸</StyledInfoTitle>
            <StyledInfoText>
              프라이빗 룸을 통해 간단한 대화를 나누어 보세요. 구성원들만의
              개인적인 공간입니다.
            </StyledInfoText>
            <StyledInfoImg src={privateRoomImg} alt="" />
            <StyledButton
              type="solid"
              shape="round"
              onClick={handlePrivateRoomCreate}
            >
              프라이빗 룸 만들기
            </StyledButton>
          </RoomInformation>
          <RoomInformation>
            <Title level={4}>오픈 룸</Title>
            <StyledInfoText>
              오픈 룸을 통해 특정 주제, 프로젝트를 진행해보세요. 누구나 검색을
              통하여 자유롭게 참여할 수 있는 공간입니다.
            </StyledInfoText>
            <StyledInfoImg src={openRoomImg} alt="" />
            <StyledButton
              type="solid"
              shape="round"
              onClick={handleOpenRoomCreate}
            >
              오픈 룸 만들기
            </StyledButton>
          </RoomInformation>
        </SelectRoomType>
      </StyledModal>
    </>
  );
}

export default SelectRoomTypeDialog;

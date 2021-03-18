import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, Modal } from 'antd';
import { useCoreStores, logEvent } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import { useTranslation } from 'react-i18next';
import { PrivateRoomIcon, OpenChatIcon } from '../Icons';
import CreatePrivateRoomDialog from '../dialogs/CreatePrivateRoomDialog';
import PlatformUIStore from '../../stores/PlatformUIStore';
import OpenRoomHome from './OpenRoomHome';

const { Title } = Typography;

const VerticalBar = styled.div`
  height: 10rem;
  width: 1px;
  background: #ddd9d4;
  margin: 0 1rem;
`;

const SelectRoomType = styled.div`
  width: 100%;
  padding: 3.13rem 1.5rem 1.56rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoomInformation = styled.div`
  width: 12.81rem;
  padding: 2rem 1rem;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  cursor: pointer;
  border-radius: 0.875rem;

  &:hover {
    background: #faf8f7;
  }

  &:active {
    background: #f2efec;
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
  font-size: 0.75rem;
  color: #696969;
  white-space: pre-line;
  letter-spacing: 0;
  text-align: center;
  line-height: 1rem;
`;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-close .ant-modal-close-x {
    color: #7b7671;
    font-size: 1.06rem;
  }
`;

function SelectRoomTypeDialog({ visible, onCancel, onCreateRoom = () => {} }) {
  const { t } = useTranslation();
  const { userStore, roomStore } = useCoreStores();

  const history = useHistory();
  // Private Room
  const [isVisible, setIsVisible] = useState({
    createPrivateRoom: false,
    createPublicRoom: false,
    openRoomDialog: false,
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
    setIsVisible({ ...isVisible, openRoomDialog: true });
    logEvent('main', 'clickOpenRoomHomeBtn');
    // setIsVisible({ ...isVisible, createPublicRoom: true });
  };

  const handleOpenRoomModalCancel = () => {
    setIsVisible({ ...isVisible, openRoomDialog: false });
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

    if (isStartMeeting) {
      PlatformUIStore.openWindow({
        id: roomId,
        type: 'meeting',
        name: null,
        userCount: null,
        handler: null,
      });
    }
    history.push(`/s/${roomId}/talk`);
    // history.push(`/s/${roomId}/talk${isStartMeeting ? '?sub=meeting' : ''}`);
  };

  const handleCreatePrivateRoomCancel = () => {
    setIsVisible({ ...isVisible, createPrivateRoom: false });
  };

  return (
    <>
      <OpenRoomHome
        visible={isVisible.openRoomDialog}
        onCancel={handleOpenRoomModalCancel}
      />
      <CreatePrivateRoomDialog
        visible={isVisible.createPrivateRoom}
        onOk={handleCreatePrivateRoomOk}
        onCancel={handleCreatePrivateRoomCancel}
      />
      <StyledModal
        visible={visible}
        mask={false}
        footer={null}
        width="31.25rem"
        onCancel={handleCancel}
        centered
      >
        <SelectRoomType>
          <RoomInformation onClick={handlePrivateRoomCreate}>
            <div style={{ marginBottom: '1.19rem' }}>
              <PrivateRoomIcon width={1.88} height={1.88} color="#232D3B" />
            </div>
            <StyledInfoTitle level={4}>
              {t('CM_CREATE_ROOM_OPTION_01')}
            </StyledInfoTitle>
            <StyledInfoText>{t('CM_CREATE_ROOM_OPTION_02')}</StyledInfoText>
          </RoomInformation>
          <VerticalBar />
          <RoomInformation onClick={handleOpenRoomCreate}>
            <div style={{ marginBottom: '1.19rem' }}>
              <OpenChatIcon width={1.88} height={1.88} color="#232D3B" />
            </div>
            <Title level={4}>{t('CM_CREATE_ROOM_OPTION_03')}</Title>
            <StyledInfoText>{t('CM_CREATE_ROOM_OPTION_04')}</StyledInfoText>
          </RoomInformation>
        </SelectRoomType>
      </StyledModal>
    </>
  );
}

export default SelectRoomTypeDialog;

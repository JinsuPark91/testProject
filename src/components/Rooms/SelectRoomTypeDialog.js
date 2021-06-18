import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
import { useCoreStores, logEvent, Modal } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { PrivateRoomIcon, OpenChatIcon } from '../Icons';
import CreatePrivateRoomDialog from '../dialogs/CreatePrivateRoomDialog';
import { useStores } from '../../stores';
import OpenRoomHome from './OpenRoomHome';

const VerticalBar = styled.div`
  height: 10rem;
  width: 1px;
  background: ${props => props.theme.LineMain};
  margin: 0 1rem;
`;

const SelectRoomType = styled.div`
  width: 100%;
  padding: 3.13rem 1.5rem 1.56rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoomInformation = styled.button`
  width: 12.81rem;
  padding: 2rem 1rem;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  border-radius: 0.875rem;
  background: ${props => props.theme.StateNormal};
  border: 0;

  &:hover {
    cursor: pointer;
    background: ${props => props.theme.StateBright};
  }

  &:active {
    background: ${props => props.theme.StateDark};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const StyledInfoTitle = styled.strong`
  display: block;
  margin-bottom: 0.63rem;
  font-size: 0.94rem;
  line-height: 1.38rem;
  color: ${({ disabled, theme }) =>
    disabled ? theme.DisabledShape : theme.TextMain};
  letter-spacing: 0;
`;
const StyledInfoText = styled.p`
  font-size: 0.75rem;
  color: ${({ disabled, theme }) =>
    disabled ? theme.DisabledShape : theme.TextSub};
  white-space: pre-line;
  letter-spacing: 0;
  text-align: center;
  line-height: 1rem;
`;

function SelectRoomTypeDialog({ visible, onCancel, onCreateRoom = () => {} }) {
  const { t } = useTranslation();
  const { userStore, roomStore } = useCoreStores();
  const { uiStore } = useStores();

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
      // const myUserId = userStore.myProfile.id;
      // await roomStore.updateRoomMemberSetting({
      //   roomId,
      //   myUserId,
      //   newIsVisible: true,
      // });
      await roomStore.activateRoom({ roomId });
    }

    // NOTE. 룸 목록 컴포넌트에서 토스트를 띄우기 위해 전달
    onCreateRoom({
      selectedUsers,
      isNewRoom: !prevRoomList.some(prevRoom => prevRoom.id === roomId),
    });

    if (isStartMeeting) {
      uiStore.openWindow({
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

  const isDisabled = () => {
    return userStore.myProfile.isGuest;
  };

  const themeContext = useContext(ThemeContext);

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
      <Modal
        visible={visible}
        mask={false}
        footer={null}
        width="31.25rem"
        onCancel={handleCancel}
        centered
      >
        <SelectRoomType>
          <RoomInformation
            disabled={isDisabled()}
            onClick={handlePrivateRoomCreate}
          >
            <div style={{ marginBottom: '1.19rem' }}>
              <PrivateRoomIcon
                width={1.88}
                height={1.88}
                color={
                  isDisabled()
                    ? themeContext.IconDisabled
                    : themeContext.IconNormal2
                }
              />
            </div>
            <StyledInfoTitle disabled={isDisabled()}>
              {t('CM_CREATE_ROOM_OPTION_01')}
            </StyledInfoTitle>
            <StyledInfoText disabled={isDisabled()}>
              {t('CM_CREATE_ROOM_OPTION_02')}
            </StyledInfoText>
          </RoomInformation>
          <VerticalBar />
          <RoomInformation onClick={handleOpenRoomCreate}>
            <div style={{ marginBottom: '1.19rem' }}>
              <OpenChatIcon
                width={1.88}
                height={1.88}
                color={themeContext.IconNormal2}
              />
            </div>
            <StyledInfoTitle>{t('CM_CREATE_ROOM_OPTION_03')}</StyledInfoTitle>
            <StyledInfoText>{t('CM_CREATE_ROOM_OPTION_04')}</StyledInfoText>
          </RoomInformation>
        </SelectRoomType>
      </Modal>
    </>
  );
}

export default SelectRoomTypeDialog;

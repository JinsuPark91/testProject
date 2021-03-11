import React, { useCallback, useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Input from '../Input';

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 2.38rem 1.25rem 2.06rem;
  }
  .ant-modal-footer {
    .ant-btn {
      width: 4.5rem;
    }
  }
`;
const Title = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.13rem;
`;
const Notification = styled.span`
  font-size: 0.69rem;
  color: #8e8d94;
  line-height: 1.06rem;
`;
const InputBox = styled.div`
  position: relative;
  margin: 0.38rem 0 0.06rem;
  .ant-input {
    padding-right: 2.813rem;
  }
`;
const Count = styled.span`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  font-size: 0.6875rem;
  color: #bdc6d3;
`;

function RoomCreateModal({ visible, onCancel, onOk }) {
  const { t } = useTranslation();

  const initialStates = {
    roomName: '',
  };
  const [roomName, setRoomName] = useState(initialStates.roomName);

  const clearStates = () => {
    setRoomName(initialStates.roomName);
  };

  useEffect(() => {
    if (!visible) {
      clearStates();
    }
  }, [visible]);

  const createOpenRoom = useCallback(() => {
    onOk(roomName);
  }, [onOk, roomName]);

  const cancelCreateRoom = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <StyledModal
      visible={visible}
      title={t('CM_CREATE_OPEN_ROOM')}
      width="24.38rem"
      onCancel={onCancel}
      footer={[
        <Button
          type="solid"
          shape="default"
          key="s"
          onClick={createOpenRoom}
          disabled={!roomName}
        >
          {t('CM_CREATE_OPEN_ROOM_05')}
        </Button>,
        <Button shape="default" key="c" onClick={cancelCreateRoom}>
          {t('CM_CANCEL')}
        </Button>,
      ]}
    >
      <Title>{t('CM_ROOM_NAME_SETTING')}</Title>
      <InputBox>
        <Input
          placeholder={t('CM_B2B_CREATE_ROOM_POPUP_FRIENDS_08')}
          maxLength={50}
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
        />
        <Count>0/50</Count>
      </InputBox>
      <Notification>{t('CM_CREATE_OPEN_ROOM_04')}</Notification>
    </StyledModal>
  );
}

export default RoomCreateModal;

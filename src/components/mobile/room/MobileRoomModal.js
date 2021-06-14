import React from 'react';
import styled from 'styled-components';
import { useCoreStores, EventBus } from 'teespace-core';
import { Modal, Menu } from 'antd';

const RoomModal = ({ roomInfo, onCancel }) => {
  const { roomStore, userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  const handleCancel = () => onCancel();

  const handleRead = () => {
    onCancel();
    EventBus.dispatch('Platform:forceReadMessages', { roomId: roomInfo.id });
  };

  const handleAlarm = async option => {
    onCancel();
    try {
      await roomStore.updateRoomMemberSetting({
        roomId: roomInfo.id,
        myUserId,
        newIsAlarmUsed: option,
      });
    } catch (e) {
      console.log(`Alarm Update Failed${e}`);
    }
  };

  return (
    <>
      <ModalWrapper
        width="10rem"
        visible
        onCancel={handleCancel}
        footer={null}
        closable={false}
        centered
      >
        <StyledMenu>
          <Menu.Item key="read" onClick={handleRead}>
            읽음
          </Menu.Item>
          {roomInfo.isAlarmUsed ? (
            <Menu.Item key="enableAlarm" onClick={() => handleAlarm(false)}>
              알림 끄기
            </Menu.Item>
          ) : (
            <Menu.Item key="disableAlarm" onClick={() => handleAlarm(true)}>
              알림 켜기
            </Menu.Item>
          )}
          {/* <Menu.Item key="changeName">이름 변경</Menu.Item> */}
        </StyledMenu>
      </ModalWrapper>
    </>
  );
};

const ModalWrapper = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
`;

const StyledMenu = styled(Menu)`
  background: #ffffff;
  border: 1px solid #d0ccc7;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;

  .ant-menu-item {
    font-size: 0.75rem;
    color: #000;

    &:hover {
      background-color: #faf8f7;
    }
    &:active,
    &:focus {
      background-color: #f2efec;
    }
  }
`;

export default RoomModal;

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useCoreStores, EventBus } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import { Modal, Menu } from 'antd';

const RoomModal = ({ roomInfo, onCancel }) => {
  const { t } = useTranslation();
  const { roomStore, userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;
  const isDMRoom = roomInfo.isDirectMsg;
  const isAdmin = roomInfo.adminId === myUserId;
  const history = useHistory();

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

  const handleSetting = () => history.push(`/setting/${roomInfo?.id}`);

  const handleMember = () => history.push(`/memberManagement/${roomInfo?.id}/`);

  return (
    <>
      <ModalWrapper
        width="10rem"
        visible
        onCancel={onCancel}
        footer={null}
        closable={false}
        centered
      >
        <StyledMenu>
          <Menu.Item key="read" onClick={handleRead}>
            {t('CM_ROOM_CONTEXTMENU_05')}
          </Menu.Item>
          {roomInfo.isAlarmUsed ? (
            <Menu.Item key="enableAlarm" onClick={() => handleAlarm(false)}>
              {t('CM_CHANGE_NAME_04')}
            </Menu.Item>
          ) : (
            <Menu.Item key="disableAlarm" onClick={() => handleAlarm(true)}>
              {t('CM_NOTI_SETTING_01')}
            </Menu.Item>
          )}
          {!isDMRoom && isAdmin && (
            <>
              <Menu.Item key="setting" onClick={handleSetting}>
                {t('CM_ROOM_SETTING')}
              </Menu.Item>
              <Menu.Item key="memberManagement" onClick={handleMember}>
                {t('CM_ROOM_CONTEXTMENU_EXIT_MANAGER_03')}
              </Menu.Item>
            </>
          )}
          {/* <Menu.Item key="changeName">{t('CM_CHANGE_NAME_02')}</Menu.Item> */}
        </StyledMenu>
      </ModalWrapper>
    </>
  );
};

const ModalWrapper = styled(Modal)`
  .ant-modal-body {
    padding: 0.5rem 0;
  }
`;
const StyledMenu = styled(Menu)`
  &.ant-menu-vertical {
    overflow: hidden;
    border-radius: 0.25rem;

    .ant-menu-item {
      margin: 0;
      font-size: 0.75rem;
      color: #000;

      &:hover {
        background-color: #faf8f7;
        color: #000;
      }
      &:active,
      &:focus,
      &.ant-menu-item-selected {
        background-color: #f2efec;
      }
    }
  }
`;

export default RoomModal;

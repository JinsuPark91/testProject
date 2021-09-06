import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Modal, Menu } from 'antd';
import styled from 'styled-components';
import { useStores } from '../../../../stores';

const MobileRoomEditModal = ({ roomInfo, member, onCancel }) => {
  const { t } = useTranslation();
  const { roomSettingStore: store, uiStore } = useStores();
  const history = useHistory();

  const handleCancel = () => onCancel();

  const handleTransferOk = async () => {
    const userId = store.targetMember.id;
    await store.transferAdmin({ roomId: roomInfo.id, userId });
    uiStore.closeMessage();
    history.push(`/talk/${roomInfo?.id}`);
  };

  const handleTransfer = () => {
    store.targetMember = member;
    uiStore.openMessage({
      title: t('CM_ROOM_SETTING_MANAGE_PEOPLE_05', {
        name: store.targetMember?.nick || '',
      }),
      subTitle: t('CM_ROOM_SETTING_MANAGE_PEOPLE_06'),
      type: 'error',
      buttons: [
        {
          type: 'outlined',
          shape: 'round',
          text: t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
        {
          type: 'solid',
          shape: 'round',
          text: t('CM_LOGIN_POLICY_03'),
          onClick: handleTransferOk,
        },
      ],
    });
  };

  const handleKickoutOK = async () => {
    try {
      const userIdList = [member.id];
      const result = await store.kickoutMembers({
        roomId: roomInfo.id,
        userIdList,
      });
      if (result) {
        await Promise.all([
          // store.fetchMembers({ roomId }),  // MemberSettingPage의 WWMS hanlder에서 호출
          store.fetchBlockedMembers({ roomId: roomInfo.id }),
        ]);
        onCancel();
      }
    } catch (err) {
      console.log('강퇴 / 밴 실패 : ', err);
    }
    uiStore.closeMessage();
  };

  const handleKickout = () => {
    uiStore.openMessage({
      title: t('CM_ROOM_SETTING_FORCED_EXIT_01'),
      subTitle: t('TALK_ROOMMENU_MANAGEMEMBERS_PARTICIPANTS_05'),
      type: 'error',
      buttons: [
        {
          type: 'outlined',
          shape: 'round',
          text: t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
        {
          type: 'solid',
          shape: 'round',
          text: t('CM_LOGIN_POLICY_03'),
          onClick: handleKickoutOK,
        },
      ],
    });
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
        <Name>{member.displayName}</Name>
        <StyledMenu>
          {member.grade !== 'guest' && (
            <Menu.Item key="transfer" onClick={handleTransfer}>
              {t('MANAGEMEMBERS_PARTICIPANTS')}
            </Menu.Item>
          )}
          <Menu.Item key="exit" onClick={handleKickout}>
            {t('CM_REMOVE')}
          </Menu.Item>
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
const Name = styled.span`
  overflow: hidden;
  display: block;
  height: 2.5rem;
  margin-bottom: 0.5rem;
  padding: 0 1rem;
  font-size: 0.938rem;
  font-weight: 500;
  line-height: 2.5rem;
  white-space: nowrap;
  text-overflow: ellipsis;
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

export default MobileRoomEditModal;

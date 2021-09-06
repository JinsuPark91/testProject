import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { useStores } from '../../../stores';
import MobileRoomTypeModal from './MobileRoomTypeModal';
import {
  Header,
  HeaderText,
  IconButton,
  TextButton,
} from '../style/MobileHeaderStyle';
import { EditIcon, AddRoomIcon, CloseIcon } from '../Icon';

const HeaderTitle = styled(HeaderText)`
  line-height: 1.63rem;
  color: #232d3b;
`;
const ButtonBox = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;
const IconButtonBox = styled.div`
  display: flex;
  align-items: center;
  & ~ & {
    margin-left: auto;
  }
`;
const EditTitle = styled.h3`
  font-size: 1.13rem;
  line-height: 1.63rem;
  color: #232d3b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;

const MobileRoomHeader = ({ editMode, handleEditMode }) => {
  const { t } = useTranslation();
  const { userStore, roomStore } = useCoreStores();
  const { uiStore, mobileStore } = useStores();
  const [roomTypeModalVisible, setRoomTypeModalVisible] = useState(false);
  const myUserId = userStore.myProfile.id;

  const handleCreate = useCallback(() => {
    setRoomTypeModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setRoomTypeModalVisible(false);
  }, []);

  const handleCancel = () => {
    handleEditMode(false);
    mobileStore.clearDeleteRoomIdList();
  };

  const handleLeaveRoom = async () => {
    // 일단은 먼저 화면 전환하는게 깔끔해 보임
    uiStore.closeMessage();
    handleEditMode(false);
    const promises = mobileStore.deleteRoomIdList.map(roomId =>
      roomStore.deleteRoomMember({
        userId: myUserId,
        roomId,
      }),
    );
    await Promise.all(promises);
    mobileStore.clearDeleteRoomIdList();
  };

  const handleLeave = () => {
    if (!mobileStore.deleteRoomIdList.length) return;
    uiStore.openMessage({
      title: t('CM_Q_LEAVE_ROOM'),
      type: 'warning',
      buttons: [
        {
          type: 'outlined',
          shape: 'round',
          text: t('CM_CANCEL'),
          onClick: () => uiStore.closeMessage(),
        },
        {
          type: 'solid',
          shape: 'round',
          text: t('CM_LEAVE'),
          onClick: handleLeaveRoom,
        },
      ],
    });
  };

  if (editMode) {
    return (
      <Header>
        <IconButtonBox onClick={handleCancel}>
          <IconButton type="ghost" icon={<CloseIcon />} />
        </IconButtonBox>
        <EditTitle>{t('CM_ROOMLIST_EDIT_01')}</EditTitle>
        <IconButtonBox>
          <TextButton onClick={handleLeave} type="ghost">
            {t('CM_LEAVE')}
          </TextButton>
        </IconButtonBox>
      </Header>
    );
  }

  return (
    <>
      <HeaderTitle>{t('CM_ROOM')}</HeaderTitle>
      <ButtonBox>
        <IconButton
          onClick={() => handleEditMode(true)}
          type="ghost"
          icon={<EditIcon />}
        />
        <IconButton
          onClick={handleCreate}
          type="ghost"
          icon={<AddRoomIcon />}
        />
      </ButtonBox>
      {roomTypeModalVisible && (
        <MobileRoomTypeModal onCancel={handleCloseModal} />
      )}
    </>
  );
};

export default MobileRoomHeader;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoreStores, MobileMessage } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'antd';
import { EditIcon, AddRoomIcon, CloseIcon } from '../Icon';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  padding: 0.06rem 1rem 0.06rem 0.25rem;
  z-index: 100;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
`;

const HeaderTitle = styled.h3`
  font-size: 1.13rem;
  line-height: 1.63rem;
  color: #232d3b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

const IconButton = styled(Button)`
  width: 2.75rem;
  height: 2.75rem;
  background-color: transparent;
`;

const TextButton = styled(Button)`
  min-width: auto;
  height: auto;
  padding: 0;
  & span {
    color: #205855;
  }
  &.ant-btn-ghost {
    padding: 0.5rem 0 0.5rem;
  }
`;

const MobileRoomHeader = ({
  roomEditMode,
  handleRoomEditMode,
  roomIdDeleteList,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { userStore, roomStore } = useCoreStores();
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const myUserId = userStore.myProfile.id;

  const handleCreateRoom = () => history.push(`/addroom`);

  const handleLeaveClick = () => {
    if (!roomIdDeleteList.length) return;
    setIsMessageVisible(true);
  };
  const handleCancel = () => setIsMessageVisible(false);

  const handleLeaveRoom = async () => {
    // TODO: 룸 한번에 나가는 서비스 있는지 확인
    // 일단은 먼저 화면 전환하는게 깔끔해 보임
    handleCancel();
    handleRoomEditMode();
    const promises = roomIdDeleteList.map(roomId =>
      roomStore.deleteRoomMember({
        userId: myUserId,
        roomId,
      }),
    );
    await Promise.all(promises);
  };

  if (roomEditMode) {
    return (
      <>
        <Header>
          <IconButtonBox onClick={handleRoomEditMode}>
            <IconButton type="ghost" icon={<CloseIcon />} />
          </IconButtonBox>
          <EditTitle>{t('CM_ROOMLIST_EDIT_01')}</EditTitle>
          <IconButtonBox>
            <TextButton onClick={handleLeaveClick} type="ghost">
              {t('CM_LEAVE')}
            </TextButton>
          </IconButtonBox>
        </Header>
        {isMessageVisible && (
          <MobileMessage
            visible={isMessageVisible}
            title={t('CM_Q_LEAVE_ROOM')}
            type="warning"
            btns={[
              {
                type: 'outlined',
                shape: 'round',
                text: t('CM_CANCEL'),
                onClick: handleCancel,
              },
              {
                type: 'solid',
                shape: 'round',
                text: t('CM_LEAVE'),
                onClick: handleLeaveRoom,
              },
            ]}
          />
        )}
      </>
    );
  }

  return (
    <>
      <HeaderTitle>{t('CM_ROOM')}</HeaderTitle>
      <ButtonBox>
        <IconButton
          onClick={handleRoomEditMode}
          type="ghost"
          icon={<EditIcon />}
        />
        <IconButton
          onClick={handleCreateRoom}
          type="ghost"
          icon={<AddRoomIcon />}
        />
      </ButtonBox>
    </>
  );
};

export default MobileRoomHeader;

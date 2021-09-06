import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Modal, Button } from 'antd';
import { ArrowBackIcon } from '../Icon';
import { PrivateRoomIcon, OpenChatIcon } from '../../Icons';

const ICON_SIZE = 1.88;

const MobileRoomTypeModal = ({ onCancel }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleCreatePrivateRoom = () => history.push(`/createroom`);

  const handleCreateOpenRoom = () => history.push(`/open`);

  return (
    <Modal
      visible
      mask
      maskTransitionName=""
      closable={false}
      onCancel={onCancel}
      footer={null}
      width="100%"
      style={{
        maxWidth: '100vw',
        position: 'fixed',
        top: 0,
        margin: 0,
        padding: 0,
      }}
    >
      <Header>
        <IconButton type="ghost" icon={<ArrowBackIcon />} onClick={onCancel} />
        <HeaderText>{t('CM_CREATEROOM_1')}</HeaderText>
      </Header>
      <Content>
        <TypeButton type="ghost" onClick={handleCreatePrivateRoom}>
          <PrivateRoomIcon width={ICON_SIZE} height={ICON_SIZE} color="#000" />
          <ButtonText>{t('CM_CREATE_ROOM_OPTION_01')}</ButtonText>
        </TypeButton>
        <TypeButton type="ghost" onClick={handleCreateOpenRoom}>
          <OpenChatIcon width={ICON_SIZE} height={ICON_SIZE} color="#000" />
          <ButtonText>{t('CM_CREATE_ROOM_OPTION_03')}</ButtonText>
        </TypeButton>
      </Content>
    </Modal>
  );
};

export default MobileRoomTypeModal;

const Header = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  margin-bottom: 1rem;
`;

const IconButton = styled(Button)`
  &.ant-btn {
    width: 1.63rem;
    height: 1.63rem;
    background-color: transparent;
  }
`;

const HeaderText = styled.h3`
  font-size: 1.13rem;
  line-height: 1.63rem;
  color: #232d3b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  margin-left: 0.8rem;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const TypeButton = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;

  &.ant-btn {
    width: 4rem;
    height: 4rem;
    background-color: transparent;
  }
`;

const ButtonText = styled.div`
  font-size: 0.75rem;
  color: #000;
  margin-top: 0.5rem;
`;

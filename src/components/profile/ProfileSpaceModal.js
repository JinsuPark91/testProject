import React, { useCallback } from 'react';
import { useCoreStores } from 'teespace-core';
import { Button } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { isSpaceAdmin } from '../../utils/GeneralUtil';

const SpaceInformation = styled.div`
  position: absolute;
  left: -24.125rem;
  bottom: 0;
  width: 22.81rem;
  padding: 1.91rem 1rem 0.625rem;
  border-radius: 0.625rem;
  background: ${props => props.theme.StateNormal};
  text-align: center;
  z-index: 1000;
  &:before {
    content: '';
    position: absolute;
    top: 1.25rem;
    right: -0.875rem;
    display: block;
    border-top: 0.4375rem solid transparent;
    border-left: 0.875rem solid ${props => props.theme.StateNormal};
    border-bottom: 0.4375rem solid transparent;
  }
`;
const Title = styled.strong`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: normal;
  line-height: 1.81rem;
  color: ${props => props.theme.TextMain};
`;

const Description = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  white-space: pre-line;
  line-height: 1.13rem;
  color: ${props => props.theme.TextSub};
`;

const SubDescription = styled(Description)`
  font-size: 0.69rem;
  opacity: 0.7;
`;

const ButtonContainer = styled.div`
  .ant-btn-solid {
    width: 9.25rem;
    &:only-of-type {
      width: 16.06rem;
    }
    & + .ant-btn-solid {
      margin-left: 0.5rem;
    }
  }
  .ant-btn-link {
    margin-top: 0.375rem;
    color: ${props => props.theme.GreenVivid};
    &:active,
    &:hover:active:focus {
      color: ${props => props.theme.GreenVivid};
    }
  }
`;

function ProfileSpaceModal({
  userName,
  onInvite,
  onRoomCreate,
  onAddFriend,
  onClose,
}) {
  const { t } = useTranslation();
  const { userStore, spaceStore, configStore } = useCoreStores();
  const { isGuest } = userStore.myProfile;
  const title = isSpaceAdmin()
    ? t('CM_SPACE_CREATE_COMPLETE_01')
    : t('CM_INVITE_PEOPLE_MAIL_LINK_09');

  const handleAddMember = useCallback(() => {
    onClose();
    onInvite();
  }, [onClose, onInvite]);

  const handleAdminPage = useCallback(() => {
    window.open(`${window.location.origin}/admin`);
  }, []);

  const handleCreateRoom = useCallback(() => {
    onClose();
    onRoomCreate();
  }, [onClose, onRoomCreate]);

  const handleAddFriend = useCallback(() => {
    onClose();
    onAddFriend();
  }, [onClose, onAddFriend]);

  const getButtons = () => {
    if (isGuest) {
      return null;
    }
    if (isSpaceAdmin()) {
      return (
        <>
          <Button type="solid" onClick={handleAddMember}>
            {t('CM_USER_INVITE')}
          </Button>
          <Button
            type="solid"
            className="color-green"
            onClick={handleAdminPage}
          >
            {t('CM_ADMIN_PAGE')}
          </Button>
          <Button type="link" onClick={onClose}>
            {t('CM_SKIP')}
          </Button>
        </>
      );
    }
    return (
      <>
        <Button type="solid" onClick={handleAddFriend}>
          {t('CM_ADD_PHOTO_FRIENDS')}
        </Button>
        <Button type="solid" className="color-green" onClick={handleCreateRoom}>
          {t('CM_CREATE_ROOM')}
        </Button>
        <Button type="link" onClick={onClose}>
          {t('CM_SKIP')}
        </Button>
      </>
    );
  };

  const getDescription = () => {
    if (isSpaceAdmin()) {
      return (
        <Description>
          {t('CM_SPACE_CREATE_COMPLETE_02', {
            name1: userName,
            name2: spaceStore.currentSpace?.name,
          })}
        </Description>
      );
    }
    if (isGuest) {
      return (
        <>
          <Description>
            {t('CM_GUEST_LAYOUT_01', {
              name1: userName,
              name2: spaceStore.currentSpace?.name,
            })}
          </Description>
          <SubDescription>{t('CM_GUEST_LAYOUT_02')}</SubDescription>
        </>
      );
    }
    return (
      <Description>
        {t('CM_INVITE_PEOPLE_MAIL_LINK_10', {
          name1: userName,
          name2: spaceStore.currentSpace?.name,
        })}
      </Description>
    );
  };

  return (
    <SpaceInformation>
      <Title>{title}</Title>
      {getDescription()}
      <ButtonContainer>{getButtons()}</ButtonContainer>
    </SpaceInformation>
  );
}

export default ProfileSpaceModal;

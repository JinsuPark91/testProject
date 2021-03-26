import React, { useCallback } from 'react';
import { useCoreStores } from 'teespace-core';
import { Button } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const SpaceInformation = styled.div`
  position: absolute;
  left: -24.125rem;
  bottom: 0;
  width: 22.81rem;
  padding: 1.91rem 1rem 0.875rem;
  border-radius: 0.625rem;
  background: #fff;
  text-align: center;
  z-index: 1000;
  &:before {
    content: '';
    position: absolute;
    top: 1.25rem;
    right: -0.875rem;
    display: block;
    border-top: 0.4375rem solid transparent;
    border-left: 0.875rem solid #fff;
    border-bottom: 0.4375rem solid transparent;
  }
`;
const Title = styled.strong`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: normal;
  line-height: 1.81rem;
  color: #000;
`;

const Description = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  white-space: pre-line;
  line-height: 1.13rem;
  color: #868686;
`;

const SubDescription = styled(Description)`
  font-size: 0.69rem;
  opacity: 0.7;
`;

const ButtonContainer = styled.div`
  margin-bottom: 0.375rem;
  .ant-btn {
    width: 9.25rem;
    &:only-child {
      width: 16.06rem;
    }
    &:last-child {
      border-color: #205855;
      background-color: #205855;
      &:hover {
        border-color: #698c87;
        background-color: #698c87;
      }
      &:active,
      &:focus {
        border-color: #133d3b;
        background-color: #133d3b;
      }
    }
    & + .ant-btn {
      margin-left: 0.5rem;
    }
  }
`;
const LinkButton = styled(Button)`
  color: #00493d;
`;

function ProfileSpaceModal({
  userName,
  onInvite,
  onRoomCreate,
  onAddFriend,
  onClose,
}) {
  const { t } = useTranslation();
  const { userStore, spaceStore } = useCoreStores();
  const isAdmin = userStore.myProfile.grade === 'admin';
  const { isGuest } = userStore.myProfile;
  const title = isAdmin
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
    if (isAdmin) {
      return (
        <>
          <Button type="solid" onClick={handleAddMember}>
            {t('CM_USER_INVITE')}
          </Button>
          <Button type="solid" onClick={handleAdminPage}>
            {t('CM_ADMIN_PAGE')}
          </Button>
          <LinkButton type="link" onClick={onClose}>
            {t('CM_SKIP')}
          </LinkButton>
        </>
      );
    }
    return (
      <>
        <Button type="solid" onClick={handleAddFriend}>
          {t('CM_ADD_PHOTO_FRIENDS')}
        </Button>
        <Button type="solid" onClick={handleCreateRoom}>
          {t('CM_CREATE_ROOM')}
        </Button>
        <LinkButton type="link" onClick={onClose}>
          {t('CM_SKIP')}
        </LinkButton>
      </>
    );
  };

  const getDescription = () => {
    if (isAdmin) {
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

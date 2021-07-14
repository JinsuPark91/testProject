import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { Button } from 'antd';
import { AddFriendsIcon, EditIcon, CloseIcon } from '../Icon';
import settingicon from '../../../assets/setting_2.svg';

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

const FriendHeader = styled(Header)`
  padding: 0.06rem 0.25rem 0.06rem 1rem;
`;

const HeaderTitle = styled.h3`
  font-size: 1.13rem;
  color: #232d3b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;
const EditTitle = styled.h3`
  font-size: 1.13rem;
  color: #232d3b;
  user-select: none;
`;

const ButtonBox = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonsBox = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;
const IconButton = styled(Button)`
  width: 2.75rem;
  height: 2.75rem;
  background-color: transparent;
`;
const ProfileButton = styled(Button)`
  width: 2.75rem;
  height: 2.75rem;
  background-color: transparent;
  img {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
  }
`;
const ProfileImgBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  &:after {
    content: '';
    display: inline-block;
    background-color: #fff;
    position: absolute;
    border-radius: 50%;
    top: 0.81rem;
    right: -0.13rem;
    width: 0.94rem;
    height: 0.94rem;
    background-image: url(${settingicon});
    background-repeat: no-repeat;
    background-size: 0.81rem 0.81rem;
    background-position: center center;
  }
`;

const MobileFriendHeader = ({ isEditMode, handleEditMode }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;
  const profilePhoto = userStore.getProfilePhotoURL(myUserId, 'small');

  const handleClickMyProfile = () => history.push(`/profile/${myUserId}`);

  const handleAddFriend = () => history.push(`/addfriend`);

  if (isEditMode) {
    return (
      <Header>
        <ButtonBox onClick={handleEditMode}>
          <IconButton type="ghost" icon={<CloseIcon />} />
        </ButtonBox>
        <EditTitle>{t('CM_ROOMLIST_EDIT_01')}</EditTitle>
      </Header>
    );
  }

  return (
    <FriendHeader>
      <HeaderTitle>{t('CM_FRIENDS')}</HeaderTitle>
      <ButtonsBox>
        <IconButton
          onClick={handleAddFriend}
          type="ghost"
          icon={<AddFriendsIcon />}
        />
        <IconButton onClick={handleEditMode} type="ghost" icon={<EditIcon />} />
      </ButtonsBox>
      <ProfileButton
        onClick={handleClickMyProfile}
        type="ghost"
        icon={
          <ProfileImgBox>
            <img alt="myPhoto" src={profilePhoto} />
          </ProfileImgBox>
        }
      />
    </FriendHeader>
  );
};

export default MobileFriendHeader;

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { Button } from 'antd';
import {
  Header,
  FriendHeader,
  HeaderText,
  ButtonBox,
  IconButton,
} from '../style/MobileHeaderStyle';
import { AddFriendsIcon, EditIcon, CloseIcon } from '../Icon';
import settingicon from '../../../assets/setting_2.svg';

const HeaderTitle = styled(HeaderText)`
  color: #232d3b;
  user-select: none;
`;
const EditTitle = styled.h3`
  font-size: 1.13rem;
  color: #232d3b;
  user-select: none;
`;
const ButtonsBox = styled(ButtonBox)`
  margin-left: auto;
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

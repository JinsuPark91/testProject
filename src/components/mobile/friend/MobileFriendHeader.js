import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { Button } from 'antd';
import { AddRoomIcon, AddFriendsIcon, EditIcon, CloseIcon } from '../Icon';

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
  padding: 0.31rem 1rem;
`;

const HeaderTitle = styled.h3`
  font-size: 1.13rem;
  line-height: 1.63rem;
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
  margin-right: 0.5rem;
`;
const IconButton = styled(Button)`
  width: 2.75rem;
  height: 2.75rem;
  background-color: transparent;
`;
const ProfileButton = styled(Button)`
  width: 1.5rem;
  height: 1.5rem;
  background-color: transparent;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const MobileFriendHeader = ({ friendEditMode, handleFriendEditMode }) => {
  const history = useHistory();
  const { userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;
  const profilePhoto = userStore.getProfilePhotoURL(myUserId, 'small');

  const handleClickMyProfile = () => {
    history.push(`/profile/${myUserId}`);
  };

  if (friendEditMode) {
    return (
      <Header>
        <ButtonBox onClick={handleFriendEditMode}>
          <IconButton type="ghost" icon={<CloseIcon />} />
        </ButtonBox>
        <EditTitle>편집</EditTitle>
      </Header>
    );
  }

  return (
    <FriendHeader>
      <HeaderTitle>프렌즈</HeaderTitle>
      <ButtonsBox>
        {/* <IconButton type="ghost" icon={<AddRoomIcon />} /> */}
        <IconButton type="ghost" icon={<AddFriendsIcon />} />
        <IconButton
          onClick={handleFriendEditMode}
          type="ghost"
          icon={<EditIcon />}
        />
      </ButtonsBox>
      <ProfileButton
        onClick={handleClickMyProfile}
        type="ghost"
        icon={<img alt="profilePhoto" src={profilePhoto} />}
      />
    </FriendHeader>
  );
};

export default MobileFriendHeader;

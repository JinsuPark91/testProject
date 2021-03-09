import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { Button } from 'antd';
import { AddRoomIcon, AddFriendsIcon, EditIcon, CloseIcon } from './Icon';
const HeaderTitle = styled.h3`
  font-size: 1.13rem;
  line-height: 1.63rem;
  color: #232d3b;
  width: calc(100% - 5rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;
const EditTitle = styled.h3`
  font-size: 1.13rem;
  color: #232d3b;
  margin-left: 0.75rem;
  user-select: none;
`;

const ButtonBox = styled.div`
  display: flex;
  align-items: center;
`;
const IconButton = styled(Button)`
  width: 1.25rem;
  height: 1.25rem;
  background-color: transparent;
  margin-right: 1rem;
  &:last-of-type {
    margin-right: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
`;

const MobileFriendHeader = observer(
  ({ friendEditMode, handleFriendEditMode }) => {
    const { userStore } = useCoreStores();
    const myUserId = userStore.myProfile.id;
    const profilePhoto = userStore.getProfilePhotoURL(myUserId, 'small');

    if (friendEditMode) {
      return (
        <>
          <ButtonBox onClick={handleFriendEditMode}>
            <IconButton type="ghost" icon={<CloseIcon />} />
          </ButtonBox>
          <EditTitle>편집</EditTitle>
        </>
      );
    }

    return (
      <>
        <HeaderTitle>프렌즈</HeaderTitle>
        <ButtonBox>
          <IconButton type="ghost" icon={<AddRoomIcon />} />
          <IconButton type="ghost" icon={<AddFriendsIcon />} />
          <IconButton
            onClick={handleFriendEditMode}
            type="ghost"
            icon={<EditIcon />}
          />
          <IconButton
            type="ghost"
            icon={<img alt="profilePhoto" src={profilePhoto} />}
          />
        </ButtonBox>
      </>
    );
  },
);

export default MobileFriendHeader;

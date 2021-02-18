import React, { useState, useCallback } from 'react';
import { MobileItemSelector, useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Button } from 'antd';
import { ArrowBackIcon } from './Icon';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  z-index: 100;
  padding: 0.63rem 1rem;
  height: 2.88rem;
`;

const ButtonBox = styled.div`
  margin-right: 0.75rem;
  display: flex;
`;
const IconButton = styled(Button)`
  &.ant-btn {
    width: 1.25rem;
    height: 1.25rem;
    background-color: transparent;
  }
`;

const Title = styled.h3`
  font-size: 1.13rem;
  line-height: 1.63rem;
  color: #205855;
`;

const InviteButton = styled(Button)`
  font-size: 0.88rem;
  line-height: 1.25rem;
  color: #205855;
  margin-left: auto;
  &.ant-btn-text {
    height: auto;
  }
  &.ant-btn-text:hover,
  &.ant-btn-text:focus {
    border-color: transparent;
    color: #205855;
  }
`;

const MobileRoomCreatePage = ({ onCancel }) => {
  const { userStore } = useCoreStores();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const disabledIds = [userStore.myProfile.id];

  const handleCreateRoom = () => {
    console.log(`selected user is${selectedUsers}`);
    onCancel();
  };

  const handleSelectedUserChange = useCallback(({ userArray }) => {
    const filteredUsers = userArray.filter(
      user => !disabledIds.includes(user.friendId || user.id),
    );
    setSelectedUsers(filteredUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header>
        <ButtonBox onClick={onCancel}>
          <IconButton type="ghost" icon={<ArrowBackIcon />} />
        </ButtonBox>
        <Title>프라이빗 룸 만들기</Title>
        <InviteButton type="text">초대 N</InviteButton>
      </Header>
      <MobileItemSelector
        isVisibleRoom={false}
        onSelectChange={handleSelectedUserChange}
        disabledIds={disabledIds}
        defaultSelectedUsers={[userStore.myProfile]}
        showMeOnFriendTab={false}
        height={25} // rem
      />
    </>
  );
};

export default MobileRoomCreatePage;

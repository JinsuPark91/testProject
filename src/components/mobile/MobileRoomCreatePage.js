import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { MobileItemSelector, useCoreStores } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
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
  const history = useHistory();
  const { userStore, roomStore } = useCoreStores();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const myUserId = userStore.myProfile.id;
  const disabledIds = [myUserId];

  const handleCreateRoom = async () => {
    if (selectedUsers.length === 0) return;
    const userList = selectedUsers.map(elem => ({
      userId: elem.friendId || elem.id,
    }));
    const { roomId } = await roomStore.createRoom({
      creatorId: myUserId,
      userList,
      type: 'private',
    });
    const checkRoom = roomStore.getRoomMap().get(roomId);
    console.log(JSON.stringify(checkRoom));
    if (checkRoom && !checkRoom.isVisible) {
      await roomStore.updateRoomMemberSetting({
        roomId,
        myUserId,
        newIsVisible: true,
      });
    }
    await talkRoomStore.initialize(myUserId, roomId);
    history.push(`/talk/${roomId}`);
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
        <InviteButton onClick={handleCreateRoom} type="text">
          초대 {selectedUsers.length || ''}
        </InviteButton>
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

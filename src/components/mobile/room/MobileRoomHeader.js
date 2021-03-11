import React from 'react';
import { useCoreStores } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'antd';
import { EditIcon, AddRoomIcon } from '../Icon';

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

const IconButton = styled(Button)`
  width: 2.75rem;
  height: 2.75rem;
  background-color: transparent;
`;

const MobileRoomHeader = ({
  roomEditMode,
  handleRoomEditMode,
  roomIdDeleteList,
}) => {
  const history = useHistory();
  const { userStore, roomStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  const handleCreateRoom = () => {
    history.push(`/addroom/${myUserId}`);
  };

  const handleDeleteRoom = async () => {
    // TODO: 룸 한번에 나가는 서비스 있는지 확인
    // 일단은 먼저 화면 전환하는게 깔끔해 보임
    if (!roomIdDeleteList.length) return;
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
        <div onClick={handleRoomEditMode}>돌아가기</div>
        <div>편집</div>
        <div onClick={handleDeleteRoom}>나가기</div>
      </>
    );
  }

  return (
    <>
      <HeaderTitle>룸</HeaderTitle>
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

import React, { useState, useCallback } from 'react';
import { Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import MobileRoomHeader from './MobileRoomHeader';
import MobileRoomItem from './MobileRoomItem';
import { Header } from '../style/MobileHeaderStyle';

const RoomList = ({ roomList, editMode }) => {
  return (
    <>
      {roomList.map((roomInfo, index) => (
        <MobileRoomItem
          key={roomInfo?.id}
          index={index}
          roomInfo={roomInfo}
          editMode={editMode}
        />
      ))}
    </>
  );
};

const MobileRoom = () => {
  const { roomStore } = useCoreStores();
  const [editMode, setEditMode] = useState(false);

  const roomFilter = room => room.isVisible;
  const getRoomArray = () => {
    return roomStore.getRoomArray(true).filter(roomFilter);
  };
  const handleEditMode = useCallback(value => {
    setEditMode(value);
  }, []);

  return (
    <>
      <RoomHeader>
        <MobileRoomHeader editMode={editMode} handleEditMode={handleEditMode} />
      </RoomHeader>
      <RoomListBox>
        <Observer>
          {() => <RoomList roomList={getRoomArray()} editMode={editMode} />}
        </Observer>
      </RoomListBox>
    </>
  );
};

export default MobileRoom;

const RoomHeader = styled(Header)`
  padding: 0.06rem 0.25rem 0.06rem 1rem;
`;

const RoomListBox = styled.div`
  overflow-y: auto;
  height: 100%;
`;

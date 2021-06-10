import React, { useEffect, useState } from 'react';
import { Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import MobileRoomHeader from './MobileRoomHeader';
import MobileRoomItem from './MobileRoomItem';

// FIXME: MobileContent.js 스타일 중복 제거 필요
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

const RoomHeader = styled(Header)`
  padding: 0.06rem 0.25rem 0.06rem 1rem;
`;

const RoomListBox = styled.div`
  overflow-y: auto;
  height: 100%;
`;

const RoomList = ({ roomList, isRoomEditMode, handleRoomIdList }) => {
  return (
    <>
      {roomList.map((roomInfo, index) => (
        <MobileRoomItem
          key={roomInfo?.id}
          index={index}
          roomInfo={roomInfo}
          roomEditMode={isRoomEditMode}
          handleRoomIdList={handleRoomIdList}
        />
      ))}
    </>
  );
};

const MobileRoom = () => {
  const { roomStore } = useCoreStores();
  const [roomEditMode, setRoomEditMode] = useState(false);
  const [roomIdDeleteList, setRoomIdDeleteList] = useState([]);

  useEffect(() => {
    setRoomIdDeleteList([]);
  }, [roomEditMode]);

  const roomFilter = room => room.isVisible;
  const getRoomArray = () => {
    return roomStore.getRoomArray(true).filter(roomFilter);
  };

  const handleRoomEditMode = () => setRoomEditMode(!roomEditMode);

  const handleRoomIdList = roomId => {
    const roomIdSet = new Set(roomIdDeleteList);
    if (roomIdSet.has(roomId)) roomIdSet.delete(roomId);
    else roomIdSet.add(roomId);
    setRoomIdDeleteList(Array.from(roomIdSet));
  };

  return (
    <>
      <RoomHeader>
        <MobileRoomHeader
          roomEditMode={roomEditMode}
          handleRoomEditMode={handleRoomEditMode}
          roomIdDeleteList={roomIdDeleteList}
        />
      </RoomHeader>
      <RoomListBox>
        <Observer>
          {() => (
            <RoomList
              roomList={getRoomArray()}
              isRoomEditMode={roomEditMode}
              handleRoomIdList={handleRoomIdList}
            />
          )}
        </Observer>
      </RoomListBox>
    </>
  );
};

export default MobileRoom;

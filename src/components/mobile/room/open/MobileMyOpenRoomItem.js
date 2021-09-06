import React from 'react';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import Photos from '../../../Photos';

const MobileMyOpenRoomItem = ({ roomInfo }) => {
  const history = useHistory();
  const { roomStore } = useCoreStores();

  const handleClick = () => {
    history.push(`/talk/${roomInfo.id}`);
  };

  return (
    <Wrapper>
      <Photos
        srcList={roomStore.getRoomPhoto(roomInfo.id)}
        onClick={handleClick}
        defaultDiameter={2.25}
      />
      <RoomName>{roomInfo.customName || roomInfo.name}</RoomName>
    </Wrapper>
  );
};

export default MobileMyOpenRoomItem;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 2.25rem;
  margin-left: 1.03rem;
`;

const RoomName = styled.span`
  font-size: 0.56rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  margin-top: 0.13rem;
`;

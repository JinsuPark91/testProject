import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div``;

const MobileRoomItem = ({ roomInfo }) => {
  const handleClickRoom = roomInfo => {
    console.log(`room click test${roomInfo}`);
  };

  console.log(`roomInfo is${roomInfo}`);

  return (
    <Wrapper onClick={handleClickRoom}>
      <div>Name</div>
      <div>pm 2:00</div>
      <div>채팅방 내용 미리보기</div>
    </Wrapper>
  );
};

export default MobileRoomItem;

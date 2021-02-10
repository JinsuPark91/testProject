import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div``;

const MobileRoomItem = ({ roomInfo }) => {
  const handleClickRoom = roomInfo => {
    console.log(`room click test${roomInfo}`);
  };

  return (
    <Wrapper onClick={handleClickRoom}>
      <div>Room Content</div>
    </Wrapper>
  );
};

export default MobileRoomItem;
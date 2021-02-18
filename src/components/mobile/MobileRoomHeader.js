import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { AddRoomIcon } from './Icon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  z-index: 100;
  padding: 0.63rem 1rem;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
`;
const HeaderTitle = styled.h3`
  font-size: 1.13rem;
  line-height: 1.63rem;
  color: #232d3b;
`;
const ButtonBox = styled.div`
  margin-left: auto;
  display: flex;
`;
const IconButton = styled(Button)`
  width: 1.25rem;
  height: 1.25rem;
  background-color: transparent;
`;

const MobileRoomHeader = ({ onRoomCreate }) => {
  const handleRoomCreate = () => {
    onRoomCreate();
  };

  return (
    <>
      <Wrapper>
        <HeaderTitle>룸</HeaderTitle>
        <ButtonBox onClick={handleRoomCreate}>
          <IconButton type="ghost" icon={<AddRoomIcon />} />
        </ButtonBox>
      </Wrapper>
    </>
  );
};

export default MobileRoomHeader;

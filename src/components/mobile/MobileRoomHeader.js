import React from 'react';
import { useCoreStores } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'antd';
import { AddRoomIcon } from './Icon';

const HeaderTitle = styled.h3`
  font-size: 1.13rem;
  line-height: 1.63rem;
  color: #232d3b;
  width: calc(100% - 5rem);
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
  width: 1.25rem;
  height: 1.25rem;
  background-color: transparent;
`;

const MobileRoomHeader = () => {
  const history = useHistory();
  const { userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;

  const handleCreateRoom = () => {
    history.push(`/create/${myUserId}`);
  };

  return (
    <>
      <HeaderTitle>룸</HeaderTitle>
      <ButtonBox onClick={handleCreateRoom}>
        <IconButton type="ghost" icon={<AddRoomIcon />} />
      </ButtonBox>
    </>
  );
};

export default MobileRoomHeader;

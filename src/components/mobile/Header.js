import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'antd';
import { useCoreStores } from 'teespace-core';
import PlatformUIStore from '../../stores/PlatformUIStore';
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
`;

const IconButton = styled(Button)`
  width: 1.25rem;
  height: 1.25rem;
  background-color: transparent;
`;

const Header = observer(() => {
  if (PlatformUIStore.resourceType === 'room') {
    return (
      <Wrapper>
        <HeaderTitle>룸</HeaderTitle>
        <ButtonBox>
          <IconButton type="ghost" icon={<AddRoomIcon />} />
        </ButtonBox>
      </Wrapper>
    );
  }

  const history = useHistory();
  const { roomStore, userStore } = useCoreStores();
  const findRoom = () => {
    return roomStore.getRoomMap().get(PlatformUIStore.resourceId);
  };

  const getRoomName = () => {
    const found = findRoom();
    if (found) {
      if (found?.type === 'WKS0001') {
        return userStore.myProfile.nick || userStore.myProfile.name;
      }
      if (found?.customName || found?.name) {
        return found?.customName || found?.name;
      }
    }
    return null;
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <Wrapper>
      <div>{getRoomName()}</div>
    </Wrapper>
  );
});

export default Header;

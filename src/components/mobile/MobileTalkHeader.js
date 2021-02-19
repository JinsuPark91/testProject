import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { Button } from 'antd';
import { ArrowBackIcon } from './Icon';

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
  width: calc(100% - 5rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MobileTalkHeader = () => {
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
    history.push(`/room/${userStore.myProfile.id}`);
  };

  // component 완성 후 수정
  return (
    <Wrapper>
      <ButtonBox onClick={handleGoBack}>
        <IconButton type="ghost" icon={<ArrowBackIcon />} />
      </ButtonBox>
      <Title>{getRoomName()}</Title>
    </Wrapper>
  );
};

export default MobileTalkHeader;

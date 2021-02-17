import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import PlatformUIStore from '../../stores/PlatformUIStore';

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
    history.goBack();
  };

  // component 완성 후 수정
  return (
    <Wrapper>
      <div onClick={handleGoBack}>뒤로가기</div>
      <div>{getRoomName()}</div>
    </Wrapper>
  );
};

export default MobileTalkHeader;

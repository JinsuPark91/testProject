import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';

const Wrapper = styled.div``;

const MobileApp = () => {
  const { userStore, roomStore } = useCoreStores();

  useEffect(() => {
    Promise.all([]);
  }, []);

  const roomFilter = roomInfo => roomInfo.isVisible;

  return <Wrapper />;
};

export default MobileApp;

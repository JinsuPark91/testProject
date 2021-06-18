import React from 'react';
import { useCoreStores } from 'teespace-core';
import Header from './Header';
import Content from './Content';
import { Wrapper } from './MainSideStyle';

const MainSide = () => {
  const { configStore } = useCoreStores();
  const isGroupVisible = !configStore.isFromCNU;

  return (
    <Wrapper isGroupVisible={isGroupVisible}>
      <Header />
      <Content />
    </Wrapper>
  );
};

export default MainSide;

import React from 'react';
import Header from './Header';
import Content from './Content';
import { Wrapper } from './MainSideStyle';

const MainSide = () => {
  return (
    <Wrapper>
      <Header />
      <Content />
    </Wrapper>
  );
};

export default MainSide;

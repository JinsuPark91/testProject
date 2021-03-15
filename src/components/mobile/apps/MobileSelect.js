import React from 'react';
import styled from 'styled-components';
import MobileSelectHeader from './MobileSelectHeader';
import MobileSelectPage from './MobileSelectPage';

// TODO: 추후 MobileTalk.js와 중복 제거
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  padding: 0.06rem 1rem 0.06rem 0.25rem;
  z-index: 100;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
`;

const MobileSelect = () => {
  return (
    <>
      <Header>
        <MobileSelectHeader />
      </Header>
      <MobileSelectPage />
    </>
  );
};

export default MobileSelect;

import React from 'react';
import { Talk } from 'teespace-talk-app';
import styled from 'styled-components';
import MobileTalkHeader from './MobileTalkHeader';

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

const MobileTalk = ({
  roomId,
  channelId,
  isSearchInputVisible,
  onSearchClose,
  isMini,
}) => {
  return (
    <>
      <Header>
        <MobileTalkHeader />
      </Header>
      <Talk
        roomId={roomId}
        channelId={channelId}
        isSearchInputVisible={isSearchInputVisible}
        onSearchClose={onSearchClose}
        isMini={isMini}
      />
    </>
  );
};

export default MobileTalk;

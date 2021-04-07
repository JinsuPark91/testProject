import React from 'react';
import { Talk } from 'teespace-talk-app';
import styled, { createGlobalStyle } from 'styled-components';
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

const MobileTalkStyle = createGlobalStyle`
@media (max-width: 1024px) {
  #mobile-talk {
    width: 100%;
    height: 100%;
    
    .talk-root-wrapper {
      height: calc(100% - 6.01rem);
      top: 2.88rem;
      position: fixed;
    }

    .talk-drag-zone-wrapper {
      position: unset;
    }
  }

}
`;

const MobileTalk = ({
  roomId,
  channelId,
  isSearchInputVisible,
  onSearchClose,
  isMini,
}) => {
  return (
    <div id="mobile-talk">
      <MobileTalkStyle />
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
    </div>
  );
};

export default MobileTalk;

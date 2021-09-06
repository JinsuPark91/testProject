import React from 'react';
import { Talk } from 'teespace-talk-app';
import { createGlobalStyle } from 'styled-components';
import MobileTalkHeader from './MobileTalkHeader';

const MobileTalkStyle = createGlobalStyle`
@media (max-width: 1024px) {
  #mobile-talk {
    width: 100%;
    height: 100%;
    
    .talk-root-wrapper {
      height: calc(100% - 2.88rem);
      top: 2.88rem;
      position: fixed;
    }

    .talk-drag-zone-wrapper {
      position: unset;
    }
  }

}
`;

const MobileTalk = ({ roomId, channelId, language, isMini, option }) => {
  return (
    <div id="mobile-talk">
      <MobileTalkStyle />
      <MobileTalkHeader />
      <Talk
        roomId={roomId}
        channelId={channelId}
        language={language}
        isMini={isMini}
        option={option}
      />
    </div>
  );
};

export default MobileTalk;

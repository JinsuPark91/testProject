import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import MobileRoomHeader from './MobileRoomHeader';
import MobileSelectHeader from './MobileSelectHeader';
import MobileTalkHeader from './MobileTalkHeader';
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

const MobileHeader = observer(() => {
  const { resourceType } = PlatformUIStore;
  switch (resourceType) {
    case 'room':
      return (
        <Wrapper>
          <MobileRoomHeader />
        </Wrapper>
      );
    case 'select':
      return (
        <Wrapper>
          <MobileSelectHeader />
        </Wrapper>
      );
    case 'talk':
      return (
        <Wrapper>
          <MobileTalkHeader />
        </Wrapper>
      );
    default:
      return null;
  }
});

export default MobileHeader;

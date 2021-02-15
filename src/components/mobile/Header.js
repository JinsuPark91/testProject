import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import PlatformUIStore from '../../stores/PlatformUIStore';

const Wrapper = styled.div`
  height: 10%;
`;

const Header = observer(() => {
  if (PlatformUIStore.resourceType === 'room') {
    return <Wrapper>룸</Wrapper>;
  }

  return <Wrapper>Talk</Wrapper>;
});

export default Header;

import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { Button } from 'antd';
import { AddRoomIcon } from './Icon';

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

const HeaderTitle = styled.h3`
  font-size: 1.13rem;
  line-height: 1.63rem;
  color: #232d3b;
`;

const ButtonBox = styled.div`
  margin-left: auto;
`;

const IconButton = styled(Button)`
  width: 1.25rem;
  height: 1.25rem;
  background-color: transparent;
`;

const Header = observer(() => {
  if (PlatformUIStore.resourceType === 'room') {
    return (
      <Wrapper>
        <HeaderTitle>룸</HeaderTitle>
        <ButtonBox>
          <IconButton type="ghost" icon={<AddRoomIcon />} />
        </ButtonBox>
      </Wrapper>
    );
  }

  return <Wrapper>Talk</Wrapper>;
});

export default Header;

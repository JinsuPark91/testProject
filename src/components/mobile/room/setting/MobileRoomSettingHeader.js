import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { ArrowBackIcon } from '../../Icon';

const MobileRoomSettingHeader = ({ title, handleCancel, RightButton }) => {
  return (
    <Header>
      <ButtonBox onClick={handleCancel}>
        <IconButton type="ghost" icon={<ArrowBackIcon />} />
      </ButtonBox>
      <Title>{title}</Title>
      {RightButton && <RightButtonBox>{RightButton}</RightButtonBox>}
    </Header>
  );
};

const Header = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  z-index: 100;
  padding: 0.06rem 1rem 0.06rem 0.25rem;
  height: 2.88rem;
`;
const ButtonBox = styled.div`
  display: flex;
  align-items: center;
`;
const IconButton = styled(Button)`
  &.ant-btn {
    width: 2.75rem;
    height: 2.75rem;
    background-color: transparent;
  }
`;
const Title = styled.h3`
  overflow: hidden;
  font-size: 1.13rem;
  color: ${props => (props.rightButton ? '#232d3b' : '#000')};
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const RightButtonBox = styled.span`
  margin-left: auto;

  .ant-btn-ghost {
    height: auto;
    padding: 0.5rem 0 0.5rem;
    font-size: 0.88rem;
    &[disabled] {
      color: #ccc;
    }
  }
`;

export default MobileRoomSettingHeader;

import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { getRoomName } from '../MobileUtil';
import { ArrowBackIcon } from '../Icon';

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
  font-size: 1.13rem;
  color: #205855;
  width: calc(100% - 5rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MobileTalkHeader = () => {
  const history = useHistory();
  const handleGoBack = () => history.push(`/room`);

  return (
    <>
      <ButtonBox onClick={handleGoBack}>
        <IconButton type="ghost" icon={<ArrowBackIcon />} />
      </ButtonBox>
      <Title>{getRoomName()}</Title>
    </>
  );
};

export default MobileTalkHeader;

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCoreStores, MobileMemberList } from 'teespace-core';
import styled from 'styled-components';
import { Button } from 'antd';
import { ArrowBackIcon } from '../Icon';

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
  font-size: 1.13rem;
  line-height: 1.63rem;
  color: #205855;
`;

const MobileAddFriend = () => {
  const history = useHistory();
  const { userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;
  const handleCancel = () => {
    history.push(`/friend/${myUserId}`);
  };

  return (
    <>
      <Header>
        <ButtonBox onClick={handleCancel}>
          <IconButton type="ghost" icon={<ArrowBackIcon />} />
        </ButtonBox>
        <Title>프렌즈 추가</Title>
      </Header>
      <MobileMemberList height={25} isAddFriend />
    </>
  );
};

export default MobileAddFriend;

import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import { Button } from 'antd';
import styled from 'styled-components';
import PlatformUIStore from '../../stores/PlatformUIStore';

const SpaceInformation = styled.div`
  position: absolute;
  left: -24.125rem;
  bottom: 0.75rem;
  width: 22.81rem;
  padding: 1.875rem 1.563rem 0.875rem;
  border-radius: 0.625rem;
  background: #fff;
  text-align: center;
  z-index: 1000;
  &:before {
    content: '';
    position: absolute;
    top: 1.25rem;
    right: -0.875rem;
    display: block;
    border-top: 0.4375rem solid transparent;
    border-left: 0.875rem solid #fff;
    border-bottom: 0.4375rem solid transparent;
  }
`;
const Title = styled.strong`
  display: block;
  margin-bottom: 0.375rem;
  font-size: 1.25rem;
  font-weight: normal;
  line-height: 1.875rem;
  color: #000000;
`;
const Description = styled.p`
  margin-bottom: 1rem;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: #868686;
`;
const ButtonContainer = styled.div`
  margin-bottom: 0.375rem;
  .ant-btn {
    width: 9.25rem;
    height: 2.5rem;
    font-size: 0.875rem;
    &:only-child {
      width: 16.06rem;
    }
    & + .ant-btn {
      margin-left: 0.625rem;
    }
  }
`;

function ProfileSpaceModal({ userName, onInvite, onAddFriend, onClose }) {
  const { userStore, spaceStore } = useCoreStores();
  const history = useHistory();
  const isAdmin = userStore.myProfile.grade === 'admin';
  const title = isAdmin
    ? '스페이스를 생성했습니다!'
    : '스페이스에 참여했습니다!';

  const handleAddMember = useCallback(() => {
    onClose();
    onInvite();
  }, [onClose, onInvite]);

  const handleAdminPage = useCallback(() => {
    window.open(`${window.location.origin}/admin`);
    // history.push(`/admin`);
  }, []);

  const handleCreateRoom = useCallback(() => {
    onClose();
    console.log('Create Room');
  }, [onClose]);

  const handleAddFriend = useCallback(() => {
    onClose();
    onAddFriend();
  }, [onClose, onAddFriend]);

  return (
    <SpaceInformation>
      <Title>{title}</Title>
      {isAdmin ? (
        <Description>
          이제 {userName}님은 {spaceStore.currentSpace?.name}의 어드민입니다.
          <br />
          스페이스에 구성원을 초대하고, 어드민 페이지에서 관리할 수 있습니다.
        </Description>
      ) : (
        <Description>
          이제 {userName}님은 {spaceStore.currentSpace?.name}의 멤버입니다.
          <br />
          멤버들과 Talk 중심의 다양한 앱을 사용해 보세요.
        </Description>
      )}
      <ButtonContainer>
        {isAdmin ? (
          <>
            <Button type="solid" shape="round" onClick={handleAddMember}>
              구성원 초대
            </Button>
            <Button type="solid" shape="round" onClick={handleAdminPage}>
              어드민 페이지
            </Button>
          </>
        ) : (
          <>
            <Button type="outlined" shape="round" onClick={handleAddFriend}>
              프렌즈 추가
            </Button>
            <Button type="solid" shape="round" onClick={handleCreateRoom}>
              룸 만들기
            </Button>
          </>
        )}
      </ButtonContainer>
      <Button type="link" onClick={onClose}>
        다음에 하기
      </Button>
    </SpaceInformation>
  );
}

export default ProfileSpaceModal;

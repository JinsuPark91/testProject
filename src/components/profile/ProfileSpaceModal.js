import React, { useCallback } from 'react';
import { useCoreStores } from 'teespace-core';
import { Button } from 'antd';
import styled from 'styled-components';

const SpaceInformation = styled.div`
  position: absolute;
  left: -24.125rem;
  bottom: 0;
  width: 22.81rem;
  padding: 1.91rem 1rem 0.875rem;
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
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: normal;
  line-height: 1.81rem;
  color: #000;
`;
const Description = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: #868686;
`;
const ButtonContainer = styled.div`
  margin-bottom: 0.375rem;
  .ant-btn {
    width: 9.25rem;
    &:only-child {
      width: 16.06rem;
    }
    &:last-child {
      border-color: #205855;
      background-color: #205855;
      &:hover {
        border-color: #698c87;
        background-color: #698c87;
      }
      &:active,
      &:focus {
        border-color: #133d3b;
        background-color: #133d3b;
      }
    }
    & + .ant-btn {
      margin-left: 0.5rem;
    }
  }
`;
const LinkButton = styled(Button)`
  color: #00493d;
`;

function ProfileSpaceModal({
  userName,
  onInvite,
  onRoomCreate,
  onAddFriend,
  onClose,
}) {
  const { userStore, spaceStore } = useCoreStores();
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
  }, []);

  const handleCreateRoom = useCallback(() => {
    onClose();
    onRoomCreate();
  }, [onClose, onRoomCreate]);

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
            <Button type="solid" onClick={handleAddMember}>
              구성원 초대
            </Button>
            <Button type="solid" onClick={handleAdminPage}>
              어드민 페이지
            </Button>
          </>
        ) : (
          <>
            <Button type="solid" onClick={handleAddFriend}>
              프렌즈 추가
            </Button>
            <Button type="solid" onClick={handleCreateRoom}>
              룸 만들기
            </Button>
          </>
        )}
      </ButtonContainer>
      <LinkButton type="link" onClick={onClose}>
        다음에 하기
      </LinkButton>
    </SpaceInformation>
  );
}

export default ProfileSpaceModal;

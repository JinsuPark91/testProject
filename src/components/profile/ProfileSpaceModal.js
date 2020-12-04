import React, { useCallback } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { useProfileContext } from './ProfileContextProvider';

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

function ProfileSpaceModal({ oneButton, userName, onInvite }) {
  const useProfile = useProfileContext();
  const title = oneButton
    ? '스페이스를 생성했습니다!'
    : '스페이스에 참여했습니다!';

  const handleCloseSpaceModal = useCallback(() => {
    useProfile.setState({
      ...useProfile.state,
      infoMode: false,
      created: false,
    });
  }, [useProfile]);

  const handleAddMember = useCallback(() => {
    handleCloseSpaceModal();
    console.log('Add Member');
    onInvite();
  }, [handleCloseSpaceModal, onInvite]);

  const handleCreateRoom = useCallback(() => {
    handleCloseSpaceModal();
    console.log('Create Room');
  }, [handleCloseSpaceModal]);

  const handleAddFriend = useCallback(() => {
    handleCloseSpaceModal();
    console.log('Add Friend');
  }, [handleCloseSpaceModal]);

  return (
    <SpaceInformation>
      <Title>{title}</Title>
      <Description>
        이제 {userName}님은 UX팀의 멤버입니다.
        <br />
        멤버들과 Talk 중심으로 다양한 앱을 사용해 보세요.
      </Description>
      <ButtonContainer>
        {oneButton ? (
          <Button type="solid" shape="round" onClick={handleAddMember}>
            구성원 초대
          </Button>
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
      <Button type="link" onClick={handleCloseSpaceModal}>
        다음에 하기
      </Button>
    </SpaceInformation>
  );
}

export default ProfileSpaceModal;

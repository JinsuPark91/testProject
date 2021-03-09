import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 3.25rem;
  padding: 0 1rem;
  cursor: pointer;
`;

const ImgBox = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
  & img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const Name = styled.span`
  font-size: 0.81rem;
  line-height: 1.19rem;
  color: #000000;
  letter-spacing: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none;
  margin-right: 1rem;
`;
const TextBtn = styled(Button)`
  min-width: auto;
  width: auto;
  height: auto;
  font-size: 0.81rem;
  color: #7b7b7b;
  letter-spacing: 0;
  cursor: poniter;
  margin-left: auto;
  &.ant-btn-ghost {
    padding: 0.5rem 0 0.5rem 0.5rem;
  }
`;

const MobileFriendItem = ({ friendInfo, isMe, friendEditMode }) => {
  const history = useHistory();
  const { userStore } = useCoreStores();
  const userId = isMe
    ? userStore.myProfile.id
    : friendInfo.friendId || friendInfo.id;

  const profilePhoto = userStore.getProfilePhotoURL(userId, 'small');
  const fullCompanyJob = friendInfo.getFullCompanyJob({ format: 'friend' });
  const fullCompanyJobTxt = fullCompanyJob ? `(${fullCompanyJob})` : '';

  const handleClickFriend = () => {
    history.push(`/profile/${userId}`);
  };

  const handleDeleteFriend = e => {
    e.stopPropagation();
    // 따로 추가 Modal이 필요한지 확인 필요
    console.log('프렌즈 삭제하기');
  };

  return (
    <Wrapper onClick={handleClickFriend}>
      <ImgBox>
        <img alt="profilePhoto" src={profilePhoto} />
      </ImgBox>
      <>
        <Name>
          {friendInfo?.displayName} {fullCompanyJobTxt}
        </Name>
        {friendEditMode && (
          <TextBtn type="ghost" onClick={handleDeleteFriend}>
            해제
          </TextBtn>
        )}
      </>
    </Wrapper>
  );
};

export default MobileFriendItem;

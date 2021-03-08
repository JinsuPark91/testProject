import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';

const Wrapper = styled.div`
  & img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
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
      <img alt="profilePhoto" src={profilePhoto} />
      <>
        <span>
          {friendInfo?.displayName} {fullCompanyJobTxt}
        </span>
        {friendEditMode && <span onClick={handleDeleteFriend}>해제</span>}
      </>
    </Wrapper>
  );
};

export default MobileFriendItem;

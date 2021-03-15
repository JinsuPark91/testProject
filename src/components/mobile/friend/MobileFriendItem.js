import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { useCoreStores, MobileMessage } from 'teespace-core';
import { handleCheckNewFriend } from '../../../utils/FriendsUtil';

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
  height: auto;
  font-size: 0.81rem;
  color: #7b7b7b;
  letter-spacing: 0;
  cursor: poniter;
  margin-left: auto;
  &.ant-btn-ghost {
    padding: 0.5rem 0 0.5rem;
  }
`;

const NewBadge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.63rem;
  padding: 0.1rem;
  margin-left: auto;
  color: #fff;
  font-weight: 400;
  border-radius: 50%;
  background-color: #dc4547;
`;

const MobileFriendItem = ({ friendInfo, isMe, friendEditMode }) => {
  const history = useHistory();
  const { userStore, friendStore } = useCoreStores();
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const myUserId = userStore.myProfile.id;
  const userId = isMe ? myUserId : friendInfo.friendId || friendInfo.id;

  const profilePhoto = userStore.getProfilePhotoURL(userId, 'small');
  const fullCompanyJob = friendInfo.getFullCompanyJob({ format: 'friend' });
  const fullCompanyJobTxt = fullCompanyJob ? `(${fullCompanyJob})` : '';
  const isNewFriend = handleCheckNewFriend(friendInfo);

  const handleClickFriend = () => {
    if (!friendEditMode) history.push(`/profile/${userId}`);
  };

  const handleClickDelete = e => {
    e.stopPropagation();
    setIsMessageVisible(true);
  };
  const handleCloseMessage = () => {
    setIsMessageVisible(false);
  };

  const handleDeleteFriend = async () => {
    handleCloseMessage();
    await friendStore.deleteFriend({
      myUserId,
      friendId: userId,
    });
  };

  return (
    <>
      <Wrapper onClick={handleClickFriend}>
        <ImgBox>
          <img alt="profilePhoto" src={profilePhoto} />
        </ImgBox>
        <>
          <Name>
            {friendInfo?.displayName} {fullCompanyJobTxt}
          </Name>
          {isNewFriend && !friendEditMode && (
            <NewBadge className="friend-new-icon">N</NewBadge>
          )}
          {!isMe && friendEditMode && (
            <TextBtn type="ghost" onClick={handleClickDelete}>
              삭제
            </TextBtn>
          )}
        </>
      </Wrapper>
      <MobileMessage
        visible={isMessageVisible}
        title={`${friendInfo?.displayName}님을 프렌즈 목록에서 삭제하시겠습니까?`}
        type="warning"
        btns={[
          {
            type: 'outlined',
            shape: 'round',
            text: '취소',
            onClick: handleCloseMessage,
          },
          {
            type: 'solid',
            shape: 'round',
            text: '확인',
            onClick: handleDeleteFriend,
          },
        ]}
      />
    </>
  );
};

export default MobileFriendItem;

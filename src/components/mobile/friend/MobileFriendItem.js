import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { Observer } from 'mobx-react';
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
  min-width: 1rem;
  min-height: 1rem;
  font-size: 0.56rem;
  padding: 0 0.25rem;
  margin-left: auto;
  color: #fff;
  line-height: 1;
  font-weight: 400;
  border-radius: 50%;
  background-color: #dc4547;
`;

const MobileFriendItem = ({ friendInfo, isMe, isEditMode }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { userStore, friendStore } = useCoreStores();
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const myUserId = userStore.myProfile.id;
  const userId = isMe ? myUserId : friendInfo.friendId || friendInfo.id;

  const fullCompanyJob = friendInfo.getFullCompanyJob(1);
  const fullCompanyJobTxt = fullCompanyJob ? `(${fullCompanyJob})` : '';
  const isNewFriend = handleCheckNewFriend(friendInfo);

  const handleClickFriend = () => {
    if (!isEditMode) history.push(`/profile/${userId}`);
  };

  const handleClickDelete = e => {
    e.stopPropagation();
    setIsMessageVisible(true);
  };

  const handleDeleteFriend = async () => {
    setIsMessageVisible(true);
    await friendStore.deleteFriend({
      myUserId,
      friendId: userId,
    });
  };

  return (
    <>
      <Wrapper onClick={handleClickFriend}>
        <Observer>
          {() => {
            return (
              <ImgBox>
                <img
                  alt="profilePhoto"
                  src={userStore.getProfilePhotoURL(userId, 'small')}
                />
              </ImgBox>
            );
          }}
        </Observer>
        <Name>
          {friendInfo?.displayName} {fullCompanyJobTxt}
        </Name>
        {isNewFriend && !isEditMode && (
          <NewBadge className="friend-new-icon">N</NewBadge>
        )}
        {!isMe && isEditMode && (
          <TextBtn type="ghost" onClick={handleClickDelete}>
            {t('CM_DEL')}
          </TextBtn>
        )}
      </Wrapper>
      {isMessageVisible && (
        <MobileMessage
          visible={isMessageVisible}
          title={t('CM_DEL_FRIENDS_01', {
            name: friendInfo?.displayName,
          })}
          type="warning"
          btns={[
            {
              type: 'outlined',
              shape: 'round',
              text: t('CM_CANCEL'),
              onClick: () => setIsMessageVisible(false),
            },
            {
              type: 'solid',
              shape: 'round',
              text: t('CM_LOGIN_POLICY_03'),
              onClick: handleDeleteFriend,
            },
          ]}
        />
      )}
    </>
  );
};

export default MobileFriendItem;

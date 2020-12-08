import React, { useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores, Toast } from 'teespace-core';
import styled from 'styled-components';
import Photos from '../Photos';
import AddFriendImg from '../../assets/ts_friend_add.svg';

const Wrapper = styled.div`
  max-height: 25.81rem;
`;

const FriendItem = styled.li`
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding 0.44rem 0;

    & > img {
      width: 2.5rem;
      height: 2.5rem;
    }
`;

const FriendName = styled.p`
  display: inline-block;
  width: 13.56rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.81rem;
  color: #000000;
  letter-spacing: 0;
  margin-right: auto;
  margin-left: 0.63rem;
`;

const MyAccountText = styled.span`
  font-size: 0.69rem;
  color: #8d8d8d;
`;

const FriendAddBtn = styled.button`
  height: 1rem;
  background-color: transparent;
  border: none;
  cursor: pointer;

  span {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url(${AddFriendImg}) 50% 50% no-repeat;
    background-size: 1rem 1rem;
    cursor: pointer;
    font-size: 0;
    line-height: 0;
    text-indent: -9999px;
    vertical-align: top;
  }
`;

const AddFriendsItem = ({ friendAddList }) => {
  const { authStore, userStore, friendStore } = useCoreStores();
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [friendUserName, setFriendUserName] = useState('');

  const handleAddFriend = useCallback(
    async friendInfo => {
      console.log(`info is${friendInfo}`);
      await friendStore.addFriend({
        myUserId: userStore.myProfile.id,
        friendInfo,
      });
      setFriendUserName(friendInfo?.name);
      setIsToastVisible(true);
    },
    [friendStore, userStore.myProfile.id],
  );

  const renderMenu = friendInfo => {
    const userId = friendInfo?.id;
    const isMe = userId === userStore.myProfile.id;
    const isFriend = friendStore.checkAlreadyFriend({ userId });
    if (isMe) {
      return <MyAccountText>내 계정</MyAccountText>;
    }

    if (!isFriend) {
      return (
        <FriendAddBtn onClick={() => handleAddFriend(friendInfo)}>
          <span>프렌즈 추가</span>
        </FriendAddBtn>
      );
    }
    return null;
  };

  // <Photos srcList={['a1']} defaultDiameter="2.13" />
  const FriendAddItem = ({ friendInfo }) => {
    const userName = friendInfo?.name;
    return (
      <>
        <FriendItem>
          <img
            alt="profile"
            src={`${userStore.getUserProfilePhoto({
              userId: friendInfo?.id,
              size: 'small',
              isLocal: true,
              thumbPhoto: null,
            })}`}
          />
          <FriendName>{userName}</FriendName>
          {renderMenu(friendInfo)}
        </FriendItem>
      </>
    );
  };

  // TODO: id로 key 교체
  return useObserver(() => (
    <>
      <Wrapper>
        {friendStore.friendInfoList.length &&
          friendAddList.map((elem, index) => (
            <FriendAddItem key={index} friendInfo={elem} />
          ))}
      </Wrapper>
      <Toast
        visible={isToastVisible}
        timeoutMs={1000}
        onClose={() => setIsToastVisible(false)}
      >
        {friendUserName}님이 프렌즈로 추가되었습니다.
      </Toast>
    </>
  ));
};

export default AddFriendsItem;

import React from 'react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import Photos from '../Photos';
import AddFriendImg from '../../assets/ts_friend_add.svg';

const FriendItem = styled.li`
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding 0.44rem 0;
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
  const { userStore } = useCoreStores();

  const handleAddFriend = userId => {
    console.log(friendAddList);
    console.log('Add Friend Test');
  };

  const FriendAddItem = ({ name, userId }) => {
    const isMe = userId === userStore.myProfile.id;
    return (
      <>
        <FriendItem>
          <Photos srcList={['a1']} defaultDiameter="2.13" />
          <FriendName>{name}</FriendName>
          {isMe ? (
            <MyAccountText>내 계정</MyAccountText>
          ) : (
            <FriendAddBtn onClick={handleAddFriend(userId)}>
              <span>프렌즈 추가</span>
            </FriendAddBtn>
          )}
        </FriendItem>
      </>
    );
  };

  // TODO: id로 key 교체
  return (
    <>
      {friendAddList.map((elem, index) => (
        <FriendAddItem key={index} name={elem?.name} userId={elem?.id} />
      ))}
    </>
  );
};

export default AddFriendsItem;

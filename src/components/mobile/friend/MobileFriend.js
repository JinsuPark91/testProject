import React, { useState } from 'react';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { Divider } from 'antd';
import { useCoreStores } from 'teespace-core';
import MobileFriendHeader from './MobileFriendHeader';
import MobileFriendItem from './MobileFriendItem';

const FriendListHeader = styled.div`
  line-height: 0;
  margin: 0 1rem 0.5rem;
`;

const FriendTitle = styled.p`
  display: inline-block;
  font-size: 0.69rem;
  line-height: 1.06rem;
  color: #48423b;
  letter-spacing: 0;
  margin-right: 0.25rem;
  user-select: none;
`;

const Num = styled.span`
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: rgba(19, 19, 19, 0.5);
  letter-spacing: 0;
  user-select: none;
`;

const ListDivider = styled(Divider)`
  background-color: #f1f2f4;
  margin: 0.5rem 0.63rem;
  width: auto;
  min-width: auto;
`;

const FriendListBox = styled.div`
  overflow-y: auto;
  height: 100%;
`;
const MyInfoBox = styled.div`
  margin-top: 0.5rem;
`;
const MyInfoItem = styled(MobileFriendItem)`
  padding: 0 1rem;
`;

const FriendList = ({ myInfo, friendList, isFriendEditMode }) => {
  const friendNum = friendList.length;
  const noFriend = friendNum === 0;

  return (
    <>
      <MyInfoBox>
        <MyInfoItem
          key={myInfo?.id}
          friendInfo={myInfo}
          isMe
          friendEditMode={isFriendEditMode}
        />
      </MyInfoBox>
      <ListDivider />
      {noFriend ? (
        <div>프렌즈가 없습니다.</div>
      ) : (
        <>
          <FriendListHeader>
            <FriendTitle>프렌즈</FriendTitle>
            <Num>{friendNum}</Num>
          </FriendListHeader>
          <div>
            {friendList.map(friendInfo => (
              <MobileFriendItem
                key={friendInfo?.friendId || friendInfo?.id}
                friendInfo={friendInfo}
                isMe={false}
                friendEditMode={isFriendEditMode}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

const MobileFriend = () => {
  const { userStore, friendStore } = useCoreStores();
  const [friendEditMode, setFriendEditMode] = useState(false);

  const handleFriendEditMode = () => {
    setFriendEditMode(!friendEditMode);
  };

  return (
    <>
      <MobileFriendHeader
        friendEditMode={friendEditMode}
        handleFriendEditMode={handleFriendEditMode}
      />
      <FriendListBox>
        <Observer>
          {() => (
            <FriendList
              myInfo={userStore.myProfile}
              friendList={friendStore.friendInfoList}
              isFriendEditMode={friendEditMode}
            />
          )}
        </Observer>
      </FriendListBox>
    </>
  );
};

export default MobileFriend;

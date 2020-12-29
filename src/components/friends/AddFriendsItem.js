import React, { useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores, Toast } from 'teespace-core';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';
import Photos from '../Photos';
import AddFriendImg from '../../assets/ts_friend_add.svg';

const SpaceInfo = styled.div`
  margin-bottom: 0.24rem;
`;

const SpaceName = styled.span`
  font-size: 0.75rem;
  color: #000000;
  max-width: 80%;
`;

const UserCount = styled.span`
  font-size: 0.75rem;
  color: #6c56e5;
  margin-left: 0.25rem;
`;

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
      border-radius: 50%;
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
  margin-right: 1rem;
`;

const FriendAddBtn = styled.button`
  height: 1rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-right: 1rem;

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

const MyBadge = styled.span`
  position: absolute;
  top: 0;
  min-width: 1.06rem;
  min-height: 0.94rem;
  padding: 0.06rem 0.25rem;
  background-color: #523dc7;
  border-radius: 0.28rem;
  font-size: 0.56rem;
  font-weight: 600;
  line-height: 0.81rem;
  color: #fff;
  z-index: 100;
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -0.15rem;
    border-left: 0.15rem solid transparent;
    border-right: 0.15rem solid transparent;
    border-top: 0.2rem solid #523dc7;
  }
`;

const AddFriendsItem = ({ friendAddList, isViewMode }) => {
  const { userStore, friendStore, spaceStore } = useCoreStores();
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [friendUserName, setFriendUserName] = useState('');

  let memberList = friendAddList;
  if (memberList && memberList.length) {
    memberList = memberList.sort((a, b) =>
      a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1,
    );
    memberList = [
      ...memberList.filter(elem => elem.id === userStore.myProfile.id),
      ...memberList.filter(elem => elem.id !== userStore.myProfile.id),
    ];
  }

  const handleAddFriend = useCallback(
    async friendInfo => {
      await friendStore.addFriend({
        myUserId: userStore.myProfile.id,
        friendInfo,
      });
      setFriendUserName(friendInfo?.displayName);
      setIsToastVisible(true);
    },
    [friendStore, userStore.myProfile.id],
  );

  const renderMenu = friendInfo => {
    const userId = friendInfo?.friendId || friendInfo?.id;
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

  const FriendAddItem = ({ friendInfo, style }) => {
    const userName = friendInfo?.displayName;
    const isMe =
      friendInfo?.friendId || friendInfo.id === userStore.myProfile.id;
    return (
      <>
        <FriendItem style={style}>
          {isMe && <MyBadge> 나 </MyBadge>}
          <img
            alt="profile"
            src={userStore.getProfilePhotoURL(
              friendInfo?.friendId || friendInfo?.id,
              'small',
            )}
          />
          <FriendName>{userName}</FriendName>
          {!isViewMode && renderMenu(friendInfo)}
        </FriendItem>
      </>
    );
  };

  // TODO: id로 key 교체
  return useObserver(() => (
    <>
      {isViewMode && (
        <SpaceInfo>
          <SpaceName>{spaceStore.currentSpace?.name}</SpaceName>
          <UserCount>{spaceStore.currentSpace?.userCount}명</UserCount>
        </SpaceInfo>
      )}
      <Wrapper>
        {friendStore.friendInfoList && (
          <List
            height={400}
            itemCount={memberList.length}
            itemSize={70}
            width="100%"
          >
            {({ index, style }) => {
              return (
                <FriendAddItem
                  key={index}
                  friendInfo={memberList[index]}
                  style={style}
                />
              );
            }}
          </List>
        )}
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

export default React.memo(AddFriendsItem);

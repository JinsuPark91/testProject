import React, { useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores, Toast, ProfileInfoModal } from 'teespace-core';
import { FixedSizeList as List } from 'react-window';
import styled, { css } from 'styled-components';
import mySign from '../../assets/wapl_me.svg';
import AddFriendImg from '../../assets/add_friends.svg';

const Wrapper = styled.div`
  padding-bottom: 0.63rem;
`;

const FriendItem = styled.div`
  display: flex;
  padding: 0.63rem 0.63rem 0.63rem 0.69rem;
  justify-content: space-between;
  align-items: center;
`;

const ImageBox = styled.div`
  position: relative;
  width: 1.75rem;
  height: 1.75rem;

  &:after {
    content: '';
    position: absolute;
    inset: 0px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
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
  margin-left: 0.38rem;
`;

const MyAccountText = styled.span`
  font-size: 0.69rem;
  color: #8d8d8d;
`;

const FriendAddBtn = styled.button`
  height: 1rem;
  background-color: transparent;
  border: none;

  span {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url(${AddFriendImg}) 50% 50% no-repeat;
    background-size: 1rem 1rem;
    font-size: 0;
    line-height: 0;
    text-indent: -9999px;
    vertical-align: top;
  }

  ${props =>
    props.isFriend
      ? css`
  cursor: auto !important;
  span {
    cursor: auto;
    filter: opacity(0.2) drop-shadow(0 0 0 #818181);
  `
      : css`
          cursor: pointer;
          span {
            cursor: pointer;
          }
        `}}
`;

const MyBadge = styled.span`
  position: absolute;
  top: 0.38rem;
  left: 0.38rem;
  width: 0.88rem;
  height: 0.88rem;
  line-height: 0;
  z-index: 5;
  img {
    width: 100%;
    height: 100%;
  }
`;

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const AddFriendsItem = ({ friendAddList, isViewMode }) => {
  const { userStore, friendStore } = useCoreStores();
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [friendUserName, setFriendUserName] = useState('');

  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [profileId, setProfileId] = useState('');

  let memberList = friendAddList.slice();
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
        <FriendAddBtn
          isFriend={false}
          onClick={() => handleAddFriend(friendInfo)}
        >
          <span>프렌즈 추가</span>
        </FriendAddBtn>
      );
    }

    return (
      <FriendAddBtn isFriend>
        <span>프렌즈 추가</span>
      </FriendAddBtn>
    );
  };

  const handleOpenProfile = userId => {
    // profile core 작업 후 추가
    // setProfileId(userId);
    // setIsProfileModalVisible(true);
  };

  const FriendAddItem = React.memo(({ friendInfo, style }) => {
    const userName = friendInfo?.displayName;
    const fullCompanyJob = friendInfo.getFullCompanyJob({ format: 'friend' });
    const fullCompanyJobText = fullCompanyJob ? `(${fullCompanyJob})` : '';
    const isMe =
      friendInfo?.friendId || friendInfo.id === userStore.myProfile.id;
    return (
      <FriendItem style={style}>
        {isMe && (
          <MyBadge>
            <img src={mySign} alt="me" />
          </MyBadge>
        )}
        <ImageBox
          onClick={() =>
            handleOpenProfile(friendInfo?.friendId || friendInfo?.id)
          }
        >
          <img
            alt="profile"
            src={userStore.getProfilePhotoURL(
              friendInfo?.friendId || friendInfo?.id,
              'small',
            )}
          />
        </ImageBox>
        <FriendName>
          {userName} {fullCompanyJobText}
        </FriendName>
        {!isViewMode && renderMenu(friendInfo)}
      </FriendItem>
    );
  });

  return useObserver(() => (
    <>
      <Wrapper>
        {friendStore.friendInfoList && (
          <List
            height={remToPixel(21)}
            itemCount={memberList.length}
            itemSize={remToPixel(3)}
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
      {isProfileModalVisible && (
        <ProfileInfoModal
          userId={profileId}
          visible={isProfileModalVisible}
          onClose={() => setIsProfileModalVisible(false)}
          position={{ left: '17rem' }}
        />
      )}
    </>
  ));
};

export default React.memo(AddFriendsItem);

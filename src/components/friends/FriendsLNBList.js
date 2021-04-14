import React, { useState } from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import FriendItem from './FriendItem';
import {
  WelcomeWrapper,
  ContentWrapper,
  StyledInfoTitle,
  StyledSubInfo,
  FriendListBox,
  StyleTitle,
  StyleText,
} from '../../styles/friends/FriendsLNBContentStyle';
import PlatformUIStore from '../../stores/PlatformUIStore';

/**
 * @param {string} searchKeyword - 프렌즈 검색 키워드
 * @param {function} handleShadow - scroll 최하단일때 호출
 */

const FriendsLNBList = ({
  searchKeyword,
  handleShadow,
  handleInfoModalVisible,
  handleSelectedId,
  handleToastVisible,
  handleToastText,
}) => {
  const { t } = useTranslation();
  const { userStore, friendStore } = useCoreStores();
  const [favFriendActiveId, setFavFriendActiveId] = useState('');
  const [friendActiveId, setFriendActiveId] = useState('');

  const handleScroll = () => {
    const friendContainer = document.getElementById('lnb__friend-container');
    if (
      Math.abs(
        friendContainer.scrollTop +
          friendContainer.clientHeight -
          friendContainer.scrollHeight,
      ) <= 1
    )
      handleShadow(false);
    else handleShadow(true);
  };

  const handleFavFriendActive = friendId => {
    setFavFriendActiveId(friendId);
    setFriendActiveId('');
  };
  const handleFriendActive = friendId => {
    setFavFriendActiveId('');
    setFriendActiveId(friendId);
  };

  const filteredFriendList = friendStore.friendInfoList.filter(friendInfo =>
    friendInfo.displayName.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const FriendList = ({ friendList, onClick, activeFriendId }) => {
    return (
      <>
        {friendList.map(friendInfo => (
          <FriendItem
            friendInfo={friendInfo}
            key={friendInfo.friendId}
            mode="friend"
            onClick={onClick}
            isActive={
              PlatformUIStore.resourceType === 'f' &&
              activeFriendId === friendInfo.friendId
            }
            handleOpenToast={() => handleToastVisible(true)}
            handleToastText={input => handleToastText(input)}
            handleSelectedId={targetId => handleSelectedId(targetId)}
            handleInfoModalVisible={() => handleInfoModalVisible(true)}
          />
        ))}
      </>
    );
  };

  return useObserver(() => {
    const renderEmptyContent = (
      <WelcomeWrapper>
        <StyledInfoTitle>
          {t('CM_B2C_LNB_EMPTY_PAGE_07', {
            name: userStore.myProfile.displayName,
          })}
        </StyledInfoTitle>
        <StyledSubInfo>{t('CM_B2C_LNB_EMPTY_PAGE_08')}</StyledSubInfo>
      </WelcomeWrapper>
    );

    const renderContent = (
      <>
        {!!friendStore.favoriteFriendInfoList.length && (
          <FriendListBox style={{ display: searchKeyword ? 'none' : 'block' }}>
            <StyleTitle>{t('CM_BOOKMARK')}</StyleTitle>
            <FriendList
              friendList={friendStore.favoriteFriendInfoList}
              onClick={handleFavFriendActive}
              activeFriendId={favFriendActiveId}
            />
          </FriendListBox>
        )}
        <FriendListBox>
          <StyleTitle>
            {t('CM_FRIENDS')}
            <StyleText>{filteredFriendList.length}</StyleText>
          </StyleTitle>
          <FriendList
            friendList={filteredFriendList}
            onClick={handleFriendActive}
            activeFriendId={friendActiveId}
          />
        </FriendListBox>
      </>
    );

    return (
      <>
        <ContentWrapper id="lnb__friend-container" onScroll={handleScroll}>
          <FriendListBox noFriend={!friendStore.friendInfoList.length}>
            <FriendItem
              mode="me"
              friendInfo={userStore.myProfile}
              onClick={handleFriendActive}
              isActive={
                PlatformUIStore.resourceType === 'f' &&
                friendActiveId === userStore.myProfile.id
              }
              handleSelectedId={targetId => handleSelectedId(targetId)}
              handleInfoModalVisible={() => handleInfoModalVisible(true)}
            />
          </FriendListBox>
          {!friendStore.friendInfoList.length && renderEmptyContent}
          {!!friendStore.friendInfoList.length && renderContent}
        </ContentWrapper>
      </>
    );
  });
};

export default React.memo(FriendsLNBList);

import React from 'react';
import { useObserver, useLocalStore } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../stores';
import FriendItem from './FriendItem';
import FriendsMemberItem from './FriendsMemberItem';
import {
  WelcomeWrapper,
  ContentWrapper,
  StyledInfoTitle,
  StyledSubInfo,
  FriendListBox,
  StyleTitle,
  StyleText,
} from '../../styles/friends/FriendsLNBContentStyle';

/**
 * @param {string} searchKeyword - 프렌즈 검색 키워드
 * @param {function} handleShadow - scroll 최하단일때 호출
 */

const NoFriendView = React.memo(({ name }) => {
  const { t } = useTranslation();
  return (
    <WelcomeWrapper>
      <StyledInfoTitle>
        {t('CM_B2C_LNB_EMPTY_PAGE_07', {
          name,
        })}
      </StyledInfoTitle>
      <StyledSubInfo>{t('CM_B2C_LNB_EMPTY_PAGE_08')}</StyledSubInfo>
    </WelcomeWrapper>
  );
});

const FriendsLNBList = ({
  searchKeyword,
  handleShadow,
  handleOpenInfoModal,
}) => {
  const { t } = useTranslation();
  const { uiStore } = useStores();
  const { userStore, friendStore } = useCoreStores();

  const store = useLocalStore(() => ({
    friendActiveId: uiStore.resourceId,
    favFriendActiveId: '',
  }));

  const handleScroll = () => {
    const friendContainer = document.getElementById('lnb__friend-container');
    if (
      friendContainer &&
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
    store.favFriendActiveId = friendId;
    store.friendActiveId = '';
  };
  const handleFriendActive = friendId => {
    store.favFriendActiveId = '';
    store.friendActiveId = friendId;
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
              uiStore.resourceType === 'f' &&
              activeFriendId === friendInfo.friendId
            }
            handleOpenInfoModal={handleOpenInfoModal}
          />
        ))}
      </>
    );
  };

  return useObserver(() => {
    const renderContent = (
      <>
        {!!friendStore.favoriteFriendInfoList.length && (
          <FriendListBox style={{ display: searchKeyword ? 'none' : 'block' }}>
            <StyleTitle>{t('CM_BOOKMARK')}</StyleTitle>
            <FriendList
              friendList={friendStore.favoriteFriendInfoList}
              onClick={handleFavFriendActive}
              activeFriendId={store.favFriendActiveId}
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
            activeFriendId={store.friendActiveId}
          />
        </FriendListBox>
      </>
    );

    return (
      <ContentWrapper id="lnb__friend-container" onScroll={handleScroll}>
        <FriendListBox>
          <FriendItem
            mode="me"
            friendInfo={userStore.myProfile}
            onClick={handleFriendActive}
            isActive={
              uiStore.resourceType === 'f' &&
              store.friendActiveId === userStore.myProfile.id
            }
            handleOpenInfoModal={handleOpenInfoModal}
          />
        </FriendListBox>
        <FriendsMemberItem />
        {!friendStore.friendInfoList.length && (
          <NoFriendView name={userStore.myProfile.displayName} />
        )}
        {!!friendStore.friendInfoList.length && renderContent}
      </ContentWrapper>
    );
  });
};

export default React.memo(FriendsLNBList);

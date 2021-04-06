import React, { useState } from 'react';
import { useObserver } from 'mobx-react';
import { ProfileInfoModal, useCoreStores, Toast } from 'teespace-core';
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
 */

const FriendsLNBContent = ({ searchKeyword }) => {
  const { t } = useTranslation();
  const { userStore, friendStore } = useCoreStores();
  const [favFriendActiveId, setFavFriendActiveId] = useState('');
  const [friendActiveId, setFriendActiveId] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [yPosition, setyPosition] = useState(0);

  const handleOpenToast = () => {
    setIsToastVisible(true);
  };
  const handleSetText = text => {
    setToastText(text);
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
            openToast={handleOpenToast}
            setToastText={handleSetText}
            setSelectedId={targetId => setSelectedId(targetId)}
            toggleInfoModal={() => setInfoModalVisible(!infoModalVisible)}
            setyPosition={yCoord => setyPosition(yCoord)}
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
        <Toast
          visible={isToastVisible}
          timeoutMs={1000}
          onClose={() => setIsToastVisible(false)}
        >
          {toastText}
        </Toast>
      </>
    );

    return (
      <>
        <ContentWrapper id="lnb__friend-container">
          <FriendListBox noFriend={!friendStore.friendInfoList.length}>
            <FriendItem
              mode="me"
              friendInfo={userStore.myProfile}
              onClick={handleFriendActive}
              isActive={
                PlatformUIStore.resourceType === 'f' &&
                friendActiveId === userStore.myProfile.id
              }
              setSelectedId={targetId => setSelectedId(targetId)}
              toggleInfoModal={() => setInfoModalVisible(!infoModalVisible)}
              setyPosition={yCoord => setyPosition(yCoord)}
            />
          </FriendListBox>
          {!friendStore.friendInfoList.length && renderEmptyContent}
          {!!friendStore.friendInfoList.length && renderContent}
        </ContentWrapper>
        {infoModalVisible && (
          <ProfileInfoModal
            userId={selectedId}
            visible={infoModalVisible}
            onClickMeeting={_roomId => {
              PlatformUIStore.openWindow({
                id: _roomId,
                type: 'meeting',
                name: null,
                userCount: null,
                handler: null,
              });
            }}
            onClose={() => setInfoModalVisible(false)}
            position={{ left: '16.81rem' }}
          />
        )}
      </>
    );
  });
};

export default FriendsLNBContent;

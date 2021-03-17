import React, { useEffect, useState } from 'react';
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
} from '../../styles/friend/FriendsLNBContentStyle';
import PlatformUIStore from '../../stores/PlatformUIStore';

/**
 * Friends LNB Content
 * @param {Object} props
 * @param {string} props.searchKeyword - 프렌즈 탭의 친구 리스트 검색 키워드
 * @param {function} props.meTooltipPopupContainer - 프렌즈 아이템의 나일때 표시하는 tooltip
 */

const FriendsLNBContent = React.forwardRef(
  ({ searchKeyword, meTooltipPopupContainer, activeUserId }, ref) => {
    const { userStore, friendStore } = useCoreStores();
    const [favFriendActiveId, setFavFriendActiveId] = useState('');
    const [friendActiveId, setFriendActiveId] = useState('');
    const [selectedId, setSelectedId] = useState('');

    const [isToastVisible, setIsToastVisible] = useState(false);
    const [toastText, setToastText] = useState('');
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [yPosition, setyPosition] = useState(0);

    useEffect(() => {
      setFriendActiveId(activeUserId);
    }, [activeUserId]);

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
      friendInfo.displayName
        .toLowerCase()
        .includes(searchKeyword.toLowerCase()),
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
            {userStore.myProfile.displayName} 님, 환영합니다. <br />
            프렌즈 목록을 만들어보세요!
          </StyledInfoTitle>
          <StyledSubInfo>
            자주 연락하는 사람들을
            <br />
            구성원 목록에서 추가할 수 있습니다.
          </StyledSubInfo>
        </WelcomeWrapper>
      );

      const renderContent = (
        <>
          {!!friendStore.favoriteFriendInfoList.length && (
            <FriendListBox
              style={{ display: searchKeyword ? 'none' : 'block' }}
            >
              <StyleTitle>즐겨찾기</StyleTitle>
              <FriendList
                friendList={friendStore.favoriteFriendInfoList}
                onClick={handleFavFriendActive}
                activeFriendId={favFriendActiveId}
              />
            </FriendListBox>
          )}
          <FriendListBox>
            <StyleTitle>
              프렌즈
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
        <ContentWrapper id="lnb__friend-container">
          <div ref={ref} />
          <FriendListBox noFriend={!friendStore.friendInfoList.length}>
            <FriendItem
              mode="me"
              tooltipPopupContainer={meTooltipPopupContainer}
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
        </ContentWrapper>
      );
    });
  },
);

export default FriendsLNBContent;

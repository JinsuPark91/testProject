import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Typography } from 'antd';
import { ProfileInfoModal, useCoreStores, Toast } from 'teespace-core';
import FriendItem from './FriendItem';
import FriendAdd from '../../assets/friend_add.svg';

const { Text } = Typography;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  padding-top: 0.3125rem;
`;

const WelcomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  justify-content: flex-end;
  text-align: center;
`;

const WelcomeBackgroundImage = styled.div`
  width: 12.5rem;
  height: 12.5rem;
  margin: 0 auto;
  background: url('${FriendAdd}') center 0 no-repeat;
  background-size: contain;
`;

const FriendListBox = styled.div`
  &:after {
    content: '';
    display: block;
    height: 1px;
    margin: 0.25rem 0.625rem;
    background-color: #e3e7eb;
  }

  &:last-of-type {
    &:after {
      display: ${props => (props.noFriend ? '' : 'none')};
    }
  }
`;

const StyleTitle = styled.p`
  margin: 0.5rem 0.625rem 0.25rem;
  font-size: 0.75rem;
  line-height: 1.13rem;
  font-weight: 500;
  color: #000;
`;

const StyleText = styled(Text)`
  margin-left: 0.25rem;
  font-size: 0.81rem;
  color: #7f7f7f;
`;

const StyledInfoTitle = styled.p`
  margin-bottom: 0.94rem;
  font-size: 0.94rem;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.38rem;
`;

const StyledSubInfo = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  color: #414141;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.06rem;
`;

const FriendList = ({
  friendList,
  onClick,
  activeFriendId,
  openToast,
  setToastText,
  setSelectedId,
  toggleInfoModal,
  setxPosition,
  setyPosition,
}) => (
  <>
    {friendList.map(friendInfo => (
      <FriendItem
        friendInfo={friendInfo}
        key={friendInfo.friendId}
        mode="friend"
        onClick={onClick}
        isActive={activeFriendId === friendInfo.friendId}
        openToast={openToast}
        setToastText={setToastText}
        setSelectedId={setSelectedId}
        toggleInfoModal={toggleInfoModal}
        setxPosition={setxPosition}
        setyPosition={setyPosition}
      />
    ))}
  </>
);

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

    const [xPosition, setxPosition] = useState(0);
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

    const filteredFriendList = friendStore.friendInfoList.filter(friendInfo =>
      friendInfo.displayName
        .toLowerCase()
        .includes(searchKeyword.toLowerCase()),
    );

    const handleFavFriendActive = useCallback(friendId => {
      setFavFriendActiveId(friendId);
      setFriendActiveId('');
    }, []);

    const handleFriendActive = useCallback(friendId => {
      setFavFriendActiveId('');
      setFriendActiveId(friendId);
    }, []);

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
      // <WelcomeBackgroundImage />

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
                openToast={handleOpenToast}
                setToastText={handleSetText}
                setSelectedId={targetId => setSelectedId(targetId)}
                toggleInfoModal={() => setInfoModalVisible(!infoModalVisible)}
                setxPosition={xCoord => setxPosition(xCoord)}
                setyPosition={yCoord => setyPosition(yCoord)}
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
              openToast={handleOpenToast}
              setToastText={handleSetText}
              setSelectedId={targetId => setSelectedId(targetId)}
              toggleInfoModal={() => setInfoModalVisible(!infoModalVisible)}
              setxPosition={xCoord => setxPosition(xCoord)}
              setyPosition={yCoord => setyPosition(yCoord)}
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
        <ContentWrapper>
          <div ref={ref} />
          <FriendListBox noFriend={!friendStore.friendInfoList.length}>
            <FriendItem
              mode="me"
              tooltipPopupContainer={meTooltipPopupContainer}
              friendInfo={userStore.myProfile}
              onClick={handleFriendActive}
              isActive={friendActiveId === userStore.myProfile.id}
              setSelectedId={targetId => setSelectedId(targetId)}
              toggleInfoModal={() => setInfoModalVisible(!infoModalVisible)}
              setxPosition={xCoord => setxPosition(xCoord)}
              setyPosition={yCoord => setyPosition(yCoord)}
            />
          </FriendListBox>
          {!friendStore.friendInfoList.length && renderEmptyContent}
          {!!friendStore.friendInfoList.length && renderContent}
          {infoModalVisible && (
            <ProfileInfoModal
              userId={selectedId}
              visible={infoModalVisible}
              onClose={() => setInfoModalVisible(false)}
              position={{ left: '17rem' }}
            />
          )}
        </ContentWrapper>
      );
    });
  },
);

export default FriendsLNBContent;

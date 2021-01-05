import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Typography } from 'antd';
import { useCoreStores, Toast } from 'teespace-core';
import FriendItem from './FriendItem';
import FriendAdd from '../../assets/friend_add.svg';

const { Text } = Typography;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  padding-top: 0.25rem;
`;

const WelcomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  justify-content: flex-end;
  flex-grow: 1;
  text-align: center;
`;

const WelcomeBackgroundImage = styled.div`
  width: 12.5rem;
  height: 12.5rem;
  margin: 0 auto;
  background: url('${FriendAdd}') center 0 no-repeat;
  background-size: contain;
`;

const MyFrinedListBox = styled.div`
  &:after {
    content: '';
    display: block;
    height: 1px;
    margin: 0.25rem 0.625rem;
    background-color: #e3e7eb;
  }
`;

const FrinedListBox = styled.div`
  &:after {
    content: '';
    display: block;
    height: 1px;
    margin: 0.25rem 0.625rem;
    background-color: #e3e7eb;
  }
  &:last-of-type {
    &:after {
      display: none;
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
`;

const StyledInfoTitle = styled.p`
  margin-bottom: 0.94rem;
  font-size: 0.94rem;
  color: #523dc7;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.38rem;
`;

const StyledSubInfo = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  color: #6c56e5;
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
    const [friendActiveId, setFriendActiveId] = useState(null);
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [toastText, setToastText] = useState('');

    const openToast = () => {
      setIsToastVisible(true);
    };

    const setText = text => {
      setToastText(text);
    };

    const filteredFriendList = friendStore.friendInfoList.filter(friendInfo =>
      friendInfo.displayName.includes(searchKeyword),
    );

    useEffect(() => {
      setFriendActiveId(activeUserId);
    }, [activeUserId]);

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
        <>
          <FrinedListBox>
            <FriendItem
              mode="me"
              tooltipPopupContainer={meTooltipPopupContainer}
              friendInfo={userStore.myProfile}
              onClick={handleFriendActive}
              isActive={friendActiveId === userStore.myProfile.id}
            />
          </FrinedListBox>
          <WelcomeWrapper>
            <StyledInfoTitle>
              {userStore.myProfile.displayName} 님, 환영합니다. <br />
              프렌즈 목록을 만들어보세요!
            </StyledInfoTitle>
            <StyledSubInfo>
              자주 연락하는 사람들을
              <br />
              구성원 목록에서 추가할 수 있습니다
            </StyledSubInfo>
            <WelcomeBackgroundImage />
          </WelcomeWrapper>
        </>
      );

      const renderContent = (
        <>
          <MyFrinedListBox>
            <Toast
              visible={isToastVisible}
              timeoutMs={1000}
              onClose={() => setIsToastVisible(false)}
            >
              {toastText}
            </Toast>
            <FriendItem
              mode="me"
              tooltipPopupContainer={meTooltipPopupContainer}
              friendInfo={userStore.myProfile}
              onClick={handleFriendActive}
              isActive={friendActiveId === userStore.myProfile.id}
              openToast={openToast}
              setToastText={setToastText}
            />
          </MyFrinedListBox>
          {friendStore.favoriteFriendInfoList.length ? (
            <FrinedListBox
              style={{ display: searchKeyword ? 'none' : 'block' }}
            >
              <StyleTitle>즐겨찾기</StyleTitle>
              <FriendList
                friendList={friendStore.favoriteFriendInfoList}
                onClick={handleFavFriendActive}
                activeFriendId={favFriendActiveId}
                openToast={openToast}
                setToastText={setText}
              />
            </FrinedListBox>
          ) : null}
          <FrinedListBox style={{ display: searchKeyword ? 'block' : 'none' }}>
            <StyleTitle>
              프렌즈
              <StyleText>{filteredFriendList.length}</StyleText>
            </StyleTitle>
            <FriendList
              friendList={filteredFriendList}
              onClick={handleFriendActive}
              activeFriendId={friendActiveId}
              openToast={openToast}
              setToastText={setText}
            />
          </FrinedListBox>
          <FrinedListBox style={{ display: searchKeyword ? 'none' : 'block' }}>
            <StyleTitle>
              프렌즈
              <StyleText>{friendStore.friendInfoList.length}</StyleText>
            </StyleTitle>
            <FriendList
              friendList={friendStore.friendInfoList}
              onClick={handleFriendActive}
              activeFriendId={friendActiveId}
              openToast={openToast}
              setToastText={setText}
            />
          </FrinedListBox>
        </>
      );

      return (
        <ContentWrapper>
          <div ref={ref} />
          {!friendStore.friendInfoList.length && renderEmptyContent}
          {!!friendStore.friendInfoList.length && renderContent}
        </ContentWrapper>
      );
    });
  },
);

export default FriendsLNBContent;

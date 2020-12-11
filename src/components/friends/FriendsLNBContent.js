import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Layout, Typography } from 'antd';
import { useCoreStores, Toast } from 'teespace-core';
import FriendItem from './FriendItem';

const { Paragraph, Text } = Typography;
const { Content } = Layout;

const ContentWrapper = styled(Content)`
  position: relative;
  flex-grow: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
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
  background-image: url('/B2B/friend_add.svg');
  background-position: center bottom;
  background-repeat: no-repeat;
  padding-top: 96.1%;
`;

const MyFrinedListBox = styled.div`
  &:after {
    content: '';
    display: block;
    margin: 0.375rem 0.625rem 0.375rem;
    border-bottom: 1px solid #e3e7eb;
  }
  & > div {
    padding: 0.63rem 0.63rem 0.44rem;
  }
`;

const FrinedListBox = styled.div`
  &:after {
    content: '';
    display: block;
    margin: 0.375rem 0.625rem 0.375rem;
    border-bottom: 1px solid #e3e7eb;
  }
  &:last-of-type {
    &:after {
      display: none;
    }
  }
`;

const StyleTitle = styled.p`
  margin: 0 0.625rem 0.375rem;
  color: #000;
  font-weight: 500;
  line-height: 1.13rem;
  font-size: 0.75rem;
`;

const StyleText = styled(Text)`
  margin-left: 0.25rem;
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
            <StyleTitle level={4}>
              {userStore.myProfile.displayName} 님, 환영합니다. <br />
              프렌즈 추가 버튼을 눌러 <br />내 동료를 찾아보세요!
            </StyleTitle>
            <Paragraph>
              프렌즈가 되고 싶은 동료를 검색하거나 <br />
              조직도에서 간편하게 추가할 수 있습니다.
            </Paragraph>
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

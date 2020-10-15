import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Layout, Divider, Typography } from 'antd';
import { useCoreStores } from 'teespace-core';
import FriendItem from './FriendItem';

const { Paragraph, Text, Title } = Typography;
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

const FriendList = React.memo(({ friendList, onClick, activeFriendId }) => (
  <>
    {friendList.map(friendInfo => (
      <FriendItem
        friendInfo={friendInfo}
        key={friendInfo.friendId}
        mode="friend"
        isActive={activeFriendId === friendInfo.friendId}
        onClick={() => onClick(friendInfo.friendId)}
      />
    ))}
  </>
));

/**
 * Friends LNB Content
 * @param {Object} props
 * @param {string} props.searchKeyword - 프렌즈 탭의 친구 리스트 검색 키워드
 * @param {function} props.meTooltipPopupContainer - 프렌즈 아이템의 나일때 표시하는 tooltip
 */
const FriendsLNBContent = React.forwardRef(
  ({ searchKeyword, meTooltipPopupContainer }, ref) => {
    const { authStore, friendStore } = useCoreStores();

    const [favFriendActiveId, setFavFriendActiveId] = useState('');
    const [friendActiveId, setFriendActiveId] = useState('');

    console.log(friendStore.friendInfoList);

    const favFriendList = friendStore.friendInfoList.filter(
      friendInfo => friendInfo.friendFavorite,
    );

    const filteredFriendList = friendStore.friendInfoList.filter(
      friendInfo =>
        (friendInfo.friendNick || '').includes(searchKeyword) ||
        (friendInfo.userNick || '').includes(searchKeyword) ||
        (friendInfo.userName || '').includes(searchKeyword),
    );

    const handleFavFriendActive = friendId => {
      setFavFriendActiveId(friendId);
      setFriendActiveId('');
    };

    const handleFriendActive = friendId => {
      setFavFriendActiveId('');
      setFriendActiveId(friendId);
    };

    useEffect(() => {
      friendStore.getFriendInfoList({ userId: authStore.user.id });
    }, [friendStore, authStore]);

    const renderEmptyContent = (
      <>
        <FriendItem
          mode="me"
          tooltipPopupContainer={meTooltipPopupContainer}
          friendInfo={{
            userName: authStore.user.name,
            friendNIck: authStore.user.nick,
            thumbPhoto: authStore.user.thumbPhoto,
            friendId: authStore.user.id,
          }}
          onClick={() => handleFriendActive(authStore.user.id)}
          isActive={friendActiveId}
        />
        <Divider style={{ margin: '6px 0' }} />
        <WelcomeWrapper>
          <Title level={4}>
            {authStore.user.name} 님, 환영합니다. <br />
            프렌즈 추가 버튼을 눌러 <br />내 동료를 찾아보세요!
          </Title>
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
        <FriendItem
          mode="me"
          tooltipPopupContainer={meTooltipPopupContainer}
          friendInfo={{
            userName: authStore.user.name,
            friendNIck: authStore.user.nick,
            thumbPhoto: authStore.user.thumbPhoto,
            friendId: authStore.user.id,
          }}
          onClick={() => handleFriendActive(authStore.user.id)}
          isActive={friendActiveId}
        />
        <Divider />
        {!searchKeyword && (
          <>
            <Title level={5}>즐겨찾기</Title>
            <FriendList
              friendList={favFriendList}
              onClick={handleFavFriendActive}
              activeFriendId={favFriendActiveId}
            />
            <Divider />
            <Title level={5}>
              프렌즈
              <Text>{friendStore.friendInfoList.length}</Text>
            </Title>
            <FriendList
              friendList={friendStore.friendInfoList}
              onClick={handleFriendActive}
              activeFriendId={friendActiveId}
            />
          </>
        )}
        {searchKeyword && (
          <>
            <Title level={5}>
              프렌즈
              <Text>{filteredFriendList.length}</Text>
            </Title>
            <FriendList
              friendList={filteredFriendList}
              onClick={handleFriendActive}
              activeFriendId={friendActiveId}
            />
          </>
        )}
      </>
    );

    return useObserver(() => (
      <ContentWrapper>
        <div ref={ref} />
        {!friendStore.friendInfoList.length && renderEmptyContent}
        {!!friendStore.friendInfoList.length && renderContent}
      </ContentWrapper>
    ));
  },
);

export default FriendsLNBContent;

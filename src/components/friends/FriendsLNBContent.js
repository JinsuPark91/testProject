import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Layout, Image, Divider, Typography } from 'antd';
import { useCoreStores } from 'teespace-core';
import FriendItem from './FriendItem';

const { Paragraph, Text, Title } = Typography;
const { Content } = Layout;

const ContentWrapper = styled(Content)`
  flexgrow: 1;
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

const FriendList = React.memo(({ friendList }) => (
  <>
    {friendList.map(friendInfo => (
      <FriendItem
        friendInfo={friendInfo}
        key={friendInfo.friendId}
        mode="friend"
      />
    ))}
  </>
));

/**
 * Friends LNB Content
 * @param {Object} props
 * @param {string} props.searchKeyword - 프렌즈 탭의 친구 리스트 검색 키워드
 */
function FriendsLNBContent({ searchKeyword }) {
  const { authStore, friendStore } = useCoreStores();

  const favFriendList = friendStore.friendInfoList.filter(
    friendInfo => friendInfo.friendFavorite,
  );

  const filteredFriendList = friendStore.friendInfoList.filter(
    friendInfo =>
      (friendInfo.userName || '').includes(searchKeyword) ||
      (friendInfo.friendNick || '').includes(searchKeyword),
  );

  useEffect(() => {
    friendStore.getFriendInfoList({ userId: authStore.user.id });
  }, [friendStore, authStore]);

  const renderEmptyContent = (
    <>
      <FriendItem
        mode="me"
        friendInfo={{
          userName: authStore.user.name,
          friendNIck: authStore.user.nick,
          friendFav: null,
        }}
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
        friendInfo={{
          userName: authStore.user.name,
          friendNIck: authStore.user.nick,
          friendFav: null,
        }}
      />
      <Divider />
      {!searchKeyword && (
        <>
          <Title level={5}>즐겨찾기</Title>
          <FriendList friendList={favFriendList} />
          <Divider />
          <Title level={5}>
            프렌즈
            <Text>{friendStore.friendInfoList.length}</Text>
          </Title>
          <FriendList friendList={friendStore.friendInfoList} />
        </>
      )}
      {searchKeyword && (
        <>
          <Title level={5}>
            프렌즈
            <Text>{filteredFriendList.length}</Text>
          </Title>
          <FriendList friendList={filteredFriendList} />
        </>
      )}
    </>
  );

  return useObserver(() => (
    <ContentWrapper>
      {!friendStore.friendInfoList.length && renderEmptyContent}
      {!!friendStore.friendInfoList.length && renderContent}
    </ContentWrapper>
  ));
}

export default FriendsLNBContent;

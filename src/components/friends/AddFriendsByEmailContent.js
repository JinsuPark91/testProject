import React, { useCallback, useEffect, useState } from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores, Button, Toast } from 'teespace-core';
import styled from 'styled-components';
import { Typography, Avatar, Row, Col, Space } from 'antd';

const { Paragraph, Title } = Typography;

const StyledAvatar = styled(Avatar)`
    width: calc(5.63rem - 0.38rem);
    height: calc(5.63rem - 0.38rem);
    border-radius: 50%;
    top: 0;
    border: 0.19rem solid rgba(255,255,255,0.50);
    box-shadow: 0 0 5px 2px rgba(0,0,0,0.20);
}
`;

function AddFriendsByEmailContent({ userLoginId, searchedUser }) {
  const { friendStore, authStore } = useCoreStores();
  const [visibleToast, setVisibleToast] = useState(false);
  const [alreadyFriendFlag, setAlreadyFriendFlag] = useState(false);

  const handleAddFriend = useCallback(() => {
    setAlreadyFriendFlag(true);
    friendStore.addFriend({
      myUserId: authStore.user.id,
      friendInfo: searchedUser,
    });
    setVisibleToast(true);
  }, [authStore.user.id, friendStore, searchedUser]);

  useEffect(() => {
    const friendFlag =
      searchedUser &&
      friendStore.checkAlreadyFriend({ userId: searchedUser.id });
    setAlreadyFriendFlag(friendFlag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendStore.friendInfoList, searchedUser]);

  const profileSrc = (user => {
    if (!searchedUser) {
      return null;
    }
    return `/${user.profilePhoto || user.defaultPhotoUrl}`;
  })(searchedUser);

  return useObserver(() => (
    <Row align="middle" style={{ flexGrow: 1 }} justify="center">
      <Toast
        visible={visibleToast}
        timeoutMs={1000}
        onClose={() => setVisibleToast(false)}
      >
        {searchedUser && `${searchedUser.name}님이 친구로 추가되었습니다.`}
      </Toast>
      <Col>
        <Space direction="vertical" align="center">
          {userLoginId && !searchedUser && (
            <>
              <Title level={4}>{`'${userLoginId}'`}</Title>
              <Paragraph>검색 결과가 없습니다.</Paragraph>
            </>
          )}
          {userLoginId &&
            searchedUser &&
            searchedUser.id === authStore.user.id && (
              <>
                <StyledAvatar src={profileSrc} />
                <Title level={4}>{searchedUser.displayName}</Title>
                <Title level={4}>(내계정)</Title>
                <Button type="solid">나와의 Talk</Button>
              </>
            )}
          {userLoginId &&
            searchedUser &&
            searchedUser.id !== authStore.user.id &&
            alreadyFriendFlag && (
              <>
                <StyledAvatar src={profileSrc} />
                <Title level={4}>{searchedUser.displayName}</Title>
                <Title level={4}>(이미 프렌즈)</Title>
                <Button type="solid">1:1 Talk</Button>
              </>
            )}
          {userLoginId &&
            searchedUser &&
            searchedUser.id !== authStore.user.id &&
            !alreadyFriendFlag && (
              <>
                <StyledAvatar src={profileSrc} />
                <Title level={4}>{searchedUser.name}</Title>
                <Button type="solid" onClick={handleAddFriend}>
                  프렌즈 추가
                </Button>
              </>
            )}
          {!userLoginId && (
            <>
              <Title level={4}>아이디로 프렌즈를 추가하세요.</Title>
              <Paragraph style={{ textAlign: 'center' }}>
                상대의 TeeSpace 아이디를 아는 경우
                <br />
                프렌즈로 추가할 수 있습니다.
              </Paragraph>
            </>
          )}
        </Space>
      </Col>
    </Row>
  ));
}

export default AddFriendsByEmailContent;

import React, { useEffect, useState } from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { Button, Typography, Avatar, Row, Col, Space } from 'antd';
import CommonButton from '../commons/Button';
import CommonToast from '../commons/Toast';

const { Paragraph, Title, Text } = Typography;

function AddFriendsByEmailContent({ userLoginId }) {
  const { friendStore, userStore, authStore } = useCoreStores();
  const [visibleToast, setVisibleToast] = useState(false);
  const [alreadyFriendFlag, setAlreadyFriendFlag] = useState(false);

  const handleAddFriend = () => {
    setAlreadyFriendFlag(true);
    friendStore.addFriendInfo(
      authStore.user.id,
      userStore.usersSearched[userLoginId].id,
    );
    setVisibleToast(true);
  };

  useEffect(() => {
    const friendFlag =
      userStore.usersSearched[userLoginId] &&
      friendStore.friendInfoList
        .map(friendInfo => friendInfo.friendId)
        .includes(userStore.usersSearched[userLoginId].id);
    setAlreadyFriendFlag(friendFlag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendStore.friendInfoList, userStore.usersSearched[userLoginId]]);
  return useObserver(() => (
    <Row align="middle" style={{ flexGrow: 1 }} justify="center">
      <CommonToast
        visible={visibleToast}
        timeoutMs={1000}
        onClose={() => setVisibleToast(false)}
      >
        {userStore.usersSearched[userLoginId] &&
          `${userStore.usersSearched[userLoginId].name}님이 친구로 추가되었습니다.`}
      </CommonToast>
      <Col>
        <Space direction="vertical" align="center">
          {userLoginId && !userStore.usersSearched[userLoginId] && (
            <>
              <Title level={4}>{`'${userLoginId}'`}</Title>
              <Paragraph>검색 결과가 없습니다.</Paragraph>
            </>
          )}
          {userLoginId &&
            userStore.usersSearched[userLoginId] &&
            userStore.usersSearched[userLoginId].id === authStore.user.id && (
              <>
                <Avatar size={100} />
                <Title level={4}>이준규 (AC1-2팀-팀원)</Title>
                <Title level={4}>(내계정)</Title>
                <CommonButton type="solid">나와의 Talk</CommonButton>
              </>
            )}
          {userLoginId &&
            userStore.usersSearched[userLoginId] &&
            userStore.usersSearched[userLoginId].id !== authStore.user.id &&
            alreadyFriendFlag && (
              <>
                <Avatar size={100} />
                <Title level={4}>
                  {userStore.usersSearched[userLoginId].name}
                </Title>
                <Title level={4}>(이미 프렌즈)</Title>
                <CommonButton type="solid">1:1 Talk</CommonButton>
              </>
            )}
          {userLoginId &&
            userStore.usersSearched[userLoginId] &&
            userStore.usersSearched[userLoginId].id !== authStore.user.id &&
            !alreadyFriendFlag && (
              <>
                <Avatar size={100} />
                <Title level={4}>
                  {userStore.usersSearched[userLoginId].name}
                </Title>
                <CommonButton type="solid" onClick={handleAddFriend}>
                  프렌즈 추가
                </CommonButton>
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

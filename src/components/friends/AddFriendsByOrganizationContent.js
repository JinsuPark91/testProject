import React from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { Row, Col, Typography } from 'antd';
import FriendItem from './FriendItem';

const { Text } = Typography;

function AddFriendsByOrganizationContent() {
  const { orgStore } = useCoreStores();
  return useObserver(() => (
    <Row align="middle" style={{ flexGrow: 1 }} justify="center">
      <Col span={24}>
        {orgStore.orgUserList.map(item => (
          <FriendItem
            friendInfo={{ userName: item.loginId, friendId: item.id }}
            key={item.id}
            mode="addFriend"
          />
        ))}
        {false && <Text type="secondary">조직원이 없습니다.</Text>}
      </Col>
    </Row>
  ));
}

export default AddFriendsByOrganizationContent;

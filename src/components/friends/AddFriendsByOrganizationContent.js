import React from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { Row, Col, Typography } from 'antd';
import FriendItem from './FriendItem';

const { Text } = Typography;

const Wrapper = styled.div`
  margin: 0 0.75rem 4px 0.75rem;
`;

function AddFriendsByOrganizationContent() {
  const { orgStore } = useCoreStores();
  return useObserver(() => (
    <Wrapper>
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
    </Wrapper>
  ));
}

export default AddFriendsByOrganizationContent;

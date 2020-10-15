import React from 'react';
import styled from 'styled-components';
import { Row, Col, Typography } from 'antd';
import FriendItem from './FriendItem';

const { Text } = Typography;

const Wrapper = styled.div`
  margin: 0 0.75rem 4px 0.75rem;
`;

const Centered = styled(Col)`
  text-align: center;
`;

function AddFriendsByOrganizationContent({ orgUserList }) {
  return (
    <Wrapper>
      <Row align="middle" style={{ flexGrow: 1 }} justify="center">
        <Col span={24}>
          {orgUserList.map(item => (
            <FriendItem
              friendInfo={{ userName: item.name, friendId: item.id }}
              key={item.id}
              mode="addFriend"
            />
          ))}
        </Col>
        <Centered>
          {orgUserList.length === 0 && (
            <Text type="secondary">조직원이 없습니다.</Text>
          )}
        </Centered>
      </Row>
    </Wrapper>
  );
}

export default AddFriendsByOrganizationContent;

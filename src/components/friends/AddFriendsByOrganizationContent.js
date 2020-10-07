import React from 'react';
import { Row, Col, Typography } from 'antd';
import FriendItem from './FriendItem';

const { Text } = Typography;

const dummy = [
  {
    id: 1,
    userName: '이준규',
    team: 'AC1-2팀',
    position: '팀원',
  },
  {
    id: 2,
    userName: '이준규',
    team: 'AC1-2팀',
    position: '팀원',
  },
  {
    id: 3,
    userName: '이준규',
    team: 'AC1-2팀',
    position: '팀원',
  },
  {
    id: 4,
    userName: '이준규',
    team: 'AC1-2팀',
    position: '팀원',
  },
  {
    id: 5,
    userName: '이준규',
    team: 'AC1-2팀',
    position: '팀원',
  },
  {
    id: 6,
    userName: '이준규',
    team: 'AC1-2팀',
    position: '팀원',
  },
  {
    id: 7,
    userName: '이준규',
    team: 'AC1-2팀',
    position: '팀원',
  },
  {
    id: 8,
    userName: '이준규',
    team: 'AC1-2팀',
    position: '팀원',
  },
];
function AddFriendsByOrganizationContent() {
  return (
    <Row align="middle" style={{ flexGrow: 1 }} justify="center">
      <Col span={24}>
        {true &&
          dummy.map(item => (
            <FriendItem friendInfo={item} key={item.id} mode="addFriend" />
          ))}
        {false && <Text type="secondary">조직원이 없습니다.</Text>}
      </Col>
    </Row>
  );
}

export default AddFriendsByOrganizationContent;

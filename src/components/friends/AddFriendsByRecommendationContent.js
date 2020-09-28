import React from 'react';
import { Row, Col, Typography, Switch } from 'antd';
import FriendItem from './FriendItem';

const { Title, Text } = Typography;
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
function AddFriendsByRecommendationContent() {
  return (
    <>
      <Row>
        <Col span={12}>
          <Title level={4}>추천 프렌즈 허용</Title>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Switch />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text type="secondary">
            내가 알 수도 있는 프렌즈를 추천받고 다른 프렌즈에 나를 추천해줍니다.
          </Text>
        </Col>
      </Row>
      <Row
        align="middle"
        style={{ flexGrow: 1, overflow: 'auto' }}
        justify="center"
      >
        <Col span={24}>
          {false &&
            dummy.map(item => (
              <FriendItem friendInfo={item} key={item.id} mode="recommended" />
            ))}
          {true && (
            <Title level={4} style={{ textAlign: 'center' }}>추천 프렌즈가 없습니다.</Title>
          )}
        </Col>
      </Row>
    </>
  );
}
export default AddFriendsByRecommendationContent;

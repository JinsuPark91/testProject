import React from 'react';
import { Button, Typography, Avatar, Row, Col, Space } from 'antd';

const { Paragraph, Title, Text } = Typography;

function AddFriendsByEmailContent() {
  return (
    <Row align="middle" style={{ flexGrow: 1 }} justify="center">
      <Col>
        <Space direction="vertical" align="center">
          {false && (
            <>
              <Title level={4}>'이준규'</Title>
              <Paragraph>
                검색 결과가 없습니다.
              </Paragraph>
            </>
          )}
          {false && (
            <>
              <Avatar size={100} />
              <Title level={4}>이준규 (AC1-2팀-팀원)</Title>
              <Title level={4}>(내계정)</Title>
              <Button>나와의 Talk</Button>
            </>
          )}
          {false && (
            <>
              <Avatar size={100} />
              <Title level={4}>이준규 (AC1-2팀-팀원)</Title>
              <Button>프렌즈 추가</Button>
            </>
          )}
          {true && (
            <>
              <Title level={4}>아이디로 프렌즈를 추가하세요.</Title>
              <Paragraph style={{ textAlign: 'center' }}>
                상대의 TeeSpace 아이디를 아는 경우
                <br />
                프렌즈로 추가할 수 있습니다.
              </Paragraph>
            </>
          )
          }
        </Space>
      </Col>
    </Row>
  );
}

export default AddFriendsByEmailContent;

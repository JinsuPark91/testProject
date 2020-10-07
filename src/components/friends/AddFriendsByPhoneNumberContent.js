import React from 'react';
import { useObserver } from 'mobx-react';
import { Button, Typography, Avatar, Row, Col, Space } from 'antd';
import { useStore } from '../../stores';

const { Paragraph, Title } = Typography;

function AddFriendsByPhoneNumberContent() {
  const { uiStore } = useStore();
  return useObserver(() => (
    <Row align="middle" style={{ flexGrow: 1 }} justify="center">
      <Col>
        <Space direction="vertical" align="center">
          {false && (
            <>
              <Avatar size={100} />
              <Title level={4}>이준규 (AC1-2팀-팀원)</Title>
              <Title level={4}>(내계정)</Title>
              <Button>나와의 Talk</Button>
            </>
          )}
          {true && (
            <>
              <Title level={4}>연락처로 프렌즈를 추가하세요.</Title>
              <Paragraph style={{ textAlign: 'center' }}>
                상대가 TeeSpace 회원이고, 연락처 검색 허용을 <br />한 경우
                프렌즈로 추가할 수 있습니다.
              </Paragraph>
              <Button
                shape="round"
                disabled={uiStore.addFriendByPhoneNumberButtonDisabled}
              >
                프렌즈 추가
              </Button>
            </>
          )}
        </Space>
      </Col>
    </Row>
  ));
}

export default AddFriendsByPhoneNumberContent;

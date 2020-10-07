import React, { useState } from 'react';
import { Tag, Row, Col, Typography, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CommonButton from '../commons/Button';
import CommonInput from '../commons/Input';
import CommonToast from '../commons/Toast';

const { Paragraph, Title, Text } = Typography;

const dummy = [
  {
    friendNick: '김수한',
    userName: 'soohan_kim',
  },
  {
    friendNick: '안소희',
    userName: 'sohee_ahn',
  },
];
function AddFriendsByInvitationLinkCopy() {
  const [visibleInvitedFriends, setVisibleInvitedFriends] = useState(false);
  const [visibleToast, setVisibleToast] = useState(false);

  const handleToggle = () => setVisibleInvitedFriends(!visibleInvitedFriends);
  return (
    <>
      <Title level={4}>초대 링크 복사하기</Title>
      <Paragraph>
        아래 초대 링크를 복사 후 공유하세요.
        <br />
        링크를 통해 가입한 멤버는 프렌즈로 추가됩니다.
      </Paragraph>
      <Row>
        <Col span={24} style={{ display: 'flex' }}>
          <CommonInput
            readOnly
            value="https://naver.com"
            style={{ width: '100%' }}
          />
          <CommonToast
            visible={visibleToast}
            onClose={() => setVisibleToast(false)}
          >
            초대 링크가 복사되었습니다.
          </CommonToast>
          <CopyToClipboard
            text="https://naver.com"
            onCopy={() => setVisibleToast(true)}
            style={{ width: 120 }}
          >
            <CommonButton type="solid">초대 링크 복사</CommonButton>
          </CopyToClipboard>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text>나의 초대 링크로 가입한 프렌즈 수 </Text>
          <Text>1</Text>
          <Button type="link" onClick={handleToggle}>
            {!visibleInvitedFriends && <DownOutlined />}
            {visibleInvitedFriends && <UpOutlined />}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {visibleInvitedFriends && (
            <>
              {dummy.map(item => (
                <div>
                  {item.friendNick} {item.userName}
                </div>
              ))}
            </>
          )}
        </Col>
      </Row>
    </>
  );
}

export default AddFriendsByInvitationLinkCopy;

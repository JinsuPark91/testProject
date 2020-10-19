import React, { useEffect, useState } from 'react';
import { useObserver } from 'mobx-react';
import styled from 'styled-components';
import { Row, Col, Typography } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useCoreStores, Button, Input, Toast } from 'teespace-core';

const { Paragraph, Title, Text } = Typography;

const InvitedFriendsText = styled(Text)`
  color: #6c56e5;
  font-size: 13px;
`;

function AddFriendsByInvitationLinkCopy() {
  const { authStore, friendStore } = useCoreStores();
  const [visibleInvitedFriends, setVisibleInvitedFriends] = useState(false);
  const [visibleToast, setVisibleToast] = useState(false);

  useEffect(() => {
    friendStore.getUserInviteLink({ userId: authStore.user.id });
  }, [authStore.user.id, friendStore]);

  const handleToggle = () => setVisibleInvitedFriends(!visibleInvitedFriends);
  return useObserver(() => (
    <>
      <Title level={4}>초대 링크 복사하기</Title>
      <Paragraph>
        아래 초대 링크를 복사 후 공유하세요.
        <br />
        링크를 통해 가입한 멤버는 프렌즈로 추가됩니다.
      </Paragraph>
      <Row>
        <Col span={24} style={{ display: 'flex' }}>
          <Input
            readOnly
            value={friendStore.userInviteLink}
            style={{ width: '100%' }}
          />
          <Toast visible={visibleToast} onClose={() => setVisibleToast(false)}>
            초대 링크가 복사되었습니다.
          </Toast>
          <CopyToClipboard
            text={friendStore.userInviteLink}
            onCopy={() => setVisibleToast(true)}
            style={{ width: 120 }}
          >
            <Button type="solid">초대 링크 복사</Button>
          </CopyToClipboard>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text>나의 초대 링크로 가입한 프렌즈 수 </Text>
          <InvitedFriendsText>
            {friendStore.invitedFriendInfoList.length}
          </InvitedFriendsText>
          <Button type="link" onClick={handleToggle}>
            {!visibleInvitedFriends && (
              <DownOutlined style={{ color: '#000000' }} />
            )}
            {visibleInvitedFriends && (
              <UpOutlined style={{ color: '#000000' }} />
            )}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {visibleInvitedFriends && (
            <>
              {friendStore.invitedFriendInfoList.map(item => (
                <div>
                  {item.friendNick} {item.userName}
                </div>
              ))}
            </>
          )}
        </Col>
      </Row>
    </>
  ));
}

export default AddFriendsByInvitationLinkCopy;

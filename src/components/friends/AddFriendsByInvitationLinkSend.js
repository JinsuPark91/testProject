import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Row, Col, Typography } from 'antd';
import { useCoreStores, Input, Chip, Button, Toast } from 'teespace-core';
import { checkEmailValid } from '../../libs/Regex';
import inviteImage from '../../assets/invite.png';

const { Paragraph, Title } = Typography;

const ParagraphWrapper = styled.div`
  position: relative;
`;
const StyledParagraph = styled(Paragraph)`
  &::before {
    float: right;
    bottom: 0;
    right: 10px;
    content: '';
    width: 173px;
    height: 93px;
    background: url(${inviteImage}) no-repeat;
    background-size: contain;
    position: absolute;
  }
  padding: 9px 12px 15px 12px;
  font-size: 0.75rem;
  color: #ffffff;
  background-color: #6c56e5;
  border-radius: 10px;
`;

const NegativeMargin = styled.div`
  margin: 0 -1rem;
  background-color: #f5f5fb;
  padding: 16px;
  overflow: auto;
  max-height: 154px;
`;

function AddFriendsByInvitationLinkSend() {
  const [userEmail, setUserEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [visibleToast, setVisibleToast] = useState(false);

  const { authStore, friendStore } = useCoreStores();

  const handleUsers = useCallback(
    e => {
      const user = e.target.value;
      const usersSet = new Set(users);
      usersSet.add(user);
      setUsers(Array.from(usersSet));
      setUserEmail('');
    },
    [users],
  );

  const handleTagClose = useCallback(
    user => {
      const usersSet = new Set(users);
      usersSet.delete(user);
      setUsers(Array.from(usersSet));
    },
    [users],
  );

  const handleEmailSend = useCallback(() => {
    friendStore.sendInviteMail({
      myUserId: authStore.user.id,
      users: users.filter(user => checkEmailValid(user)),
    });
    setVisibleToast(true);
  }, [authStore.user.id, friendStore, users]);

  const handleToastClose = useCallback(() => {
    setVisibleToast(false);
  }, []);

  const handleUserEmail = e => setUserEmail(e.target.value);

  return (
    <>
      <Toast visible={visibleToast} onClose={handleToastClose} timeoutMs={1000}>
        총 {users.filter(user => checkEmailValid(user)).length} 명에게 초대
        메일을 발송했습니다.
      </Toast>
      <Title level={4}>초대 메일 보내기</Title>
      <ParagraphWrapper>
        <StyledParagraph>
          입력한 이메일 주소로 초대장이 발송되며, <br />
          초대장을 통해 회원 가입 시<br />
          나의 프렌즈 목록에 추가됩니다.
        </StyledParagraph>
      </ParagraphWrapper>
      <Row>
        <Col span={24} style={{ display: 'flex' }}>
          <Input
            onPressEnter={handleUsers}
            value={userEmail}
            onChange={handleUserEmail}
            placeholder="이메일 주소 입력"
            style={{ width: '100%' }}
          />
          <Button type="outlined" onClick={handleEmailSend}>
            보내기
          </Button>
        </Col>
      </Row>
      {users.length !== 0 && (
        <NegativeMargin>
          {users.map(user => (
            <Chip
              size="small"
              text={user}
              key={user}
              onClose={() => handleTagClose(user)}
              alert={!checkEmailValid(user)}
            />
          ))}
        </NegativeMargin>
      )}
      <Row style={{ height: 33 }} />
    </>
  );
}

export default AddFriendsByInvitationLinkSend;

import React, { useState, useCallback } from 'react';
import { Button, Row, Col, Input, Typography } from 'antd';
import CommonInput from '../commons/Input';
import CommonChip from '../commons/Chip';
import CommonButton from '../commons/Button';
import CommonToast from '../commons/Toast';
import MailChip from './MailChip';

const { Paragraph, Title } = Typography;

function AddFriendsByInvitationLinkSend() {
  const [userEmail, setUserEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [visibleToast, setVisibleToast] = useState(false);

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

  const handleToastOpen = useCallback(() => {
    setVisibleToast(true);
  }, []);

  const handleToastClose = useCallback(() => {
    setVisibleToast(false);
  }, []);

  const handleUserEmail = e => setUserEmail(e.target.value);

  console.log(users);
  return (
    <>
      <CommonToast
        visible={visibleToast}
        onClose={handleToastClose}
        timeoutMs={1000}
      >
        총 1명에게 초대 메일을 발송했습니다.
      </CommonToast>
      <Title level={4}>초대 메일 보내기</Title>
      <Paragraph>
        입력한 이메일 주소로 초대장이 발송되며, <br />
        초대장을 통해 회원 가입 시<br />
        나의 프렌즈 목록에 추가됩니다.
      </Paragraph>
      <Row>
        <Col span={24} style={{ display: 'flex' }}>
          <CommonInput
            onPressEnter={handleUsers}
            value={userEmail}
            onChange={handleUserEmail}
            placeholder="이메일 주소 입력"
            style={{ width: '100%' }}
          />
          <CommonButton type="outlined" onClick={handleToastOpen}>
            보내기
          </CommonButton>
        </Col>
      </Row>
      <div
        style={{ backgroundColor: 'purple', maxHeight: 100, overflow: 'auto' }}
      >
        {users.map(user => (
          <CommonChip
            size="small"
            text={user}
            key={user}
            onClose={() => handleTagClose(user)}
          />
        ))}
      </div>
    </>
  );
}

export default AddFriendsByInvitationLinkSend;

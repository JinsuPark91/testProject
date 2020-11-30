import React, { useCallback, useState } from 'react';
import { Button, Modal, Input } from 'antd';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 2.38rem 1.25rem 2.06rem;
  }
  .ant-modal-footer {
    .ant-btn {
      width: 4.5rem;
    }
  }
`;
const Title = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.13rem;
`;
const Notification = styled.span`
  font-size: 0.69rem;
  color: #8e8d94;
  line-height: 1.06rem;
`;
const InputBox = styled.div`
  position: relative;
  margin: 0.38rem 0 0.06rem;
  .ant-input {
    padding-right: 2.813rem;
  }
`;
const Count = styled.span`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  font-size: 0.6875rem;
  color: #bdc6d3;
`;

function RoomCreateModal({ visible, onCancel }) {
  const [roomName, setRoomName] = useState('');

  const createOpenRoom = useCallback(() => {
    console.log('create open room ', roomName, 'history.push(roomid/talk)');
    cancelCreateRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName]);

  const cancelCreateRoom = useCallback(() => {
    setRoomName('');
    onCancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledModal
      visible={visible}
      title="오픈 룸 만들기"
      width={'24.38rem'}
      onCancel={onCancel}
      footer={[
        <Button
          type="solid"
          shape="round"
          key="s"
          onClick={createOpenRoom}
          disabled={!roomName}
        >
          생성
        </Button>,
        <Button shape="round" key="c" onClick={cancelCreateRoom}>
          취소
        </Button>,
      ]}
    >
      <Title>룸 이름 설정하기</Title>
      <InputBox>
        <Input
          placeholder="목적, 토픽 등이 있다면 입력해 주세요."
          maxLength={50}
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
        />
        <Count>0/50</Count>
      </InputBox>
      <Notification>
        누구나 검색을 통하여 자유롭게 참여할 수 있는 공간입니다.
      </Notification>
    </StyledModal>
  );
}

export default RoomCreateModal;

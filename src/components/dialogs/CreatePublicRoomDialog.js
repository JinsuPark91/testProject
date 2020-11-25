import React, { useState, useEffect } from 'react';
import {
  FlexModal,
  Input,
  Description,
  Title,
  LengthCounter,
  Wrapper,
  ButtonContainer,
  StyledButton,
} from './CreatePublicRoomDialogStyle';

const CreatePrivateRoomDialog = ({ visible, onOk, onCancel }) => {
  const initialRoomName = '';
  const [roomName, setRoomName] = useState(initialRoomName);

  useEffect(() => {
    if (!visible) {
      setRoomName(initialRoomName);
    }
  }, [visible]);

  const handleChangeName = e => {
    const name = e.target.value;
    if (name.length < 51) setRoomName(name);
  };

  const handleOk = () => {
    onOk();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <FlexModal
      title={
        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
          오픈 룸 만들기
        </div>
      }
      visible={visible}
      closable
      footer={null}
    >
      <Wrapper>
        <Title>룸 이름 설정하기</Title>

        <Input>
          <input
            type="text"
            value={roomName}
            onChange={handleChangeName}
            placeholder="목적, 토픽 등이 있다면 입력해 주세요."
          />
          <LengthCounter>{`${roomName.length}/50`}</LengthCounter>
        </Input>

        <Description>
          누구나 검색을 통하여 자유롭게 참여할 수 있는 공간입니다.
        </Description>

        <ButtonContainer>
          <StyledButton
            buttonType="ok"
            onClick={handleOk}
            disabled={!roomName.length}
          >
            생성
          </StyledButton>
          <StyledButton buttonType="cancel" onClick={handleCancel}>
            취소
          </StyledButton>
        </ButtonContainer>
      </Wrapper>
    </FlexModal>
  );
};

export default CreatePrivateRoomDialog;

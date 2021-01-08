import React, { useState, useEffect, useCallback } from 'react';
import { ItemSelector, useCoreStores } from 'teespace-core';
import { Checkbox } from 'antd';
import {
  FlexModal,
  Input,
  Description,
  Title,
  LengthCounter,
  InfoContainer,
  ButtonContainer,
  StyledButton,
  ConfigWrapper,
} from './CreatePublicRoomDialogStyle';

const CreatePublicRoomDialog = ({ visible, onOk, onCancel }) => {
  const { userStore } = useCoreStores();
  const initialStates = {
    step: 0,
    roomName: '',
    selectedUsers: [],
    isStartMeeting: false,
  };

  const [step, setStep] = useState(initialStates.step);
  const [roomName, setRoomName] = useState(initialStates.roomName);
  const [isStartMeeting, setIsStartMeeting] = useState(
    initialStates.isStartMeeting,
  );
  const [selectedUsers, setSelectedUsers] = useState(
    initialStates.selectedUsers,
  );
  const disabledIds = [userStore.myProfile.id];

  const clearState = () => {
    setStep(initialStates.step);
    setRoomName(initialStates.roomName);
    setSelectedUsers(initialStates.selectedUsers);
    setIsStartMeeting(initialStates.isStartMeeting);
  };

  useEffect(() => {
    if (!visible) {
      clearState();
    }
  }, [visible]);

  const handleChangeName = e => {
    const name = e.target.value;
    if (name.length < 51) setRoomName(name);
  };

  const handleOk = () => {
    const lastStep = 1;
    if (step === lastStep)
      onOk({
        selectedUsers,
        roomName,
        isStartMeeting,
      });
    else setStep(step + 1);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSelectedUserChange = useCallback(({ userArray }) => {
    const filteredUsers = userArray.filter(
      user => !disabledIds.includes(user.friendId || user.id),
    );
    setSelectedUsers(filteredUsers);
  }, []);

  const handleStartMeetingChange = e => {
    setIsStartMeeting(e.target.checked);
  };

  const handleToggle = () => {
    setIsStartMeeting(!isStartMeeting);
  };
  return (
    <FlexModal
      title={step === 0 ? '오픈 룸 만들기' : '룸 구성원 초대'}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width="fit-content"
      destroyOnClose
    >
      {step === 0 ? (
        <>
          <InfoContainer>
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
          </InfoContainer>
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
        </>
      ) : (
        <>
          <ItemSelector
            isVisibleRoom={false}
            onSelectChange={handleSelectedUserChange}
            disabledIds={disabledIds}
            defaultSelectedUsers={[userStore.myProfile]}
            height={25} // rem
          />
          <ConfigWrapper>
            <Checkbox
              className="check-round"
              checked={isStartMeeting}
              onChange={handleStartMeetingChange}
            />
            <Title onClick={handleToggle} style={{ marginLeft: '0.38rem' }}>
              초대 구성원과 바로 Meeting 시작하기
            </Title>
          </ConfigWrapper>
          <ButtonContainer>
            {selectedUsers.length ? (
              <>
                <StyledButton
                  buttonType="ok"
                  onClick={handleOk}
                  disabled={!selectedUsers.length}
                >
                  확인
                </StyledButton>
                <StyledButton buttonType="cancel" onClick={handleCancel}>
                  취소
                </StyledButton>
              </>
            ) : (
              <StyledButton buttonType="ok" onClick={handleOk}>
                건너뛰기
              </StyledButton>
            )}
          </ButtonContainer>
        </>
      )}
    </FlexModal>
  );
};

export default CreatePublicRoomDialog;

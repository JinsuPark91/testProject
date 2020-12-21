import React, { useState, useCallback, useEffect } from 'react';
import { ItemSelector, useCoreStores } from 'teespace-core';
import { Checkbox } from 'antd';
import {
  ConfigTitle,
  ConfigTitleText,
  ConfigDescriptionText,
  Input,
  ConfigWrapper,
  ButtonContainer,
  StyledButton,
  LengthCounter,
  FlexModal,
} from './CreatePrivateRoomDialogStyle';

const CreatePrivateRoomDialog = ({ visible, onOk, onCancel }) => {
  const { userStore } = useCoreStores();
  const initialOptions = {
    isChangeName: false,
    roomName: '',
    isStartMeeting: false,
  };
  const [options, setOptions] = useState(initialOptions);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const disabledIds = [userStore.myProfile.id];

  const clearState = () => {
    setOptions(initialOptions);
  };

  const handleOk = () => {
    onOk({
      ...options,
      selectedUsers,
    });
    clearState();
  };

  const handleCancel = () => {
    onCancel();
    clearState();
    console.log('HANDLE CANCEL');
  };

  const handleChangeNameChange = e => {
    const isChecked = e.target.checked;
    setOptions({ ...options, isChangeName: isChecked });
  };

  const handleStartMeetingChange = e => {
    const isChecked = e.target.checked;
    setOptions({ ...options, isStartMeeting: isChecked });
  };

  const handleSelectedUserChange = useCallback(({ userArray }) => {
    const filteredUsers = userArray.filter(
      user => !disabledIds.includes(user.friendId || user.id),
    );
    setSelectedUsers(filteredUsers);
  }, []);

  const handleChangeName = e => {
    const name = e.target.value;

    if (name.length < 51) setOptions({ ...options, roomName: name });
  };

  return (
    <FlexModal
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      title={
        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
          프라이빗 룸 만들기
        </div>
      }
      footer={null}
      style={{ width: 'auto' }}
      destroyOnClose
    >
      <>
        <ItemSelector
          isVisibleRoom={false}
          onSelectChange={handleSelectedUserChange}
          disabledIds={disabledIds}
          defaultSelectedUsers={[userStore.myProfile]}
          showMeOnFriendTab={false}
          height={20} // rem
        />
        <ConfigWrapper>
          <ConfigTitle>
            <Checkbox
              className="check-round"
              defaultChecked
              disabled={selectedUsers.length < 2}
              checked={options.isChangeName}
              onChange={handleChangeNameChange}
            />
            <ConfigTitleText>룸 이름 설정하기</ConfigTitleText>
          </ConfigTitle>

          <ConfigDescriptionText>
            {`초기 설정하지 않을 시, 구성원 이름으로 나열된 룸이 개설되며,
            이후 변경한 룸 이름은 개인에게만 적용됩니다.`}
          </ConfigDescriptionText>

          <Input disabled={selectedUsers.length < 2 || !options.isChangeName}>
            <input
              type="text"
              value={options.roomName}
              onChange={handleChangeName}
              placeholder="목적, 토픽 등이 있다면 입력해 주세요."
              disabled={selectedUsers.length < 2 || !options.isChangeName}
            />
            <LengthCounter
              disabled={selectedUsers.length < 2 || !options.isChangeName}
            >{`${options.roomName.length}/50`}</LengthCounter>
          </Input>

          <ConfigTitle>
            <Checkbox
              className="check-round"
              checked={options.isStartMeeting}
              onChange={handleStartMeetingChange}
            />
            <ConfigTitleText>
              초대 구성원과 바로 Meeting 시작하기
            </ConfigTitleText>
          </ConfigTitle>
        </ConfigWrapper>

        <ButtonContainer>
          <StyledButton
            buttonType="ok"
            onClick={handleOk}
            disabled={!selectedUsers.length}
          >
            {`초대 ${selectedUsers.length > 99 ? '99+' : selectedUsers.length}`}
          </StyledButton>
          <StyledButton buttonType="cancel" onClick={handleCancel}>
            취소
          </StyledButton>
        </ButtonContainer>
      </>
    </FlexModal>
  );
};

export default CreatePrivateRoomDialog;

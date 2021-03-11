import React, { useState, useCallback } from 'react';
import { ItemSelector, useCoreStores, logEvent } from 'teespace-core';
import { Checkbox, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ConfigTitle,
  ConfigTitleText,
  ConfigDescriptionText,
  ConfigWrapper,
  ButtonContainer,
  FlexModal,
} from './CreatePrivateRoomDialogStyle';
import Input from '../Input';

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
    logEvent('room', 'clickInviteToPrivateRoomBtn');
  };

  const handleCancel = () => {
    onCancel();
    clearState();
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

  const handleChangeName = name => {
    setOptions({ ...options, roomName: name });
  };

  return (
    <FlexModal
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      title="프라이빗 룸 만들기"
      footer={null}
      width="fit-content"
      destroyOnClose
    >
      <>
        <ItemSelector
          isVisibleRoom={false}
          onSelectChange={handleSelectedUserChange}
          disabledIds={disabledIds}
          defaultSelectedUsers={[userStore.myProfile]}
          showMeOnFriendTab={false}
          height={25} // rem
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
            {
              '초기 설정하지 않을 시, 구성원 별명으로 나열된 룸이 개설되며,\n이후 변경한 룸 이름은 개인에게만 적용됩니다.'
            }
          </ConfigDescriptionText>

          <Input
            maxLength={50}
            value={options.roomName}
            onChange={handleChangeName}
            placeholder="목적, 토픽 등이 있다면 입력해 주세요."
            disabled={selectedUsers.length < 2 || !options.isChangeName}
          />

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
          <Button
            type="solid"
            shape="default"
            onClick={handleOk}
            disabled={!selectedUsers.length}
          >
            {`초대 ${selectedUsers.length > 99 ? '99+' : selectedUsers.length}`}
          </Button>
          <Button type="outlined" shape="default" onClick={handleCancel}>
            취소
          </Button>
        </ButtonContainer>
      </>
    </FlexModal>
  );
};

export default CreatePrivateRoomDialog;

import React, { useState, useCallback } from 'react';
import {
  ItemSelector,
  MobileItemSelector,
  useCoreStores,
  logEvent,
  Modal,
} from 'teespace-core';
import { Checkbox, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ConfigTitle,
  ConfigTitleText,
  ConfigDescriptionText,
  ConfigWrapper,
  ButtonContainer,
} from './CreatePrivateRoomDialogStyle';
import Input from '../Input';

const CreatePrivateRoomDialog = ({ visible, onOk, onCancel }) => {
  const { userStore, configStore } = useCoreStores();
  const { t } = useTranslation();

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

  const renderOkText = () => {
    if (selectedUsers.length === 0) return '건너뛰기';

    return '안뛰기';
  };

  return (
    <MobileItemSelector
      isVisibleRoom={false}
      onSelectChange={handleSelectedUserChange}
      disabledIds={disabledIds}
      defaultSelectedUsers={[userStore.myProfile]}
      showMeOnFriendTab={false}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={renderOkText}
      visible={visible}
      destroyOnClose
    />
  );
};

export default CreatePrivateRoomDialog;

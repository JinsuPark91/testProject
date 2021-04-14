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

  return (
    <FlexModal
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      title={t('CM_CREATE_PRIVATE_ROOM_02')}
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
            <ConfigTitleText>{t('CM_ROOM_NAME_SETTING')}</ConfigTitleText>
          </ConfigTitle>

          <ConfigDescriptionText>
            {t('CM_B2B_CREATE_ROOM_POPUP_FRIENDS_07')}
          </ConfigDescriptionText>

          <Input
            maxLength={50}
            value={options.roomName}
            onChange={handleChangeName}
            placeholder={t('CM_B2B_CREATE_ROOM_POPUP_FRIENDS_08')}
            disabled={selectedUsers.length < 2 || !options.isChangeName}
          />
          {configStore.isActivateForCNU('Meeting') ? (
            <ConfigTitle>
              <Checkbox
                className="check-round"
                checked={options.isStartMeeting}
                onChange={handleStartMeetingChange}
              />
              <ConfigTitleText>
                {t('CM_CREATE_PRIVATE_ROOM_04')}
              </ConfigTitleText>
            </ConfigTitle>
          ) : null}
        </ConfigWrapper>

        <ButtonContainer>
          <Button
            type="solid"
            shape="default"
            onClick={handleOk}
            disabled={!selectedUsers.length}
          >
            {`${t('CM_B2B_CREATE_ROOM_POPUP_FRIENDS_09')} ${
              selectedUsers.length > 99 ? '99+' : selectedUsers.length
            }`}
          </Button>
          <Button type="outlined" shape="default" onClick={handleCancel}>
            {t('CM_CANCEL')}
          </Button>
        </ButtonContainer>
      </>
    </FlexModal>
  );
};

export default CreatePrivateRoomDialog;

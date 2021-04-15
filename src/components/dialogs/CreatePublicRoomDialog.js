import React, { useState, useEffect, useCallback } from 'react';
import { ItemSelector, useCoreStores, logEvent } from 'teespace-core';
import { Checkbox, Button, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  FlexModal,
  Description,
  Title,
  InfoContainer,
  ButtonContainer,
  ConfigWrapper,
} from './CreatePublicRoomDialogStyle';
import Input from '../Input';

const CreatePublicRoomDialog = ({ visible, onOk, onCancel }) => {
  const { userStore, configStore } = useCoreStores();
  const initialStates = {
    step: 0,
    roomName: '',
    selectedUsers: [],
    isStartMeeting: false,
    isJoinable: false,
  };

  const { t } = useTranslation();
  const [step, setStep] = useState(initialStates.step);
  const [roomName, setRoomName] = useState(initialStates.roomName);
  const [isStartMeeting, setIsStartMeeting] = useState(
    initialStates.isStartMeeting,
  );
  const [isJoinable, setIsJoinable] = useState(initialStates.isJoinable);
  const [selectedUsers, setSelectedUsers] = useState(
    initialStates.selectedUsers,
  );
  const disabledIds = [userStore.myProfile.id];

  const clearState = () => {
    setStep(initialStates.step);
    setRoomName(initialStates.roomName);
    setSelectedUsers(initialStates.selectedUsers);
    setIsStartMeeting(initialStates.isStartMeeting);
    setIsJoinable(initialStates.isJoinable);
  };

  useEffect(() => {
    if (!visible) {
      clearState();
    }
  }, [visible]);

  const handleChangeName = name => {
    setRoomName(name);
  };

  const handleOk = () => {
    const lastStep = 1;
    if (step === lastStep)
      onOk({
        selectedUsers,
        roomName,
        isStartMeeting,
        isJoinable: !isJoinable,
      });
    else {
      setStep(step + 1);
      logEvent('room', 'clickCreateOpenRoomBtn');
    }
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

  const handleJoinableChange = checked => {
    setIsJoinable(checked);
  };

  return (
    <FlexModal
      title={step === 0 ? t('CM_CREATE_OPEN_ROOM') : t('CM_ROOM_INVITE_USER')}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      {step === 0 ? (
        <>
          <InfoContainer>
            <Title>{t('CM_ROOM_NAME_SETTING')}</Title>
            <Input
              maxLength={50}
              value={roomName}
              onChange={handleChangeName}
              placeholder={t('CM_B2B_CREATE_ROOM_POPUP_FRIENDS_08')}
              style={{ margin: '0.5rem 0' }}
            />

            <Description>{t('CM_CREATE_OPEN_ROOM_04')}</Description>

            {/* <Title
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '1.25rem 0 0.25rem 0',
              }}
            >
              <span>{t('CM_CREATE_OPEN_ROOM_POPUP_01')}</span>
              <Switch checked={isJoinable} onChange={handleJoinableChange} />
            </Title>
            <Description>{t('CM_CREATE_OPEN_ROOM_POPUP_02')}</Description> */}
          </InfoContainer>
          <ButtonContainer>
            <Button
              type="solid"
              shape="default"
              onClick={handleOk}
              disabled={!roomName.length}
            >
              {t('CM_CREATE_OPEN_ROOM_05')}
            </Button>
            <Button type="outlined" shape="default" onClick={handleCancel}>
              {t('CM_CANCEL')}
            </Button>
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
          {configStore.isActivateForCNU('Meeting') ? (
            <ConfigWrapper>
              <Checkbox
                className="check-round"
                checked={isStartMeeting}
                onChange={handleStartMeetingChange}
              />
              <Title onClick={handleToggle} style={{ marginLeft: '0.38rem' }}>
                {t('CM_CREATE_PRIVATE_ROOM_04')}
              </Title>
            </ConfigWrapper>
          ) : null}
          <ButtonContainer>
            {selectedUsers.length ? (
              <>
                <Button
                  type="solid"
                  shape="default"
                  onClick={handleOk}
                  disabled={!selectedUsers.length}
                >
                  {t('CM_LOGIN_POLICY_03')}
                </Button>
                <Button type="outlined" shape="default" onClick={handleCancel}>
                  {t('CM_CANCEL')}
                </Button>
              </>
            ) : (
              <Button type="solid" shape="default" onClick={handleOk}>
                {t('CM_CREATE_OPEN_ROOM_07')}
              </Button>
            )}
          </ButtonContainer>
        </>
      )}
    </FlexModal>
  );
};

export default CreatePublicRoomDialog;

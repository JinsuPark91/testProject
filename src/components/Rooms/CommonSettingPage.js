import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'antd';
import { useCoreStores, Toast, Message } from 'teespace-core';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import Input from '../Input';

const CommonSettingPage = ({ roomId }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  const { roomStore, userStore } = useCoreStores();
  const history = useHistory();
  const myUserId = userStore.myProfile.id;
  const roomInfo = roomStore.getRoom(roomId);

  useEffect(() => {
    if (roomInfo) {
      const name = roomInfo?.customName || roomInfo?.name;
      setValue(name.substring(0, 20) || '');

      const isPrivate = roomInfo.type === 'WKS0002';
      setIsPrivateRoom(isPrivate);
    }
  }, [roomInfo]);

  const getConvertedTime = timestamp => {
    if (timestamp) {
      return DateTime.fromFormat(timestamp, 'yyyy-MM-dd HH:mm:ss.S z')
        .toFormat('yyyy.MM.dd a hh:mm')
        .replace('AM', t('TEMP_05'))
        .replace('PM', t('TEMP_06'));
    }
    return '';
  };

  const handleSave = async () => {
    try {
      const result = await roomStore.updateRoomInfo({
        roomId: roomInfo.id,
        newName: value,
      });

      if (result) {
        setIsChanged(false);
        // NOTE : roomInfo.adminName 에 값이 없음.
        // const admin = await userStore.getProfile({ userId: roomInfo.adminId });
        setToastMessage(t('WEB_COMMON_SETTING_GENERAL_11'));
        setIsToastVisible(true);
      } else throw Error(`result:${result}`);
    } catch (err) {
      console.error(`[Platform] change name error, ${err}`);
    }
  };

  const handleClickModeChange = () => {
    setIsWarningVisible(true);
  };

  const handleConfirmModeChange = async () => {
    try {
      const result = await roomStore.changeRoomModePrivate({
        roomId: roomInfo.id,
        userId: myUserId,
      });
      if (result) setIsPrivateRoom(true);
      else throw Error(`result:${result}`);
    } catch (err) {
      console.error(`[Platform] private room failed, ${err}`);
    } finally {
      setIsWarningVisible(false);
    }
  };

  const handleCancelModeChange = () => {
    setIsWarningVisible(false);
  };

  const handleDelete = () => {
    setIsDeleteWarningVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteWarningVisible(false);
  };

  const handleDeleteOk = async () => {
    try {
      const result = await roomStore.deleteRoom({
        userId: myUserId,
        roomId: roomInfo.id,
      });
      const myRoomId =
        roomStore.getDMRoom(myUserId, myUserId)?.roomInfo?.id ||
        roomStore.getRoomArray()?.[0].id;

      if (result) history.push(`/s/${myRoomId}/talk`);
      else throw Error(`result:${result}`);
    } catch (err) {
      console.error(`[Platform] 룸 삭제 실패, ${err}`);
    } finally {
      setIsDeleteWarningVisible(false);
    }
  };

  const handleChange = text => {
    setValue(text);
    setIsChanged(true);
  };

  const handleToastClose = () => {
    setIsToastVisible(false);
  };

  return (
    <Wrapper style={{ padding: '2.56rem 3.75rem' }}>
      <Message
        visible={isDeleteWarningVisible}
        title="해당 룸을 삭제하시겠습니까?"
        subtitle="한 번 삭제한 룸은 복구할 수 없습니다."
        type="error"
        btns={[
          {
            type: 'solid',
            shape: 'default',
            text: '삭제',
            onClick: handleDeleteOk,
          },
          {
            type: 'outlined',
            shape: 'default',
            text: '취소',
            onClick: handleDeleteCancel,
          },
        ]}
      />
      <Toast
        visible={isToastVisible}
        timeoutMs={1000}
        onClose={handleToastClose}
      >
        {toastMessage}
      </Toast>
      <SettingWrapper>
        <SettingTitleText style={{ marginBottom: '0.31rem' }}>
          Room 이름
        </SettingTitleText>
        <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
          구성원이 따로 이름 변경하여 보는 룸 이름에는 영향을 주지 않습니다.
        </SettingDescriptionText>
        <Input
          maxLength={50}
          value={value}
          onChange={handleChange}
          placeholder={roomInfo?.name}
        />
        <Button
          type="solid"
          shape="default"
          disabled={!value.length || !isChanged}
          style={{ marginTop: '0.63rem', alignSelf: 'flex-end' }}
          onClick={handleSave}
        >
          저장
        </Button>
      </SettingWrapper>
      {(isPrivateRoom && roomInfo?.typeModifiedDate) || !isPrivateRoom ? (
        <SettingWrapper>
          {isPrivateRoom && roomInfo?.typeModifiedDate ? (
            <SettingTitleText style={{ color: '#777' }}>
              프라이빗 룸으로 전환됨
              <SettingDescriptionText style={{ marginLeft: '0.5rem' }}>
                {getConvertedTime(roomInfo?.typeModifiedDate)}
              </SettingDescriptionText>
            </SettingTitleText>
          ) : null}
          {!isPrivateRoom ? (
            <SettingTitleText>프라이빗 룸으로 전환</SettingTitleText>
          ) : null}
          <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
            프라이빗 룸으로 전환 할 경우, 다시 오픈 룸으로 전환할 수 없습니다.
          </SettingDescriptionText>
          {!isPrivateRoom && (
            <>
              <Message
                visible={isWarningVisible}
                title="프라이빗 룸으로 전환하시겠습니까?"
                subtitle="한 번 변경하면 다시 오픈 룸으로 전환 할 수 없습니다."
                type="error"
                btns={[
                  {
                    type: 'solid',
                    shape: 'default',
                    text: '전환',
                    onClick: handleConfirmModeChange,
                  },
                  {
                    type: 'outlined',
                    shape: 'default',
                    text: '취소',
                    onClick: handleCancelModeChange,
                  },
                ]}
              />
              <Button
                type="solid"
                shape="default"
                style={{ marginTop: '0.81rem', alignSelf: 'flex-end' }}
                onClick={handleClickModeChange}
              >
                전환
              </Button>
            </>
          )}
        </SettingWrapper>
      ) : null}

      <SettingWrapper>
        <SettingTitleText>룸 삭제하기</SettingTitleText>
        <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
          삭제할 경우, 대화 내용과 데이터가 모두 삭제되며 룸 목록에서도
          삭제됩니다.
        </SettingDescriptionText>
        <Button
          type="outlined"
          shape="default"
          style={{ marginTop: '0.81rem', alignSelf: 'flex-end' }}
          onClick={handleDelete}
        >
          삭제
        </Button>
      </SettingWrapper>
    </Wrapper>
  );
};

export default CommonSettingPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 25rem;
  & + & {
    margin-top: 2.25rem;
  }
`;

const SettingTitleText = styled.span`
  font-size: 0.81rem;
  color: #000;
  font-weight: bold;
  margin-bottom: 0.31rem;
`;

const SettingDescriptionText = styled.span`
  font-size: 0.75rem;
  color: #777;
  font-weight: 300;
`;

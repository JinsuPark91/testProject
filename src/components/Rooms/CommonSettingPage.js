import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'antd';
import { useCoreStores } from 'teespace-core';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../stores';
import Input from '../Input';

const CommonSettingPage = ({ roomId }) => {
  const { t } = useTranslation();
  const { uiStore } = useStores();
  const [value, setValue] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);

  const { roomStore, userStore } = useCoreStores();
  const history = useHistory();
  const myUserId = userStore.myProfile.id;
  const roomInfo = roomStore.getRoom(roomId);

  useEffect(() => {
    if (roomInfo) {
      const name = roomInfo?.oriName;
      setValue(name?.substring(0, 50) || roomInfo.name?.substring(0, 50) || '');

      const isPrivate = roomInfo.type === 'WKS0002';
      setIsPrivateRoom(isPrivate);
    }
  }, [roomInfo]);

  const getConvertedTime = timestamp => {
    if (timestamp) {
      return DateTime.fromFormat(timestamp, 'yyyy-MM-dd HH:mm:ss.S z')
        .toFormat('yyyy.MM.dd') // a hh:mm
        .replace('AM', t('CM_TEMP_AM'))
        .replace('PM', t('CM_TEMP_PM'));
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
        uiStore.openToast({
          text: t('CM_CHANGE_SAVE'),
          onClose: () => {
            uiStore.closeToast();
          },
        });
      } else throw Error(`result:${result}`);
    } catch (err) {
      console.error(`[Platform] change name error, ${err}`);
    }
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
      uiStore.closeMessage();
    }
  };

  const handleClickModeChange = () => {
    uiStore.openMessage({
      title: t('CM_ROOM_SETTING_BAISC_06'),
      subTitle: t('CM_ROOM_SETTING_BAISC_07'),
      type: 'error',
      buttons: [
        {
          type: 'solid',
          shape: 'default',
          text: t('CM_CHANGE_02'),
          onClick: handleConfirmModeChange,
        },
        {
          type: 'outlined',
          shape: 'default',
          text: t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
      ],
    });
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
      uiStore.closeMessage();
    }
  };

  const handleDelete = () => {
    uiStore.openMessage({
      title: t('CM_ROOM_SETTING_BAISC_10'),
      subTitle: t('CM_ROOM_SETTING_BAISC_11'),
      type: 'error',
      buttons: [
        {
          type: 'solid',
          shape: 'default',
          text: t('CM_DEL'),
          onClick: handleDeleteOk,
        },
        {
          type: 'outlined',
          shape: 'default',
          text: t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
      ],
    });
  };

  const handleChange = text => {
    setValue(text);
    setIsChanged(true);
  };

  if (!roomInfo) return null;

  return (
    <Wrapper style={{ padding: '2.56rem 3.75rem' }}>
      <SettingWrapper>
        <SettingTitleText>{t('CM_ROOM_SETTING_BAISC_02')}</SettingTitleText>
        <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
          {t('CM_ROOM_SETTING_BAISC_03')}
        </SettingDescriptionText>
        <Input
          maxLength={50}
          value={value}
          onChange={handleChange}
          placeholder={roomInfo?.oriName}
        />
        <Button
          type="solid"
          shape="default"
          disabled={!value.length || !isChanged}
          style={{ marginTop: '0.63rem', alignSelf: 'flex-end' }}
          onClick={handleSave}
        >
          {t('CM_SAVE')}
        </Button>
      </SettingWrapper>
      {/* //참여 승인 추가 영역
      <SettingWrapper>
        <SettingTitleWrap>
          <SettingTitleText>참여 승인 필요</SettingTitleText>
          <Switch />
        </SettingTitleWrap>
        <SettingDescriptionText>
          On 시, 룸 관리자의 승인이 잇어야 룸에 참여 가능합니다.
        </SettingDescriptionText>
      </SettingWrapper> */}
      {(isPrivateRoom && roomInfo?.typeModifiedDate) || !isPrivateRoom ? (
        <SettingWrapper>
          {isPrivateRoom && roomInfo?.typeModifiedDate ? (
            <SettingTitleText style={{ color: '#777' }}>
              {t('CM_ROOM_SETTING_BAISC_12')}
              <SettingDescriptionText style={{ marginLeft: '0.5rem' }}>
                {getConvertedTime(roomInfo?.typeModifiedDate)}
              </SettingDescriptionText>
            </SettingTitleText>
          ) : null}
          {!isPrivateRoom ? (
            <SettingTitleText>{t('CM_ROOM_SETTING_BAISC_04')}</SettingTitleText>
          ) : null}
          <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
            {t('CM_ROOM_SETTING_BAISC_05')}
          </SettingDescriptionText>
          {!isPrivateRoom && (
            <Button
              type="solid"
              shape="default"
              style={{ marginTop: '0.81rem', alignSelf: 'flex-end' }}
              onClick={handleClickModeChange}
            >
              {t('CM_CHANGE_02')}
            </Button>
          )}
        </SettingWrapper>
      ) : null}

      <SettingWrapper>
        <SettingTitleText>{t('CM_ROOM_SETTING_BAISC_08')}</SettingTitleText>
        <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
          {t('CM_ROOM_SETTING_BAISC_09')}
        </SettingDescriptionText>
        <Button
          type="outlined"
          shape="default"
          style={{ marginTop: '0.81rem', alignSelf: 'flex-end' }}
          onClick={handleDelete}
        >
          {t('CM_DEL')}
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
  margin-bottom: 0.31rem;
  font-size: 0.81rem;
  font-weight: bold;
  color: ${props => props.theme.TextMain};
`;

const SettingDescriptionText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.TextSub};
  font-weight: 300;
`;

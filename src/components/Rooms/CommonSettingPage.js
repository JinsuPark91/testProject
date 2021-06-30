import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Switch } from 'antd';
import { useCoreStores } from 'teespace-core';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { Observer, useLocalStore } from 'mobx-react';
import { transaction } from 'mobx';
import { useStores } from '../../stores';
import Input from '../Input';

const CommonSettingPage = ({ roomInfo }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { uiStore } = useStores();
  const { roomStore, userStore } = useCoreStores();

  const localStore = useLocalStore(() => ({
    newName:
      roomInfo.oriName.substring(0, 50) || roomInfo.name.substring(0, 50) || '',
    isChanged: false,
  }));

  const isOpenRoom = () => roomInfo.type === 'WKS0003';
  const isPrivateRoom = () => roomInfo.type === 'WKS0002';

  const convertTimeFormat = timestamp => {
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
        newName: localStore.newName,
      });

      if (result) {
        localStore.isChanged = false;

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
        userId: userStore.myProfile.id,
      });
      if (!result) throw Error(`result:${result}`);
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
        userId: userStore.myProfile.id,
        roomId: roomInfo.id,
      });

      const myRoomId =
        roomStore.getDMRoom(userStore.myProfile.id, userStore.myProfile.id)
          ?.roomInfo?.id || roomStore.getRoomArray()?.[0].id;

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
    transaction(() => {
      localStore.newName = text;
      localStore.isChanged = true;
    });
  };

  const handleJoinableChange = async checked => {
    // 체크 되어 있으면 (true) : 참여 승인필요
    // 아니면 : 참여 승인 필요 없음
    await roomStore.updateRoomInfo({
      roomId: roomInfo.id,
      newIsJoinable: !checked,
    });
  };

  return (
    <Wrapper style={{ padding: '2.56rem 3.75rem' }}>
      <SettingWrapper>
        <SettingTitleText>{t('CM_ROOM_SETTING_BAISC_02')}</SettingTitleText>
        <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
          {t('CM_ROOM_SETTING_BAISC_03')}
        </SettingDescriptionText>
        <Observer>
          {() => (
            <Input
              maxLength={50}
              value={localStore.newName}
              onChange={handleChange}
              placeholder={roomInfo?.oriName}
            />
          )}
        </Observer>

        <Observer>
          {() => (
            <Button
              type="solid"
              shape="default"
              disabled={!localStore.newName.length || !localStore.isChanged}
              style={{ marginTop: '0.63rem', alignSelf: 'flex-end' }}
              onClick={handleSave}
            >
              {t('CM_SAVE')}
            </Button>
          )}
        </Observer>
      </SettingWrapper>

      <Observer>
        {() =>
          roomInfo.type === 'WKS0003' ? (
            <SettingWrapper>
              <SettingTitleWrapper>
                <SettingTitleText>
                  {t('CM_ROOM_SETTING_BASIC_13')}
                </SettingTitleText>

                <Switch
                  checked={!roomInfo.isJoinable}
                  onChange={handleJoinableChange}
                />
              </SettingTitleWrapper>
              <SettingDescriptionText>
                {t('CM_ROOM_SETTING_BASIC_14')}
              </SettingDescriptionText>
            </SettingWrapper>
          ) : null
        }
      </Observer>

      <Observer>
        {() =>
          (isPrivateRoom() && roomInfo.typeModifiedDate) || isOpenRoom() ? (
            <SettingWrapper>
              {isPrivateRoom() && roomInfo.typeModifiedDate ? (
                <SettingTitleText style={{ color: '#777' }}>
                  {t('CM_ROOM_SETTING_BAISC_12')}
                  <SettingDescriptionText style={{ marginLeft: '0.5rem' }}>
                    {convertTimeFormat(roomInfo.typeModifiedDate)}
                  </SettingDescriptionText>
                </SettingTitleText>
              ) : null}
              {isOpenRoom() ? (
                <SettingTitleText>
                  {t('CM_ROOM_SETTING_BAISC_04')}
                </SettingTitleText>
              ) : null}
              <SettingDescriptionText style={{ marginBottom: '0.81rem' }}>
                {t('CM_ROOM_SETTING_BAISC_05')}
              </SettingDescriptionText>
              {isOpenRoom() && (
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
          ) : null
        }
      </Observer>

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

const SettingTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
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

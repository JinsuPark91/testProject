import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react';
import { DateTime } from 'luxon';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Switch } from 'antd';
import { useStores } from '../../../../stores';
import { ArrowRightIcon } from '../../../Icons';
import MobileRoomSettingHeader from './MobileRoomSettingHeader';

const SettingItem = ({ title, subText, utile, color = '#000', onClick }) => {
  return (
    <ItemWrap onClick={onClick}>
      <ItemTitle color={color}>{title}</ItemTitle>
      {utile && <UtileWrap>{utile}</UtileWrap>}
      {subText && <ItemSubText>{subText}</ItemSubText>}
    </ItemWrap>
  );
};

const MobileRoomSetting = ({ roomId }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { userStore, roomStore } = useCoreStores();
  const { uiStore } = useStores();
  const roomInfo = roomStore.getRoom(roomId);
  const isOpenRoom = () => roomInfo.type === 'WKS0003';
  const isPrivateRoom = () => roomInfo.type === 'WKS0002';
  const handleCancel = () => history.push(`/room`);

  /* 룸 이름 변경 */
  const handleNameEdit = () => {
    history.push(`/editName/${roomInfo?.id}/`);
  };

  /* 참여 승인 */
  const handleJoinableChange = checked => {
    const handleJoinableOk = async () => {
      try {
        await roomStore.updateRoomInfo({
          roomId: roomInfo.id,
          newIsJoinable: !checked,
        });
      } catch (err) {
        console.error(`참여 승인 변경 실패, ${err}`);
      } finally {
        uiStore.closeMessage();
      }
    };

    uiStore.openMessage({
      title: t('TALK_ROOMMENU_SETTING_JOIN_APPROVAL_01'),
      subTitle: !checked && t('TALK_ROOMMENU_SETTING_JOIN_APPROVAL_02'),
      type: 'error',
      buttons: [
        {
          type: 'outlined',
          shape: 'round',
          text: t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
        {
          type: 'solid',
          shape: 'round',
          text: t('CM_CHANGE'),
          onClick: handleJoinableOk,
        },
      ],
    });
  };

  /* 프라이빗 룸 */
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
          type: 'outlined',
          shape: 'round',
          text: t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
        {
          type: 'solid',
          shape: 'round',
          text: t('CM_CHANGE_02'),
          onClick: handleConfirmModeChange,
        },
      ],
    });
  };
  const convertTimeFormat = timestamp => {
    if (timestamp) {
      return DateTime.fromFormat(timestamp, 'yyyy-MM-dd HH:mm:ss.S z')
        .toFormat('yyyy.MM.dd') // a hh:mm
        .replace('AM', t('CM_TEMP_AM'))
        .replace('PM', t('CM_TEMP_PM'));
    }
    return '';
  };

  /* 룸 삭제 */
  const handleDeleteOk = async () => {
    try {
      const result = await roomStore.deleteRoom({
        userId: userStore.myProfile.id,
        roomId: roomInfo.id,
      });
      if (result) history.push(`/room`);
      else throw Error(`result:${result}`);
    } catch (err) {
      console.error(`[Platform] 룸 삭제 실패, ${err}`);
    } finally {
      uiStore.closeMessage();
    }
  };
  const handleClickRoomDelete = () => {
    uiStore.openMessage({
      title: `${t('CM_ROOM_SETTING_BAISC_10')}\\n${t(
        'CM_ROOM_SETTING_BAISC_11',
      )}`,
      type: 'error',
      buttons: [
        {
          type: 'outlined',
          shape: 'round',
          text: t('CM_CANCEL'),
          onClick: () => {
            uiStore.closeMessage();
          },
        },
        {
          type: 'solid',
          shape: 'round',
          text: t('CM_DEL'),
          onClick: handleDeleteOk,
        },
      ],
    });
  };

  return (
    <>
      <MobileRoomSettingHeader
        title={t('CM_ROOM_SETTING')}
        handleCancel={handleCancel}
      />
      <SettingList>
        <SettingItem
          title={t('CM_CREATEROOM_PRIVATEROOM_13')}
          utile={
            <>
              <RoomName>{roomInfo?.customName || roomInfo.name}</RoomName>
              <ArrowRightIcon width="1" height="1" color="#7b7671" />
            </>
          }
          onClick={handleNameEdit}
        />
        <Observer>
          {() =>
            isOpenRoom() && (
              <SettingItem
                title={t('CM_ROOM_SETTING_BASIC_13')}
                utile={
                  <Switch
                    checked={!roomInfo.isJoinable}
                    onChange={handleJoinableChange}
                  />
                }
                subText={t('CM_ROOM_SETTING_BASIC_14')}
              />
            )
          }
        </Observer>
        {isOpenRoom() || (isPrivateRoom() && roomInfo.typeModifiedDate) ? (
          <Observer>
            {() =>
              isOpenRoom() ? (
                <SettingItem
                  title={t('CM_ROOM_SETTING_BAISC_04')}
                  onClick={handleClickModeChange}
                />
              ) : (
                <SettingItem
                  title={t('CM_ROOM_SETTING_BAISC_12')}
                  utile={convertTimeFormat(roomInfo.typeModifiedDate)}
                  color="#aeaeae"
                />
              )
            }
          </Observer>
        ) : null}
        <SettingItem
          title={t('CM_ROOM_SETTING_BAISC_08')}
          color="#dc4547"
          onClick={handleClickRoomDelete}
        />
      </SettingList>
    </>
  );
};

const SettingList = styled.ul`
  overflow-y: auto;
  height: 100%;
`;
const ItemWrap = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-bottom: 1px solid #eeedeb;
  ${props => props.onClick && 'cursor: pointer;'}
`;
const ItemTitle = styled.p`
  overflow: hidden;
  flex: 1;
  font-weight: 500;
  color: ${props => props.color};
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const UtileWrap = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: 0.375rem;
  color: #aeaeae;
`;
const RoomName = styled.span`
  margin-right: 0.625rem;
  color: #666;
`;
const ItemSubText = styled.span`
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem;
  color: #666;
`;

export default MobileRoomSetting;

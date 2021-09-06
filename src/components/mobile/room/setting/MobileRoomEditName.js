import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { transaction } from 'mobx';
import { Observer, useLocalStore } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { Button } from 'antd';
import styled from 'styled-components';
import { useStores } from '../../../../stores';
import MobileRoomSettingHeader from './MobileRoomSettingHeader';
import Input from '../../../Input';

const MobileRoomEditName = ({ roomId }) => {
  const { t } = useTranslation();
  const { roomStore } = useCoreStores();
  const { uiStore } = useStores();
  const history = useHistory();
  const roomInfo = roomStore.getRoom(roomId);

  const handleCancel = () => history.push(`/setting/${roomInfo?.id}/`);
  const localStore = useLocalStore(() => ({
    newName: roomInfo.name.substring(0, 50) || '',
    isChanged: false,
  }));

  const handleChange = text => {
    transaction(() => {
      localStore.newName = text;
      localStore.isChanged = true;
    });
  };

  const handleSave = async () => {
    try {
      const result = await roomStore.updateRoomInfo({
        roomId: roomInfo.id,
        newName: localStore.newName,
      });

      if (result) {
        localStore.isChanged = false;
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

  return (
    <>
      <MobileRoomSettingHeader
        title={t('CM_ROOM_CONTEXTMENU_CHANGENAME_01')}
        handleCancel={handleCancel}
        RightButton={
          <Observer>
            {() => (
              <Button
                type="ghost"
                disabled={!localStore.newName.length || !localStore.isChanged}
                onClick={handleSave}
              >
                {t('CM_SAVE')}
              </Button>
            )}
          </Observer>
        }
      />
      <EditNameContentn>
        <EditNameTitle>{t('CM_CREATEROOM_PRIVATEROOM_13')}</EditNameTitle>
        <Observer>
          {() => (
            <Input
              maxLength={50}
              value={localStore.newName}
              onChange={handleChange}
              placeholder={roomInfo?.oriName || roomInfo.name}
            />
          )}
        </Observer>
        <EditNameInfo>{t('CM_ROOM_SETTING_BAISC_03')}</EditNameInfo>
      </EditNameContentn>
    </>
  );
};

const EditNameContentn = styled.div`
  overflow-y: auto;
  height: 100%;
  padding: 0 1rem;
`;
const EditNameTitle = styled.p`
  margin-bottom: 0.25rem;
  font-size: 0.688rem;
  line-height: 1.125rem;
`;
const EditNameInfo = styled.span`
  display: block;
  margin-top: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #666;
`;

export default MobileRoomEditName;

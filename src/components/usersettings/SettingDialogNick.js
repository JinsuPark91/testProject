import React from 'react';
import { Button } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  EditNameInput,
  ButtonArea,
  Info,
} from '../../styles/SettingDialogStyle';

const SettingDialogNick = props => {
  const { t } = useTranslation();
  const { nick, isNickEdit, onInputChange, onCancel, onSuccess } = props;
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;

  return (
    <InnerItem>
      <Name>{t('CM_NICKNAME')}</Name>
      <Data>
        <TextArea>
          {isNickEdit ? (
            <EditNameInput
              maxLength={20}
              placeholder={myProfile.displayName}
              value={nick}
              onChange={input => {
                onInputChange(input);
              }}
            />
          ) : (
            <p>{myProfile.displayName || '-'}</p>
          )}
          <Info>{t('CM_SETTING_NICKNAME_EXPLAIN')}</Info>
        </TextArea>
        <ButtonArea>
          {isNickEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                className="color-Beige"
                disabled={myProfile.displayName === nick}
                onClick={onSuccess}
              >
                {t('CM_SAVE')}
              </Button>
              <Button size="small" type="outlined" onClick={onCancel}>
                {t('CM_CANCEL')}
              </Button>
            </>
          ) : (
            <Button size="small" type="outlined" onClick={onCancel}>
              {t('CM_CHANGE')}
            </Button>
          )}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogNick;

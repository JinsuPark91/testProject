import React from 'react';
import { Button } from 'antd';
import { Input, useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../styles/SettingDialogStyle';

const SettingDialogBirthDate = props => {
  const {
    birthDate,
    isBirthDateEdit,
    onInputChange,
    onCancel,
    onSuccess,
  } = props;
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;

  return (
    <InnerItem>
      <Name>{t('CM_DATE_BIRTH')}</Name>
      <Data>
        <TextArea>
          {isBirthDateEdit ? (
            <Input
              type="number"
              maxLength={8}
              value={birthDate}
              placeholder="YYYYMMDD"
              onChange={e => onInputChange(e.target.value)}
            />
          ) : (
            <p>{myProfile.birthDate || '-'}</p>
          )}
        </TextArea>
        <ButtonArea>
          {isBirthDateEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                className="color-Beige"
                disabled={myProfile.birthDate === birthDate}
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

export default SettingDialogBirthDate;

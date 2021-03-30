import React from 'react';
import { Button } from 'antd';
import { Input, useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { getMobileNumber } from '../../utils/ProfileUtil';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../styles/SettingDialogStyle';

const SettingDialogPhone = props => {
  const { t } = useTranslation();
  const { phone, isPhoneEdit, onInputChange, onCancel, onSuccess } = props;
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;

  return (
    <InnerItem>
      <Name>{t('CM_MOBILE_NUMBER')}</Name>
      <Data>
        <TextArea>
          {isPhoneEdit ? (
            <Input
              type="number"
              value={phone}
              onChange={e => onInputChange(e.target.value)}
            />
          ) : (
            <p>{getMobileNumber(myProfile)}</p>
          )}
        </TextArea>
        <ButtonArea>
          {isPhoneEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                className="color-Beige"
                disabled={myProfile.phone === phone}
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

export default SettingDialogPhone;

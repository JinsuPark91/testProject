import React from 'react';
import { Button } from 'antd';
import { Input, useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { getCompanyNumber } from '../../utils/ProfileUtil';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../styles/SettingDialogStyle';

const SettingDialogCompanyNum = props => {
  const {
    companyNum,
    isCompanyNumEdit,
    onInputChange,
    onCancel,
    onSuccess,
  } = props;
  const { t } = useTranslation();
  const { authStore } = useCoreStores();

  return (
    <InnerItem>
      <Name>{t('CM_B2B_SETTING_CHANGE_INFO_50')}</Name>
      <Data>
        <TextArea>
          {isCompanyNumEdit ? (
            <Input
              type="number"
              value={companyNum}
              onChange={e => onInputChange(e.target.value)}
            />
          ) : (
            <p>{getCompanyNumber(authStore.user)}</p>
          )}
        </TextArea>
        <ButtonArea>
          {isCompanyNumEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                className="color-Beige"
                disabled={authStore.user.companyNum === companyNum}
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

export default SettingDialogCompanyNum;

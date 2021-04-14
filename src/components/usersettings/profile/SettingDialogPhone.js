import React, { useState } from 'react';
import { Button } from 'antd';
import { Input, useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { getMobileNumber, getProfileEditDto } from '../../../utils/ProfileUtil';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../../styles/usersettings/SettingDialogStyle';

const SettingDialogPhone = () => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;
  const [phone, setPhone] = useState(myProfile.phone);
  const [isPhoneEdit, setIsPhoneEdit] = useState(false);

  const handleChangePhone = async () => {
    const updateInfo = getProfileEditDto({ phone });
    try {
      await userStore.updateMyProfile(updateInfo);
      setIsPhoneEdit(false);
    } catch (e) {
      console.log(`changeCellPhone Error is ${e}`);
    }
  };
  const handleCancelChange = () => {
    setIsPhoneEdit(false);
    setPhone(myProfile.phone);
  };

  return (
    <InnerItem>
      <Name>{t('CM_MOBILE_NUMBER')}</Name>
      <Data>
        <TextArea>
          {isPhoneEdit ? (
            <Input
              type="number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
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
                disabled={myProfile.phone === phone}
                onClick={handleChangePhone}
              >
                {t('CM_SAVE')}
              </Button>
              <Button size="small" type="outlined" onClick={handleCancelChange}>
                {t('CM_CANCEL')}
              </Button>
            </>
          ) : (
            <Button
              size="small"
              type="outlined"
              onClick={() => setIsPhoneEdit(true)}
            >
              {t('CM_CHANGE')}
            </Button>
          )}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogPhone;

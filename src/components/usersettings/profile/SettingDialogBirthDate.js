import React, { useState } from 'react';
import { Button } from 'antd';
import { Input, useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { getProfileEditDto } from '../../../utils/ProfileUtil';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../../styles/usersettings/SettingDialogStyle';

const SettingDialogBirthDate = () => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;
  const [birthDate, setBirthDate] = useState(myProfile.birthDate);
  const [isBirthDateEdit, setIsBirthDateEdit] = useState(false);

  const handleChangeBirthDate = async () => {
    const updateInfo = getProfileEditDto({ birthDate });
    try {
      await userStore.updateMyProfile(updateInfo);
      setIsBirthDateEdit(false);
    } catch (e) {
      console.log(`changeBirthDay Error is ${e}`);
    }
  };
  const handleCancelChange = () => {
    setIsBirthDateEdit(false);
    setBirthDate(myProfile.phone);
  };

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
              onChange={e => setBirthDate(e.target.value)}
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
                disabled={myProfile.birthDate === birthDate}
                onClick={handleChangeBirthDate}
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
              onClick={() => setIsBirthDateEdit(true)}
            >
              {t('CM_CHANGE')}
            </Button>
          )}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogBirthDate;

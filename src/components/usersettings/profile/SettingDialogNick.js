import React, { useState } from 'react';
import { Button } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { getProfileEditDto } from '../../../utils/ProfileUtil';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  EditNameInput,
  ButtonArea,
  Info,
} from '../../../styles/usersettings/SettingDialogStyle';

const SettingDialogNick = () => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;
  const [nick, setNick] = useState(myProfile.displayName);
  const [isNickEdit, setIsNickEdit] = useState(false);

  const handleChangeNick = async () => {
    const updateInfo = getProfileEditDto({ nick });
    try {
      await userStore.updateMyProfile(updateInfo);
      setIsNickEdit(false);
    } catch (e) {
      console.log(`changeName Error is ${e}`);
    }
  };
  const handleCancelChange = () => {
    setIsNickEdit(false);
    setNick(myProfile.displayName);
  };

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
                setNick(input);
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
                onClick={handleChangeNick}
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
              onClick={() => setIsNickEdit(true)}
            >
              {t('CM_CHANGE')}
            </Button>
          )}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogNick;

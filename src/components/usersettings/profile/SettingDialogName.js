import React, { useState } from 'react';
import { Button } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { updateMyProfile } from '../../../utils/ProfileUtil';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  EditNameInput,
  ButtonArea,
} from '../../../styles/usersettings/SettingDialogStyle';

const SettingDialogName = () => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;
  const [name, setName] = useState(myProfile.name);
  const [isNameEdit, setIsNameEdit] = useState(false);

  const handleChangeName = async () => {
    try {
      await updateMyProfile({ name });
      setIsNameEdit(false);
    } catch (e) {
      console.log(`changeName Error is ${e}`);
    }
  };
  const handleCancelChange = () => {
    setIsNameEdit(false);
    setName(myProfile.name);
  };

  return (
    <InnerItem>
      <Name>{t('CM_NAME')}</Name>
      <Data>
        <TextArea>
          {isNameEdit ? (
            <EditNameInput
              maxLength={20}
              placeholder={myProfile.name}
              value={name}
              onChange={input => {
                setName(input);
              }}
            />
          ) : (
            <p>{myProfile.name || '-'}</p>
          )}
        </TextArea>
        <ButtonArea>
          {isNameEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                disabled={myProfile.name === name}
                onClick={handleChangeName}
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
              onClick={() => setIsNameEdit(true)}
            >
              {t('CM_CHANGE')}
            </Button>
          )}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogName;

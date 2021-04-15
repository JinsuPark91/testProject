import React, { useState } from 'react';
import { Button } from 'antd';
import { Input, useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { getCompanyNumber, updateMyProfile } from '../../../utils/ProfileUtil';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  ButtonArea,
} from '../../../styles/usersettings/SettingDialogStyle';

const SettingDialogCompanyNum = () => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;
  const [companyNum, setCompanyNum] = useState(myProfile.companyNum);
  const [isCompanyNumEdit, setIsCompanyNumEdit] = useState(false);

  const handleChangeCompanyNum = async () => {
    try {
      await updateMyProfile({ companyNum });
      setIsCompanyNumEdit(false);
    } catch (e) {
      console.log(`changeCompanyPhone Error is ${e}`);
    }
  };
  const handleCancelChange = () => {
    setIsCompanyNumEdit(false);
    setCompanyNum(myProfile.companyNum);
  };

  return (
    <InnerItem>
      <Name>{t('CM_B2B_SETTING_CHANGE_INFO_50')}</Name>
      <Data>
        <TextArea>
          {isCompanyNumEdit ? (
            <Input
              type="number"
              value={companyNum}
              onChange={e => setCompanyNum(e.target.value)}
            />
          ) : (
            <p>{getCompanyNumber(myProfile)}</p>
          )}
        </TextArea>
        <ButtonArea>
          {isCompanyNumEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                disabled={myProfile.companyNum === companyNum}
                onClick={handleChangeCompanyNum}
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
              onClick={() => setIsCompanyNumEdit(true)}
            >
              {t('CM_CHANGE')}
            </Button>
          )}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogCompanyNum;

import React, { useState } from 'react';
import { useCoreStores } from 'teespace-core';
import { Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ContentItem,
  ItemTitle,
  ItemInfo,
} from '../../../styles/usersettings/ContentAccountStyle';

const AccountAdvertise = () => {
  const { t } = useTranslation();
  const { userStore } = useCoreStores();
  const myDomainData = userStore.myDomainSetting;

  const [advertise, setAdvertise] = useState(myDomainData.isTermAd);

  const handleChangeAdvertise = async e => {
    const targetValue = e.target.value;
    try {
      await userStore.updateMyDomainSetting({
        isTermAd: targetValue,
        isTermPersonalOpt: targetValue,
      });
      setAdvertise(targetValue);
    } catch (error) {
      console.log(`changeName Error is ${error}`);
    }
  };

  return (
    <ContentItem>
      <ItemTitle>{t('CM_ADVERTISE_AGREE_POLICY')}</ItemTitle>
      <ItemInfo>
        <Radio.Group onChange={handleChangeAdvertise} value={advertise}>
          <Radio value> {t('CM_AGREE_BUTTON_01')}</Radio>
          <Radio value={false}> {t('CM_AGREE_BUTTON_02')}</Radio>
        </Radio.Group>
      </ItemInfo>
    </ContentItem>
  );
};

export default React.memo(AccountAdvertise);

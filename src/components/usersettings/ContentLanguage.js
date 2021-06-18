import React from 'react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import ContentTitle from './ContentTitle';
import { getLanguage } from '../../utils/GeneralUtil';

const SelectWrapper = styled.div`
  margin-left: 1.25rem;
`;

const ContentLanguage = () => {
  const { t, i18n } = useTranslation();
  const { userStore } = useCoreStores();
  const { Option } = Select;

  const languageArray = [
    { text: t('CM_KOREAN'), key: 'ko' },
    { text: t('CM_ENGLISH'), key: 'en' },
  ];

  const defaultLang = getLanguage()?.includes('ko')
    ? t('CM_KOREAN')
    : t('CM_ENGLISH');

  const handleChange = async language => {
    const result = await userStore.updateMyDomainSetting({ language });
    if (result) {
      i18n.changeLanguage(language).then((t, err) => {
        if (err) return console.log(`error is..${err}`);
      });
    }
  };

  return (
    <>
      <ContentTitle
        title={t('CM_SETTING_GENERAL_04')}
        subTitle={t('CM_SETTING_GENERAL_05')}
        divider={false}
      />
      <SelectWrapper>
        <Select
          defaultValue={defaultLang}
          style={{ width: '10rem' }}
          onChange={handleChange}
        >
          {languageArray.map(elem => (
            <Option key={elem.key} value={elem.key}>
              {elem.text}
            </Option>
          ))}
        </Select>
      </SelectWrapper>
    </>
  );
};

export default ContentLanguage;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio } from 'antd';
import { useCoreStores } from 'teespace-core';
import ContentTitle from './ContentTitle';
import { isDarkMode } from '../../utils/GeneralUtil';
import SystemTheme from '../../assets/theme_system.svg';
import LightTheme from '../../assets/theme_light.svg';
import DarkTheme from '../../assets/theme_dark.svg';
import {
  Wrapper,
  ThemeList,
  ThemeItem,
  ThemeImage,
  ThemeThumb,
  SystemText,
} from '../../styles/usersettings/ContentThemeStyle';

const ContentTheme = () => {
  const { t } = useTranslation();
  const { userStore, themeStore } = useCoreStores();
  const [value, setValue] = useState(
    userStore.myDomainSetting.theme || 'system',
  );

  const handleChange = e => {
    const targetValue = e.target.value;
    if (targetValue !== 'system') {
      userStore.updateMyDomainSetting({
        theme: targetValue,
      });
      themeStore.setTheme(targetValue);
    } else {
      userStore.updateMyDomainSetting({
        theme: 'system',
      });
      if (isDarkMode()) themeStore.setTheme('dark');
      else themeStore.setTheme('white');
    }
    setValue(targetValue);
  };

  return (
    <>
      <ContentTitle
        title={t('CM_SETTING_GENERAL_01')}
        subTitle={t('CM_SETTING_GENERAL_02')}
        divider={false}
      />
      <Wrapper>
        <Radio.Group onChange={handleChange} value={value}>
          <ThemeList>
            <ThemeItem>
              <ThemeImage>
                <ThemeThumb alt="systemTheme" src={SystemTheme} />
              </ThemeImage>
              <Radio value="system">{t('CM_SETTING_09')}</Radio>
              <SystemText>{t('CM_SETTING_10')}</SystemText>
            </ThemeItem>
            <ThemeItem>
              <ThemeImage>
                <ThemeThumb alt="lightTheme" src={LightTheme} />
              </ThemeImage>
              <Radio value="white">{t('CM_SETTING_11')}</Radio>
            </ThemeItem>
            <ThemeItem>
              <ThemeImage>
                <ThemeThumb alt="darkTheme" src={DarkTheme} />
              </ThemeImage>
              <Radio value="dark">{t('CM_SETTING_12')}</Radio>
            </ThemeItem>
          </ThemeList>
        </Radio.Group>
      </Wrapper>
    </>
  );
};

export default ContentTheme;

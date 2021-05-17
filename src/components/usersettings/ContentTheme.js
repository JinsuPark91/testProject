import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio } from 'antd';
import { useStores } from '../../stores';
import ContentTitle from './ContentTitle';
import SystemTheme from '../../assets/theme_system.svg';
import LightTheme from '../../assets/theme_light.svg';
import DarkTheme from '../../assets/theme_dark.svg';
import {
  Wrapper,
  ThemeList,
  ThemeItem,
  ThemeImage,
  ThemeThumb,
} from '../../styles/usersettings/ContentThemeStyle';

const ContentTheme = () => {
  const { t } = useTranslation();
  const { uiStore } = useStores();
  const [value, setValue] = useState(uiStore.theme?.name);

  const handleChange = e => {
    const targetValue = e.target.value;
    uiStore.setTheme(targetValue);
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
              <Radio value="system">{t('CM_SETTING_09')}</Radio>
              <ThemeImage>
                <ThemeThumb alt="systemTheme" src={SystemTheme} />
              </ThemeImage>
            </ThemeItem>
            <ThemeItem>
              <Radio value="white">{t('CM_SETTING_11')}</Radio>
              <ThemeImage>
                <ThemeThumb alt="lightTheme" src={LightTheme} />
              </ThemeImage>
            </ThemeItem>
            <ThemeItem>
              <Radio value="dark">{t('CM_SETTING_12')}</Radio>
              <ThemeImage>
                <ThemeThumb alt="darkTheme" src={DarkTheme} />
              </ThemeImage>
            </ThemeItem>
          </ThemeList>
        </Radio.Group>
      </Wrapper>
    </>
  );
};

export default ContentTheme;

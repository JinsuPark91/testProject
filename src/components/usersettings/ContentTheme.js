import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio } from 'antd';
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
  const [value, setValue] = useState(1);

  const handleChange = e => {
    setValue(e.target.value);
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
              <Radio value={1}>{t('CM_SETTING_09')}</Radio>
              <ThemeImage>
                <ThemeThumb alt="systemTheme" src={SystemTheme} />
              </ThemeImage>
            </ThemeItem>
            <ThemeItem>
              <Radio value={2}>{t('CM_SETTING_11')}</Radio>
              <ThemeImage>
                <ThemeThumb alt="lightTheme" src={LightTheme} />
              </ThemeImage>
            </ThemeItem>
            <ThemeItem>
              <Radio value={3}>{t('CM_SETTING_12')}</Radio>
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

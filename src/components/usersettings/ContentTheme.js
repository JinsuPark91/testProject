import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  RadioWrap,
  RadioBox,
  RadioCircle,
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

  const ThemeRadio = ({ imgSrc, RadioValue, text }) => {
    const checked = value === RadioValue;

    return (
      <RadioWrap htmlFor={RadioValue} checked={checked}>
        <ThemeImage>
          <ThemeThumb alt={`${RadioValue}Theme`} src={imgSrc} />
        </ThemeImage>
        <RadioBox>
          <input
            id={RadioValue}
            type="radio"
            name="theme"
            value={RadioValue}
            checked={checked}
            readOnly
          />
          <RadioCircle />
          <span>{text}</span>
        </RadioBox>
      </RadioWrap>
    );
  };

  return (
    <>
      <ContentTitle
        title={t('CM_SETTING_GENERAL_01')}
        subTitle={t('CM_SETTING_GENERAL_02')}
        divider={false}
      />
      <Wrapper>
        <ThemeList onChange={handleChange}>
          <ThemeItem>
            <ThemeRadio
              imgSrc={SystemTheme}
              RadioValue="system"
              text={t('CM_SETTING_09')}
            />
            <SystemText>{t('CM_SETTING_10')}</SystemText>
          </ThemeItem>
          <ThemeItem>
            <ThemeRadio
              imgSrc={LightTheme}
              RadioValue="white"
              text={t('CM_SETTING_11')}
            />
          </ThemeItem>
          <ThemeItem>
            <ThemeRadio
              imgSrc={DarkTheme}
              RadioValue="dark"
              text={t('CM_SETTING_12')}
            />
          </ThemeItem>
        </ThemeList>
      </Wrapper>
    </>
  );
};

export default ContentTheme;

import React, { useState } from 'react';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCoreStores } from 'teespace-core';
import { SELECTED_TAB } from './SettingConstants';
import {
  ContentLanguage,
  ContentTheme,
  ContentProfile,
  ContentAlarm,
  ContentSpaceSecession,
  SettingSave,
  ContentAccount,
} from './index';
import { isB2B, isSpaceAdmin } from '../../utils/GeneralUtil';
import {
  DialogWrap,
  LayoutWrap,
  SiderArea,
  ContentArea,
  StyledMenu,
} from '../../styles/usersettings/SettingDialogStyle';

const SettingDialog = ({ visible, onCancel }) => {
  const { t } = useTranslation();
  const { configStore } = useCoreStores();

  const [selectedKey, setSelectedKey] = useState(SELECTED_TAB.PROFILE);
  const [isSecession, setIsSecession] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  const handleCancel = () => {
    setSelectedKey(SELECTED_TAB.ALARM);
    onCancel();
  };

  const handleTabClick = key => {
    if (selectedKey === SELECTED_TAB.SECESSION && isSecession) {
      setIsSecession(false);
      setInputPassword('');
    }
    setSelectedKey(key);
  };

  const getSettingContent = targetKey => {
    switch (targetKey) {
      case SELECTED_TAB.LANGUAGE:
        return <ContentLanguage />;
      case SELECTED_TAB.THEME:
        return <ContentTheme />;
      case SELECTED_TAB.PROFILE:
        return <ContentProfile />;
      case SELECTED_TAB.ALARM:
        return <ContentAlarm />;
      case SELECTED_TAB.SECESSION:
        return (
          <ContentSpaceSecession
            isSecession={isSecession}
            toggleSecession={() => setIsSecession(true)}
            onInputChange={input => setInputPassword(input)}
          />
        );
      case SELECTED_TAB.ACCOUNT:
        return <ContentAccount />;
      default:
        return null;
    }
  };

  return (
    <DialogWrap
      onCancel={handleCancel}
      visible={visible}
      centered
      width="59.38rem"
      title={t('CM_SETTING')}
      style={{ minWidth: '50rem' }}
      footer={
        isSecession ? (
          <SettingSave
            onCancel={() => setIsSecession(false)}
            inputPassword={inputPassword}
          />
        ) : (
          <></>
        )
      }
    >
      <LayoutWrap>
        <SiderArea>
          <StyledMenu
            selectedKeys={selectedKey}
            onClick={({ item, key }) => handleTabClick(key)}
          >
            <Menu.ItemGroup key="0" title={t('CM_SETTING_06')}>
              <Menu.Item key="7">계정 정보</Menu.Item>
              <Menu.Item key="1">{t('CM_SETTING_GENERAL_04')}</Menu.Item>
              <Menu.Item key="2">{t('CM_SETTING_GENERAL_01')}</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="3" title={t('CM_SETTING_08')}>
              <Menu.Item key="4">{t('CM_ROOMTITLE_TOOLTIP_04')}</Menu.Item>
              <Menu.Item key="5">{t('CM_NOTI')}</Menu.Item>
              {!isSpaceAdmin() &&
                !isB2B() &&
                configStore.isActivateComponent(
                  'Platform',
                  'SpaceSecession',
                ) && (
                  <Menu.Item key="6">
                    {t('CM_SETTING_DELETE_SPACE_01')}
                  </Menu.Item>
                )}
            </Menu.ItemGroup>
          </StyledMenu>
        </SiderArea>
        <ContentArea>{getSettingContent(selectedKey)}</ContentArea>
      </LayoutWrap>
    </DialogWrap>
  );
};

export default SettingDialog;

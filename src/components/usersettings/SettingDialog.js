import React, { useState } from 'react';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCoreStores } from 'teespace-core';
import { SELECTED_TAB } from './SettingConstants';
import {
  ContentCommon,
  ContentAlarm,
  ContentProfile,
  ContentSpaceSecession,
  SettingSave,
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
  const [selectedKey, setSelectedKey] = useState(SELECTED_TAB.ALARM);

  // 스페이스 탈퇴 관련
  const [isSecession, setIsSecession] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  const { configStore } = useCoreStores();

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
      case SELECTED_TAB.GENERAL:
        return <ContentCommon />;
      case SELECTED_TAB.ALARM:
        return <ContentAlarm />;
      case SELECTED_TAB.MY_INFO:
        return <ContentProfile />;
      case SELECTED_TAB.SECESSION:
        return (
          <ContentSpaceSecession
            isSecession={isSecession}
            toggleSecession={() => setIsSecession(true)}
            onInputChange={input => setInputPassword(input)}
          />
        );
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
      style={{ top: 15, minWidth: '50rem' }}
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
            defaultSelectedKeys={['2']}
            selectedKeys={selectedKey}
            onClick={({ item, key }) => {
              handleTabClick(key);
            }}
          >
            <Menu.ItemGroup key="0" title={t('CM_SETTING_02')}>
              {/* <Menu.Item key="1">일반</Menu.Item> */}
              <Menu.Item key="2">{t('CM_NOTI')}</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="3" title={t('CM_SETTING_05')}>
              <Menu.Item key="4">{t('CM_MY_INFO_06')}</Menu.Item>
              {!isSpaceAdmin() &&
                !isB2B() &&
                configStore.isActivateComponent(
                  'Platform',
                  'SpaceSecession',
                ) && (
                  <Menu.Item key="7">
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

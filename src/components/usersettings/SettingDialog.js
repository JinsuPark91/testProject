import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import { Modal, Menu } from 'antd';
import { useCoreStores, Form } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ContentAlarm from './ContentAlarm';
import ContentTitle from './ContentTitle';
import SettingDialogPhoto from './SetttingDialogPhoto';
import SettingDialogName from './SettingDialogName';
import SettingDialogNick from './SettingDialogNick';
import SettingDialogOrg from './SettingDialogOrg';
import SettingDialogCountryCode from './SettingDialogCountryCode';
import SettingDialogCompanyNum from './SettingDialogCompanyNum';
import SettingDialogPhone from './SettingDialogPhone';
import SettingDialogBirthDate from './SettingDialogBirthDate';
import ContentSpaceSecession from './ContentSpaceSecession';
import Contentcommon from './Contentcommon';
import Settingsave from './Settingsave';
import TermsFooter from '../login/TermsFooter';
import { SELECTED_TAB } from './SettingConstants';

const DialogWrap = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-footer {
    padding: 0.64rem 0 0.2rem;
  }
`;

const LayoutWrap = styled.div`
  display: flex;
`;

const SiderArea = styled.div`
  width: 10.94rem;
  background-color: #f7f4ef;
  border-right: 1px solid #e3e7eb;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  height: 73vh;
  padding: 1.25rem 1.25rem 3.125rem;
`;

const StyledMenu = styled(Menu)`
  padding-top: 0.75rem;
  background-color: #f7f4ef;
  border: 0;
  .ant-menu-item-group {
    & + .ant-menu-item-group:before {
      content: '';
      display: block;
      height: 1px;
      margin: 0.63rem 0.63rem 0;
      background-color: #e3e7eb;
    }
  }
  .ant-menu-item-group-title {
    padding: 0.44rem 1.5rem 0.81rem;
    font-size: 0.75rem;
    line-height: 1.125rem;
    color: #717171;
  }
  .ant-menu-item {
    margin: 0 !important;
    height: 2.38rem;
    margin: 0 0.25rem !important;
    padding: 0 2.25rem;
    border-radius: 0.25rem;
    font-size: 0.81rem;
    line-height: 2.38rem;
    background-color: #f7f4ef;
    color: #000;
    &.ant-menu-item-selected {
      background-color: #ddd7cd;
    }
  }
`;
// &:hover {
//   background-color: #f2efec;
// }

const InnerList = styled.ul`
  margin-top: 1.56rem;
  font-size: 0.81rem;
  color: #000;
  .ant-btn {
    color: #000;
  }
  .antd-btn-outlined:focus {
    color: #000;
  }
`;

function SettingDialog(props) {
  const { t } = useTranslation();
  const { userStore, authStore } = useCoreStores();
  const { selectedKeyA, visible, onCancel } = props;
  const [selectedKey, setSelectedKey] = useState(selectedKeyA);
  const [settingform] = Form.useForm();
  const form = useRef(settingform);
  const [buttonFooter, setbuttonFooter] = useState(
    selectedKey === '6' || selectedKey === true,
  );

  // 내 정보 변경 관련
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [isNickEdit, setIsNickEdit] = useState(false);
  const [isCountryCodeEdit, setIsCountryCodeEdit] = useState(false);
  const [isCompanyNumEdit, setIsCompanyNumEdit] = useState(false);
  const [isPhoneEdit, setIsPhoneEdit] = useState(false);
  const [isBirthDateEdit, setIsBirthDateEdit] = useState(false);

  const [name, setName] = useState(undefined);
  const [nick, setNick] = useState(undefined);
  const [companyNum, setCompanyNum] = useState(undefined);
  const [phone, setPhone] = useState(undefined);
  const [birthDate, setBirthDate] = useState(undefined);

  // 스페이스 탈퇴 관련
  const [isSecessionContinue, setIsSecessionContinue] = useState(false);
  const [checked, setChecked] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  const isB2B = userStore.myProfile.type === 'USR0001';
  const isAdmin = userStore.myProfile.grade === 'admin';

  // FIXME: 급하게 추가했지만 추후에 settingprofilephoto,
  // settingprofilecountrycode 에 있는 함수와 합치는 작업 필요
  const getDtoObject = useCallback(() => {
    const obj = {};
    obj.profilePhoto = userStore.getProfilePhotoURL(
      userStore.myProfile.id,
      'medium',
    );
    obj.profileFile = null;
    obj.profileName = null;
    obj.backPhoto = userStore.getBackgroundPhotoURL(userStore.myProfile.id);
    obj.backFile = null;
    obj.backName = null;
    obj.name = name ?? userStore.myProfile.name;
    // 별명 빈칸 변경 시도시 이름으로 변경하는 기획
    if (nick === undefined) {
      obj.nick = userStore.myProfile.nick || userStore.myProfile.name;
    } else if (nick === '') {
      obj.nick = userStore.myProfile.name;
    } else {
      obj.nick = nick;
    }
    obj.nationalCode = userStore.myProfile.nationalCode;
    obj.companyNum = companyNum ?? userStore.myProfile.companyNum;
    obj.phone = phone ?? userStore.myProfile.phone;
    obj.birthDate = birthDate ?? userStore.myProfile.birthDate;
    return obj;
  }, [name, nick, companyNum, phone, birthDate, userStore]);

  const handleToggleNameInput = useCallback(() => {
    setIsNameEdit(!isNameEdit);
    setName(authStore.user.name);
  }, [isNameEdit, authStore]);

  const handleToggleNickInput = useCallback(() => {
    setIsNickEdit(!isNickEdit);
    setNick(authStore.user.nick);
  }, [isNickEdit, authStore]);

  const handleToggleCountryCode = useCallback(() => {
    setIsCountryCodeEdit(!isCountryCodeEdit);
  }, [isCountryCodeEdit]);

  const handleToggleCompanyNumInput = useCallback(() => {
    setIsCompanyNumEdit(!isCompanyNumEdit);
    setCompanyNum(authStore.user.companyNum);
  }, [isCompanyNumEdit, authStore]);

  const handleTogglePhoneInput = useCallback(() => {
    setIsPhoneEdit(!isPhoneEdit);
    setPhone(authStore.user.phone);
  }, [isPhoneEdit, authStore]);

  const handleToggleBirthDateInput = useCallback(() => {
    setIsBirthDateEdit(!isBirthDateEdit);
    setBirthDate(authStore.user.birthDate);
  }, [isBirthDateEdit, authStore]);

  const handleChangeName = useCallback(async () => {
    const updateInfo = getDtoObject();
    try {
      await userStore.updateMyProfile(updateInfo);
      setIsNameEdit(false);
    } catch (e) {
      console.log(`changeName Error is ${e}`);
    }
  }, [getDtoObject, userStore]);

  const handleChangeNick = useCallback(async () => {
    const updateInfo = getDtoObject();
    try {
      await userStore.updateMyProfile(updateInfo);
      setIsNickEdit(false);
    } catch (e) {
      console.log(`changeNick Error is ${e}`);
    }
  }, [getDtoObject, userStore]);

  const handleChangeCountryCode = useCallback(async () => {
    handleToggleCountryCode();
  }, [handleToggleCountryCode]);

  const handleChangeCompanyNum = useCallback(async () => {
    const updateInfo = getDtoObject();
    try {
      await userStore.updateMyProfile(updateInfo);
      setIsCompanyNumEdit(false);
    } catch (e) {
      console.log(`changeCompanyPhone Error is ${e}`);
    }
  }, [getDtoObject, userStore]);

  const handleChangePhone = useCallback(async () => {
    const updateInfo = getDtoObject();
    try {
      await userStore.updateMyProfile(updateInfo);
      setIsPhoneEdit(false);
    } catch (e) {
      console.log(`changeCellPhone Error is ${e}`);
    }
  }, [getDtoObject, userStore]);

  const handleChangeBirthDate = useCallback(async () => {
    const updateInfo = getDtoObject();
    try {
      await userStore.updateMyProfile(updateInfo);
      setIsBirthDateEdit(false);
    } catch (e) {
      console.log(`changeBirthDay Error is ${e}`);
    }
  }, [getDtoObject, userStore]);

  const handleToggleContinue = () => {
    setIsSecessionContinue(!isSecessionContinue);
    setbuttonFooter(true);
  };

  const handleToggleCheck = () => {
    setChecked(!checked);
  };

  const handleInputPassword = input => {
    setInputPassword(input);
  };

  useEffect(() => {
    setbuttonFooter(selectedKey === '6' || selectedKey === true);
  }, [selectedKey]);

  useEffect(() => {
    setSelectedKey(selectedKeyA);
  }, [selectedKeyA]);

  const handleSecessionButton = type => {
    setbuttonFooter(type);
  };

  const handleInitializeAccountButton = () => {
    setIsNameEdit(false);
    setIsNickEdit(false);
    setIsCountryCodeEdit(false);
    setIsCompanyNumEdit(false);
    setIsPhoneEdit(false);
    setIsBirthDateEdit(false);
  };

  const handleInitializeSecessionButton = () => {
    setIsSecessionContinue(false);
    setChecked(false);
    setInputPassword('');
  };

  const handleTabClick = key => {
    setSelectedKey(key);
    if (key !== SELECTED_TAB.MY_INFO) {
      handleInitializeAccountButton();
    } else if (key !== SELECTED_TAB.SECESSION) {
      handleInitializeSecessionButton();
    }
  };

  const handleCancel = () => {
    setSelectedKey(SELECTED_TAB.ALARM);
    handleInitializeAccountButton();
    handleInitializeSecessionButton();
    onCancel();
  };

  return useObserver(() => (
    <DialogWrap
      onCancel={handleCancel}
      visible={visible}
      centered
      width="59.38rem"
      title={t('CM_SETTING')}
      style={{ top: 20, minWidth: '50rem' }}
      footer={
        buttonFooter ? (
          <Settingsave
            form={form}
            selectedKey={selectedKey}
            isContinue={isSecessionContinue}
            toggleContinue={handleToggleContinue}
            toggleFooter={handleSecessionButton}
            toggleCheck={handleToggleCheck}
            inputPassword={inputPassword}
          />
        ) : (
          <TermsFooter />
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
              {!isAdmin && !isB2B && (
                <Menu.Item key="7">{t('CM_SETTING_DELETE_SPACE_01')}</Menu.Item>
              )}
            </Menu.ItemGroup>
          </StyledMenu>
        </SiderArea>
        <ContentArea>
          {selectedKey === '1' && <Contentcommon />}
          {selectedKey === '2' && <ContentAlarm form={form} />}
          {/* {selectedKey === '3' && (
            <SettingContentaccountedit
              onChange={() => setbuttonFooter(true)}
              form={form}
              footonChange={() => setbuttonFooter(false)}
              onClick={() => setSelectedKey('2')}
            />
          )} */}
          {selectedKey === '4' && (
            <>
              <ContentTitle
                title={t('CM_MY_INFO_06')}
                subTitle={t('CM_SPACE_EDIT_PROFILE_02')}
              />
              <InnerList>
                <SettingDialogPhoto />
                <SettingDialogName
                  name={name}
                  isNameEdit={isNameEdit}
                  onInputChange={input => setName(input)}
                  onCancel={handleToggleNameInput}
                  onSuccess={handleChangeName}
                />
                <SettingDialogNick
                  nick={nick}
                  isNickEdit={isNickEdit}
                  onInputChange={input => setNick(input)}
                  onCancel={handleToggleNickInput}
                  onSuccess={handleChangeNick}
                />
                {isB2B && <SettingDialogOrg />}
                <SettingDialogCountryCode
                  isCountryCodeEdit={isCountryCodeEdit}
                  onCancel={handleToggleCountryCode}
                  onSuccess={handleChangeCountryCode}
                />
                {isB2B && (
                  <SettingDialogCompanyNum
                    companyNum={companyNum}
                    isCompanyNumEdit={isCompanyNumEdit}
                    onInputChange={input => setCompanyNum(input)}
                    onCancel={handleToggleCompanyNumInput}
                    onSuccess={handleChangeCompanyNum}
                  />
                )}
                <SettingDialogPhone
                  phone={phone}
                  isPhoneEdit={isPhoneEdit}
                  onInputChange={input => setPhone(input)}
                  onCancel={handleTogglePhoneInput}
                  onSuccess={handleChangePhone}
                />
                <SettingDialogBirthDate
                  birthDate={birthDate}
                  isBirthDateEdit={isBirthDateEdit}
                  onInputChange={input => setBirthDate(input)}
                  onCancel={handleToggleBirthDateInput}
                  onSuccess={handleChangeBirthDate}
                />
              </InnerList>
            </>
          )}
          {selectedKey === '7' && (
            <ContentSpaceSecession
              isContinue={isSecessionContinue}
              toggleContinue={handleToggleContinue}
              isCheck={checked}
              toggleCheck={handleToggleCheck}
              handleInputPassword={handleInputPassword}
            />
          )}
        </ContentArea>
      </LayoutWrap>
    </DialogWrap>
  ));
}

export default SettingDialog;

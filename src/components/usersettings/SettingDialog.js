import React, { useState, useEffect, useRef } from 'react';
import { useObserver } from 'mobx-react';
import { Modal, Menu } from 'antd';
import { Form } from 'teespace-core';
import styled from 'styled-components';
import ContentAlarm from './ContentAlarm';
import ContentAccount from './ContentAccount';
import ContentSpaceSecession from './ContentSpaceSecession';
import Contentcommon from './Contentcommon';
import Contentpassword from './Contentpassword';

import SettingContentpasswordedit from './SettingContentpasswordedit';
import Settingsave from './Settingsave';
import { useStore } from '../../stores';
import TermsFooter from '../login/TermsFooter';

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
  background-color: #f5f5fb;
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
  background-color: #f5f5fb;
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
    padding: 0 2.5rem;
    border-radius: 1.19rem;
    font-size: 0.81rem;
    line-height: 2.38rem;
    color: #000;
    &:hover {
      background-color: #eaeafb;
    }
    &.ant-menu-item-selected {
      background-color: #dcddff;
    }
  }
`;

function SettingDialog(props) {
  const { selectedKeyA, visible, onCancel } = props;
  const [selectedKey, setSelectedKey] = useState(selectedKeyA);
  const [settingform] = Form.useForm();
  const form = useRef(settingform);
  const [buttonFooter, setbuttonFooter] = useState(
    selectedKey === '6' || selectedKey === true,
  );
  const [isSecessionContinue, setIsSecessionContinue] = useState(false);
  const [checked, setChecked] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

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

  return useObserver(() => (
    <DialogWrap
      onCancel={onCancel}
      visible={visible}
      width="46.88rem"
      title="설정"
      style={{ top: 20, minWidth: '50rem' }}
      footer={
        buttonFooter ? (
          <Settingsave
            form={form}
            selectedKey={selectedKey}
            saveaccountOut={() => setSelectedKey('4')}
            savepasswordOut={() => setSelectedKey('5')}
            saveaccountChange={() => setSelectedKey('4')}
            savepasswordChange={() => setSelectedKey('5')}
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
            defaultSelectedKeys={['3']}
            onClick={({ item, key }) => {
              setSelectedKey(key);
              if (key !== '7') {
                setIsSecessionContinue(false);
                setChecked(false);
                setInputPassword('');
              }
            }}
          >
            <Menu.ItemGroup key="0" title="환경설정">
              {/* <Menu.Item key="1">일반</Menu.Item> */}
              {/* <Menu.Item key="2">알림</Menu.Item> */}
            </Menu.ItemGroup>
            <Menu.ItemGroup key="3" title="계정설정">
              <Menu.Item key="4">내 정보</Menu.Item>
              {/* <Menu.Item key="5">비밀번호변경</Menu.Item> */}
              <Menu.Item key="7">서비스 탈퇴</Menu.Item>
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
            <ContentAccount onClick={() => setSelectedKey('3')} />
          )}
          {selectedKey === '5' && (
            <Contentpassword onClick={() => setSelectedKey('6')} />
          )}
          {selectedKey === '6' && (
            <SettingContentpasswordedit
              form={form}
              passwordChange={() => setSelectedKey('5')}
            />
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

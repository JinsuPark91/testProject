import React, { Component, useState, useEffect, useRef } from 'react';
import { Layout, Menu } from 'antd';
import { Dialog, ContentWrapper, Button, Form } from 'teespace-core';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import SettingContentcommon from './SettingContentcommon';
import SettingContentalarm from './SettingContentalarm';
import SettingContentaccount from './SettingContentaccount';
import SettingContentaccountedit from './SettingContentaccountedit';
import SettingContentpassword from './SettingContentpassword';
import SettingContentpasswordedit from './SettingContentpasswordedit';
import Settingsave from './Settingsave';
import { useStore } from '../../stores';
// import SettingContent6 from './SettingContent6';
import TermsFooter from '../Login/TermsFooter';

const Headerwords = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.875rem;
  font-weight: bold;
  color: gray;
`;

const StyledButton = styled(Button)`
  outline: 0;
  border-radius: 5px;
  font-size: 0.75rem;
  line-height: 1.125rem;
  padding: 0.1875rem 1.438rem 0.5625rem 1.438rem;
  border: 1px solid transparent;
  align-items: right;

  &:active {
    background-color: #523dc7;
    color: #fff;
  }
`;

const { Sider, Content } = Layout;

function SettingDialog(props) {
  const { selectedKeyA } = props;
  const [selectedKey, setSelectedKey] = useState(selectedKeyA);
  const { uiStore } = useStore();
  const [settingform] = Form.useForm();
  const form = useRef(settingform);
  const [buttonFooter, setbuttonFooter] = useState(
    selectedKey === '6' || selectedKey === true,
  );
  useEffect(() => {
    setbuttonFooter(selectedKey === '6' || selectedKey === true);
  }, [selectedKey]);
  const handleSettingDialogClose = () => {
    uiStore.hideSettingDialog();
  };

  return useObserver(() => (
    <Dialog
      onCancel={handleSettingDialogClose}
      size="large"
      visible={uiStore.visibleSettingDialog}
      footer={
        <>
          {!buttonFooter && <TermsFooter />}

          {buttonFooter && (
            <Settingsave form={form} onClick={() => setSelectedKey('4')} />
          )}
        </>
      }
      title="설정"
    >
      <ContentWrapper>
        <div>
          <Layout style={{ backgroundColor: 'white' }}>
            <Sider style={{ backgroundColor: '#edf0ff' }}>
              <div className="logo" />
              <br />
              <Menu
                style={{ backgroundColor: '#edf0ff', height: '60%' }}
                defaultSelectedKeys={['3']}
                onClick={({ item, key }) => setSelectedKey(key)}
              >
                <div
                  style={{
                    height: '1rem',
                    color: '#000000',
                    fontSize: 15,
                    fontWeight: 'bold',
                    borderBottom: 'solid 1px',
                    borderBottomColor: 'lightgrey',
                  }}
                  key="0"
                >
                  환경설정
                </div>
                {/* <Menu.Item style={{ color: '#000000', fontSize: 10 }} key="1">
                  일반
                </Menu.Item> */}
                <Menu.Item style={{ color: '#000000', fontSize: 10 }} key="2">
                  알림
                </Menu.Item>
                <div
                  style={{
                    height: '1rem',
                    color: '#000000',
                    fontSize: 15,
                    fontWeight: 'bold',
                    borderBottom: 'solid 1px',
                    borderBottomColor: 'lightgrey',
                  }}
                  key="3"
                >
                  계정설정
                </div>
                <Menu.Item style={{ color: '#000000', fontSize: 10 }} key="4">
                  계정정보변경
                </Menu.Item>
                <Menu.Item style={{ color: '#000000', fontSize: 10 }} key="5">
                  비밀번호변경
                </Menu.Item>
                {/* <Menu.Item style={{color:"#000000", fontSize: 10}} key="6">서비스 탈퇴</Menu.Item> */}
              </Menu>
            </Sider>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                height: 650,
              }}
            >
              <div>
                {' '}
                {/* {selectedKey === '1' && (
                    <SettingContentcommon></SettingContentcommon>
                  )} */}
                {selectedKey === '2' && <SettingContentalarm form={form} />}
                {selectedKey === '3' && (
                  <SettingContentaccountedit
                    onChange={() => setbuttonFooter(true)}
                    form={form}
                    footonChange={() => setbuttonFooter(false)}
                    onClick={() => setSelectedKey('2')}
                  />
                )}
                {selectedKey === '4' && (
                  <SettingContentaccount onClick={() => setSelectedKey('3')} />
                )}
                {selectedKey === '5' && (
                  <SettingContentpassword onClick={() => setSelectedKey('6')} />
                )}
                {/* {this.state.selectedKey === '6' && (
                <SettingContent6></SettingContent6>
              )} */}
                {selectedKey === '6' && (
                  <SettingContentpasswordedit form={form} />
                )}
              </div>
            </Content>
          </Layout>
        </div>
      </ContentWrapper>
    </Dialog>
  ));
}

export default SettingDialog;

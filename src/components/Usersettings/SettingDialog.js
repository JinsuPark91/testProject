import React, { Component, useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import SettingContentcommon from './SettingContentcommon';
import SettingContentalarm from './SettingContentalarm';
import SettingContentaccount from './SettingContentaccount';
import SettingContentaccountedit from './SettingContentaccountedit';
import SettingContentpassword from './SettingContentpassword';
import SettingContentpasswordedit from './SettingContentpasswordedit';
import Settingsave from './Settingsave';
import CommonDialog, { ContentWrapper } from '../commons/Dialog';
import { useStore } from '../../stores';
// import SettingContent6 from './SettingContent6';
import TermsFooter from '../Login/TermsFooter';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';

const Headerwords = styled.div`
  display: flex;
  align-items: center;
  font-size: 30px;
  font-weight: bold;
  color: gray;
`;

const StyledButton = styled(Button)`
  outline: 0;
  border-radius: 5px;
  font-size: 12px;
  line-height: 18px;
  padding: 3px 23px 9px 23px;
  border: 1px solid transparent;
  align-items: right;

  &:active {
    background-color: #523dc7;
    color: #fff;
  }
`;


const { Sider, Content } = Layout;

function SettingDialog() {
  const [selectedKey, setSelectedKey] = useState('2');
  const { uiStore } = useStore();
  const [buttonFooter, setbuttonFooter] = useState((selectedKey === '6' || selectedKey === true))
  useEffect(()=> {
    setbuttonFooter(selectedKey === '6' || selectedKey === true)
  }, [selectedKey])
  const handleSettingDialogClose = () => {
    uiStore.hideSettingDialog();
  };

  return useObserver(() => (
    <CommonDialog
      onCancel={handleSettingDialogClose}
      size="large"
      visible={uiStore.visibleSettingDialog}
      footer={
        <>
          {!buttonFooter && <TermsFooter></TermsFooter>}

          {buttonFooter && <Settingsave></Settingsave>}

        </>
      }
      title="설정"
    >
      <ContentWrapper>
        <div>
          <Layout style={{backgroundColor: 'white'}}>
            <Sider
              // trigger={null}
              // collapsible
              // collapsed={this.state.collapsed}
              style={{ backgroundColor: '#edf0ff' }}
            >
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
                    borderBottomColor:'lightgrey'
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
                    borderBottomColor:'lightgrey'
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
                  height: 700,
                }}
              >
                <div>
                  {' '}
                  {/* {selectedKey === '1' && (
                    <SettingContentcommon></SettingContentcommon>
                  )} */}
                  {selectedKey === '2' && (
                    <SettingContentalarm></SettingContentalarm>
                  )}
                  {selectedKey === '3' && (
                    <SettingContentaccountedit
                    onChange={()=>setbuttonFooter(true)}
                    ></SettingContentaccountedit>
                    
                  )}
                  {selectedKey === '4' && (
                    <SettingContentaccount
                      onClick={() => setSelectedKey('3')}
                    ></SettingContentaccount>
                  )}
                  {selectedKey === '5' && (
                    <SettingContentpassword
                      onClick={() => setSelectedKey('6')}
                    ></SettingContentpassword>
                  )}
                  {/* {this.state.selectedKey === '6' && (
                <SettingContent6></SettingContent6>
              )} */}
                  {selectedKey === '6' && (
                    <SettingContentpasswordedit></SettingContentpasswordedit>
                  )}
                </div>
              </Content>
          </Layout>
          <div style={{ height: 100 }}></div>
        </div>
      </ContentWrapper>
    </CommonDialog>
  ));
}

export default SettingDialog;

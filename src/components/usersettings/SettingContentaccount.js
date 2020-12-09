import React, { Component, useState } from 'react';
import { Space, Image } from 'antd';
import { useObserver } from 'mobx-react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useCoreStores, Button, Input, Form } from 'teespace-core';

import styled from 'styled-components';
import SettingContentTitle from './SettingContentTitle';
import SettingPasswordInput from './SettingPasswordInput';

const AccountBordertop = styled.div`
  display: flex;
  border-top: 1px solid;
  border-top-color: #d8d8d8;
  font-size: 1.25rem;
  font-weight: bold;
  font-color: #777777;
`;

const Accounttext = styled.div`
  display: flex;
  font-size: 0.9375rem;
  font-color: #000000;
`;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

function onChange(e) {
  console.log('checked = ${e.target.checked}');
}

function SettingContentaccount(props) {
  const { authStore, userStore } = useCoreStores();
  const [Checked, setChecked] = useState(false);
  const [CheckPassword, setCheckPassword] = useState(true);

  const handleCheckPassword = values => {
    authStore
      .checkAuth({ loginId: userStore.myProfile.loginId, pw: values.password })
      .then(x => {
        x ? props.onClick() : setCheckPassword(false);
      });
  };

  console.log(authStore.checkAuth);

  return useObserver(() => (
    <div>
      <SettingContentTitle
        title="계정정보변경"
        subTitle="TeeSpace 계정정보를 확인하고 최신 정보로 안전하게 관리하세요."
      />

      <div>
        <Image
          width={125}
          height={125}
          src={`/${userStore.getUserProfilePhoto({
            userId: authStore.user.id,
            size: 'medium',
            isLocal: true,
            thumbPhoto: null,
          })}`}
        />
        <br />
        {authStore.user.name}, {authStore.user.nick} <br />, {authStore.user.id}
        {/* {console.log(userStore.getUserProfilePhoto)}; */}
        <br />
        <br />
      </div>
      <AccountBordertop>프로필 정보</AccountBordertop>
      <Accounttext>
        <div>
          국가 {authStore.user.nationalCode}
          <br />
          회사{authStore.user.companyNum}
          <br />
          전화 {authStore.user.phone} <br />
          이메일{authStore.user.email}
        </div>
      </Accounttext>
      <AccountBordertop>
        <div>
          개인정보 <br />
        </div>
      </AccountBordertop>
      <Accounttext>
        <div>
          생년월일 {authStore.user.birthDate}
          <br />
          소속회사/부서
          {authStore.user.orgName} / {authStore.user.departmentName}
          <br />
          직위/직책
          {authStore.user.position}
          <br />
        </div>
      </Accounttext>
      <AccountBordertop>
        <div>
          서비스 이용 동의 <br />
        </div>
      </AccountBordertop>
      <div>뉴스레터, 프로모션 등 안내 메일 수신 동의 </div>
      <div>계정 정보를 변경하시려면 먼저 비밀번호를 입력해 주세요.</div>

      <Form
        {...formItemLayout}
        initialValues={{
          password: '',
        }}
        name="register"
        scrollToFirstError
        onFinish={handleCheckPassword}
      >
        <SettingPasswordInput
          handleButtonDisabled={value => setChecked(value)}
          alert={
            !CheckPassword &&
            '현재 비밀번호가 올바르지 않습니다. 다시 입력해 주세요.'
          }
        />

        <Form.Item>
          <Button
            disabled={!Checked}
            checked={CheckPassword}
            htmlType="submit"
            type="system"
          >
            확인
          </Button>
        </Form.Item>
      </Form>
    </div>
  ));
}
export default SettingContentaccount;

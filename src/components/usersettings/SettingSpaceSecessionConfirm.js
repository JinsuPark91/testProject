import React, { Component, useState } from 'react';
import SettingContentTitle from './SettingContentTitle';
import SettingPasswordInput from './SettingPasswordInput';
import { useCoreStores } from 'teespace-core';
import { Button, Input, Form } from 'teespace-core';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';

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

function SettingSpaceSecessionConfirm(props) {
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

return useObserver(() => (     
       <>
        <SettingContentTitle
          title="스페이스 탈퇴"
          subTitle="스페이스 탈퇴에 대한 유의사항을 꼭 확인해 주세요."
        ></SettingContentTitle>
        <div style={{ fontSize: 30, color: '#8d8d8d' }}>현재 스페이스 </div>

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
      </>
    ));
        }
export default SettingSpaceSecessionConfirm;

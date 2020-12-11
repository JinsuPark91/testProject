import React, { Component, useState } from 'react';
import { Row } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Input, Form, useCoreStores } from 'teespace-core';
import ContentTitle from './ContentTitle';

import SettingContentTitle from './SettingContentTitle';
import NewPasswordInput from '../signup/NewPasswordInput';

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

function SettingContentpasswordedit(props) {
  const { authStore, userStore } = useCoreStores();
  const { form } = props;
  const [msg, setMsg] = useState({});
  const [CheckPassword, setCheckPassword] = useState(true);

  const handleFinishFailed = () => {
    const errors = {};
    form.current
      .getFieldsError(['password', 'passwordConfirm'])
      .forEach(error => {
        errors[error.name[0]] = error.errors[0];
      });
    setMsg(errors);
  };

  const handleFinish = values => {
    authStore
      .checkAuth({
        loginId: userStore.myProfile.loginId,
        pw: values.currentpassword,
      })
      .then(x => {
        x
          ? userStore.updateMyPassword({ pw: values.password })
          : setCheckPassword(false);
      });
  };

  const handleBlur = values => {
    authStore
      .checkAuth({
        loginId: userStore.myProfile.loginId,
        pw: values.currentpassword,
      })
      .then(x => {
        x ? null : setCheckPassword(false);
      });
  };

  return (
    <>
      {/* validateTrigger = {['onChange', 'onBlur']} */}
      <ContentTitle
        title="비밀번호 변경"
        subTitle="보안을 위해 비밀번호를 항상 최신 상태로 업데이트하세요."
      />
      현재 비밀번호
      <Form
        {...formItemLayout}
        form={form.current}
        name="register"
        onFinish={handleFinish}
        onFieldsChange={handleFinishFailed}
        scrollToFirstError
      >
        <Form.Item noStyle name="currentpassword">
          <Input
            getPopupContainer={() => {}}
            // onBlur={()=>handleBlur(true)}
            type="password"
            alert={
              !CheckPassword &&
              '현재 비밀번호가 올바르지 않습니다. 다시 입력해 주세요.'
            }
          />
        </Form.Item>

        <NewPasswordInput msg={msg.password} msg2={msg.passwordConfirm} />
      </Form>
    </>
  );
}
export default SettingContentpasswordedit;

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import LoginPasswordInput from './LoginPasswordInput';
import LoginIdInput from './LoginIdInput';
import CommonButton from '../commons/Button';
import CommonCheckbox from '../commons/Checkbox';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const FlexCenter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const FlexLeft = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
`;
const LoginContent = () => {
  const { authStore } = useCoreStores();
  const [form] = Form.useForm();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [loginResult, setLoginResult] = useState(null);
  const [errorResult, setErrorResult] = useState(null);
  const [saveIdCheck, setSaveIdCheck] = useState(false);
  const [loginStateCheck, setLoginStateCheck] = useState(false);

  const onFinish = async values => {
    setIsLoading(true);
    try {
      const res = await authStore.login({
        id: values.username,
        pw: values.password,
        isLocalLogin: process.env.REACT_APP_ENV === 'local',
      });
      setLoginResult(res);

      history.push(`/f/${authStore.user.loginId}`);
    } catch (e) {
      setErrorResult(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return useObserver(() => (
    <FlexCenter>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          saveId: false,
          loginState: false,
        }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <LoginIdInput />
        <LoginPasswordInput />
        <FlexLeft>
          <Form.Item
            {...tailLayout}
            name="saveId"
            valuePropName="checked"
            wrapperCol={{ span: 24 }}
          >
            <CommonCheckbox shape="round">아이디저장</CommonCheckbox>
          </Form.Item>
          <Form.Item
            {...tailLayout}
            name="loginState"
            valuePropName="checked"
            wrapperCol={{ span: 24 }}
          >
            <CommonCheckbox shape="round">로그인 상태 유지</CommonCheckbox>
          </Form.Item>
        </FlexLeft>
        {isLoading === true && <span>로그인 중</span>}
        {isLoading === false && errorResult && (
          <span>로그인 실패! 사유: {errorResult}</span>
        )}
        {isLoading === false && loginResult && <span>로그인 성공</span>}
        <FlexCenter>
          <Form.Item {...tailLayout} noStyle>
            <CommonButton
              type="solid"
              htmlType="submit"
              style={{ width: `100%` }}
            >
              로그인
            </CommonButton>
          </Form.Item>
        </FlexCenter>
      </Form>
    </FlexCenter>
  ));
};

export default LoginContent;

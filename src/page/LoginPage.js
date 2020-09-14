import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';

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

function LoginPage() {
  const { authStore } = useCoreStores();
  const [form] = Form.useForm();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [loginResult, setLoginResult] = useState({});

  const onFinish = async values => {
    setIsLoading(true);
    const res = await authStore.login({
      id: values.username,
      pw: values.password,
      isLocalLogin: process.env.REACT_APP_ENV === 'local',
    });
    setIsLoading(false);
    setLoginResult(res);

    if (res.status === 'fulfilled') {
      history.push(`/f/${authStore.getMyInfo.userLoginId}`);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return useObserver(() => (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="아이디"
        name="username"
        rules={[
          {
            required: true,
            message: '아이디 입력 해주세요',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="비밀번호"
        name="password"
        rules={[
          {
            required: true,
            message: '비밀번호 입력 해주세요',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          로그인
        </Button>
      </Form.Item>

      {isLoading === true && <span>로그인 중</span>}
      {(isLoading === false && loginResult.status) === 'rejected' && (
        <span>
          로그인 실패! 사유: ({loginResult.error.code}){' '}
          {loginResult.error.message}
        </span>
      )}
      {(isLoading === false && loginResult.status) === 'fulfilled' && (
        <span>로그인 성공</span>
      )}
    </Form>
  ));
}

export default LoginPage;

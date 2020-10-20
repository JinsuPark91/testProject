import { Form, Input } from 'antd';
import React from 'react';

const LoginPasswordInput = () => {
  return (
    <Form.Item
      name="password"
      rules={[
        {
          required: true,
          message: '현재 비밀번호',
        },
      ]}
      wrapperCol = {{span : 24}}
    >
      <Input.Password placeholder="비밀번호" />
    </Form.Item>
  );
};

export default LoginPasswordInput;

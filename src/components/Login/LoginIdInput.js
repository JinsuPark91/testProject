import React from 'react';
import { Form, Input } from 'teespace-core';

const LoginIdInput = () => {
  return (
    <Form.Item
      name="username"
      rules={[
        {
          required: true,
          message: '아이디 입력 해주세요',
        },
      ]}
      wrapperCol={{ span: 24 }}
    >
      <Input placeholder="아이디" />
    </Form.Item>
  );
};

export default LoginIdInput;

import { Form, Input } from 'teespace-core';
import React from 'react';

const LoginPasswordInput = () => {
  return (
    <Form.Item
      name="password"
      rules={[
        {
          required: true,
          message: '비밀번호 입력 해주세요',
        },
      ]}
      wrapperCol={{ span: 24 }}
    >
      <Input type="password" placeholder="비밀번호" />
    </Form.Item>
  );
};

export default LoginPasswordInput;

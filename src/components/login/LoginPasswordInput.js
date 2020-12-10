import { Form, Input } from 'teespace-core';
import React from 'react';

const LoginPasswordInput = () => {
  return (
    <Form.Item
      name="domain"
      rules={[
        {
          required: true,
          message: '도메인을 입력 해주세요',
        },
      ]}
      wrapperCol={{ span: 24 }}
    >
      <Input placeholder="도메인" />
    </Form.Item>
  );
};

export default LoginPasswordInput;

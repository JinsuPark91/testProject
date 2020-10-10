import { Form, Input } from 'antd';
import React from 'react';
import CommonInput from '../commons/Input';

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
      <CommonInput placeholder="아이디" />
    </Form.Item>
  );
};

export default LoginIdInput;

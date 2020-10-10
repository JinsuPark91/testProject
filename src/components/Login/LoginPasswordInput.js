import { Form, Input } from 'antd';
import React from 'react';
import CommonInput from '../commons/Input';

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
      <CommonInput type="password" placeholder="비밀번호" />
    </Form.Item>
  );
};

export default LoginPasswordInput;

import React from 'react';
import { Form, Input } from 'antd';
import CommonInput from '../commons/Input';

const NewPasswordInput = () => {
  return (
    <>
      <div>비밀번호</div>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <CommonInput type="password" />
      </Form.Item>
      <div>비밀번호 확인</div>
      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                'The two passwords that you entered do not match!',
              );
            },
          }),
        ]}
      >
        <CommonInput type="password" />
      </Form.Item>
    </>
  );
};

export default NewPasswordInput;

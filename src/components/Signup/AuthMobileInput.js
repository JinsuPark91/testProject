import { Form, Input, Button } from 'antd';
import React from 'react';
import CommonInput from '../commons/Input';

const AuthMobileInput = () => {
  return (
    <>
      <div>휴대폰 번호</div>
      <Form.Item
        name="phone"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <CommonInput
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
    </>
  );
};

export default AuthMobileInput;

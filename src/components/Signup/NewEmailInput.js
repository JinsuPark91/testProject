import React from 'react';
import { Form, Row } from 'antd';
import CommonInput from '../commons/Input';

const NewEmailInput = ({ msg }) => {
  return (
    <>
      <div>본인확인 이메일 (선택)</div>
      <Form.Item
        noStyle
        name="email"
        rules={[
          {
            type: 'email',
            message: '올바른 형식의 이메일 주소를 입력해 주세요.',
          },
        ]}
      >
        <CommonInput alert={msg} placement="topLeft" />
      </Form.Item>
    </>
  );
};

export default NewEmailInput;

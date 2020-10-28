import React, { useState } from 'react';
import { Row } from 'antd';
import { Form, Input } from 'teespace-core';
import { CheckOutlined } from '@ant-design/icons';
import { checkPasswordValid, checkPasswordLength } from '../../libs/Regex';

const SettingPasswordInput = ({ handleButtonDisabled, alert }) => {
  const [password, setPassword] = useState('');
  const [lengthStatus, setLengthStatus] = useState('error');
  const [validStatus, setValidStatus] = useState('error');

  const handleOnChangePw = e => {
    const isLength = checkPasswordLength(e.target.value.length);
    const isValid = checkPasswordValid(e.target.value);

    handleButtonDisabled(isValid && isLength);
  };

  return (
    <>
      <div>비밀번호</div>
      <Form.Item
        noStyle
        name="password"
      >
        <Input
          type="password"
          placement="topLeft"
          onChange={handleOnChangePw}
          value={password}
          alert={alert}
                  />
      </Form.Item>
     
      
    </>
  );
};

export default SettingPasswordInput;

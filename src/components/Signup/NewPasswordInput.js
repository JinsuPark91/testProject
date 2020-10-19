import React, { useState } from 'react';
import { Form, Row } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import CommonInput from '../commons/Input';
import { checkPasswordValid, checkPasswordLength } from '../../libs/Regex';

const NewPasswordInput = ({ msg, msg2 }) => {
  const [password, setPassword] = useState('');
  const [lengthStatus, setLengthStatus] = useState('error');
  const [validStatus, setValidStatus] = useState('error');

  const handleOnChangePw = e => {
    const isLength = checkPasswordLength(e.target.value.length);
    const isValid = checkPasswordValid(e.target.value);

    if (isValid) {
      setValidStatus('success');
    } else {
      setValidStatus('error');
    }
    if (isLength) {
      setLengthStatus('success');
    } else {
      setLengthStatus('error');
    }
  };
  return (
    <>
      <div>비밀번호</div>
      <Form.Item
        noStyle
        name="password"
        rules={[
          {
            required: true,
            whitespace: true,
            message: '비밀번호를 입력해 주세요.',
          },
          {
            validator: (_, value) =>
              checkPasswordLength(value.length)
                ? Promise.resolve()
                : Promise.reject(
                    '입력 가능한 비밀번호는 최소 9자 - 최대 20자 입니다.',
                  ),
          },
          {
            validator: (_, value) =>
              checkPasswordValid(value)
                ? Promise.resolve()
                : Promise.reject(
                    '영문, 숫자, 특수 문자 3가지가 모두 포함되어야 합니다.',
                  ),
          },
        ]}
      >
        <CommonInput
          type="password"
          placement="topLeft"
          onChange={handleOnChangePw}
          value={password}
          alert={msg}
        />
      </Form.Item>
      <Row>
        <CheckOutlined
          className="NewIdLength"
          style={
            lengthStatus === 'success'
              ? { color: '#16AC66' }
              : { color: '#75757F' }
          }
        />
        <div>9 - 20자</div>
        <CheckOutlined
          className="NewIdValid"
          style={
            validStatus === 'success'
              ? { color: '#16AC66' }
              : { color: '#75757F' }
          }
        />
        <div>영문 대 / 소문자 숫자, 특수 문자 중 3가지 이상 조합</div>
      </Row>
      <div>비밀번호 확인</div>
      <Form.Item
        noStyle
        name="passwordConfirm"
        dependencies={['password']}
        rules={[
          {
            required: true,
            whitespace: true,
            message: '비밀번호 확인을 입력해 주세요.',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                '입력한 비밀번호와 확인란이 일치하지 않습니다.',
              );
            },
          }),
        ]}
      >
        <CommonInput alert={msg2} type="password" placement="topLeft" />
      </Form.Item>
    </>
  );
};

export default NewPasswordInput;

import { Form, Input, Button, Row, Col } from 'antd';
import React, { useState } from 'react';
import CommonInput from '../commons/Input';
import { checkPhoneValid,checkAuthNumber } from '../../libs/Regex';
import CommonButton from '../commons/Button';
import { useCoreStores } from 'teespace-core';
import CommonToast from '../commons/Toast';

const AuthMobileInput = (props) => {
  const [validStatus, setValidStatus] = useState('error');
  const [phone, setPhone] = useState('');
  const [checkDuplicationPhone, setCheckDuplicationPhone] = useState('');
  const { authStore } = useCoreStores();
  const [toastVisible, setToastVisible] = useState(false);
  const { timeoutMs, msg , msg2 } = props;
  const handleOnChangePhone = e => {
    const isValid = checkPhoneValid(e.target.value);
    if (isValid) {
      setValidStatus('success');
    } else {
      setValidStatus('error');
    }
    setPhone(e.target.value);
    setCheckDuplicationPhone('');
  };

  const handleOnClickPhoneButton = () => {
    authStore
      .DuplicationCheckPhone(phone, '+82')
      .then(x => {
        x.RESULT_CD === 'RST0001'
          ? setCheckDuplicationPhone('RST0001')
          : setCheckDuplicationPhone('RST0002');
        return x.RESULT_CD;
      })
      .then(res => {
        if (res === 'RST0001') {
          authStore.AuthNumberCreatePhone(phone).then(setToastVisible(true));
        }
      });
  };

  const handleOnChangeAuthNumber = e => {
    props.setAuthNumber(e.target.value);
  };

  return (
    <>
      <div>휴대폰 번호</div>
      <Form.Item
        noStyle
        name="phone"
        rules={[
          {
            required: true,
            whitespace: true,
            message: '휴대폰 번호를 입력해 주세요.',
          },
          {
            validator: (_, value) =>
              checkPhoneValid(value)
                ? Promise.resolve()
                : Promise.reject('올바른 형식의 휴대폰 번호를 입력해 주세요.'),
          },
        ]}
      >
        <Row>
          <Col span="18">
            <CommonInput
              onChange={handleOnChangePhone}
              placement="topLeft"
              checked={checkDuplicationPhone === 'RST0001'}
              alert={
                checkDuplicationPhone === 'RST0002'
                  ? '이미 가입 정보가 있는 휴대폰 번호입니다.'
                  : msg
              }
              placeholder="'-'없이 숫자만 입력해 주세요."
            />
          </Col>
          <CommonButton
            type="solid"
            disabled={validStatus !== 'success'}
            onClick={handleOnClickPhoneButton}
          >
            인증 요청
          </CommonButton>
        </Row>
      </Form.Item>
      <CommonToast
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        timeoutMs={timeoutMs}
      >
        인증번호가 발송되었습니다.
      </CommonToast>
      {checkDuplicationPhone === 'RST0001' && (
        <>
      <Form.Item
        noStyle
        name="authNumber"
        rules={[
          {
            required: true,
            whitespace: true,
            message: '인증 번호를 입력해 주세요.',
          },
        ]}
      >
        <Row>
          <CommonInput
            onChange={handleOnChangeAuthNumber}
            placeholder="인증 번호를 입력해 주세요."
            alert={((validAuthNumber) => {
              switch (validAuthNumber) {
                case 'success':
                  return msg2;
                case 'error':
                  return '올바른 인증 번호를 입력해 주세요.';
                case 'init':
                default:
                  return '';
              }
            })(props.validAuthNumber)}
            placement="topLeft"
          />
        </Row>
      </Form.Item>
        </>
       )}
    </>
  );
};

export default AuthMobileInput;

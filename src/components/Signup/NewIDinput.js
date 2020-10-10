import React, { useState } from 'react';
import { Row, Col, Form } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useCoreStores } from 'teespace-core';
import CommonButton from '../commons/Button';
import CommonInput from '../commons/Input';

const NewIdInput = () => {
  const { authStore } = useCoreStores();
  const [loginId, setLoginId] = useState('');

  const handleDuplicationID = () => {
    authStore.DuplicationCheckId(loginId);
    console.log(loginId);
  };
  const handleOnChangeId = e => setLoginId(e.target.value);

  return (
    <>
      <div>아이디</div>
      <Form.Item name="loginId">
        <Row>
          <CommonInput onChange={handleOnChangeId} value={loginId} />
          <CommonButton onClick={handleDuplicationID} type="solid">
            중복 확인
          </CommonButton>
        </Row>
      </Form.Item>
      <Row>
        <CheckOutlined className="NewIdLength" />
        <div>5 - 20자</div>
        <CheckOutlined className="NewIdValid" />
        <div>영문 소문자, 숫자와 특수기호 (_), (-) 만 사용</div>
      </Row>
    </>
  );
};

export default NewIdInput;

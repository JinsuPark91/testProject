import React, { useEffect, useState } from 'react';
import { Row, Form ,Col} from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useCoreStores } from 'teespace-core';
import CommonButton from '../commons/Button';
import CommonInput from '../commons/Input';
import { checkLoginIdLength, checkLoginIdValid } from '../../libs/Regex';

const NewIdInput = (props) => {
  const { checkDuplicationId,setCheckDuplicationId, msg  } = props;
  const { authStore } = useCoreStores();
  const [loginId, setLoginId] = useState('');
  const [lengthStatus, setLenghtStatus] = useState('error');
  const [validStatus, setValidStatus] = useState('error');
  const [strange, setStrange] = useState('success');


  const handleDuplicationID = () => {
    authStore.DuplicationCheckId(loginId)
      .then(x =>
        x.RESULT_CD === 'RST0001'
          ? setCheckDuplicationId('RST0001')
          : setCheckDuplicationId('RST0002')
          );
  };

  const handleOnChangeId = e => {
    const isLength = checkLoginIdLength(e.target.value.length);
    const isValid = checkLoginIdValid(e.target.value);
    let countSpc = 0;
    // -,_ 로만 이루어진 loginId filter
    for (let spc = 0; spc < e.target.value.length; spc += 1) {
      if (
        e.target.value[spc].indexOf('-') !== -1 ||
        e.target.value[spc].indexOf('_') !== -1
      ) {
        countSpc += 1;
        if (countSpc === e.target.value.length) {
          setStrange('error');
        }
      } else {
        setStrange('success');
      }
    }
    if (isLength) {
      setLenghtStatus('success');
    } else {
      setLenghtStatus('error');
    }
    if (isValid) {
      setValidStatus('success');
    } else {
      setValidStatus('error');
    }
    if (e.target.value.length === 0) {
      setLenghtStatus('error');
      setValidStatus('error');
    }
    setCheckDuplicationId('')
    setLoginId(e.target.value);
  };

  return (
    <>
      <div>아이디</div>
      <Form.Item
        noStyle
        name="loginId"
        hasFeedback
        rules={[
          {
            required: true,
            whitespace: true,
            message: '아이디를 입력해 주세요.',
          },
          {
            validator: (_, value) =>
              checkLoginIdLength(value.length)
                ? Promise.resolve()
                : Promise.reject(
                    '입력 가능한 아이디는 최소 5자 - 최대 20자 입니다.',
                  ),
          },
          {
            validator: (_, value) =>
              checkLoginIdValid(value)
                ? Promise.resolve()
                : Promise.reject(
                    '영문 소문자, 숫자, 특수기호(_), (-)만 사용할 수 있습니다.',
                  ),
          },
        ]}
      >
        <Row>
          <Col span='18'>
          <CommonInput
            onChange={handleOnChangeId}
            value={loginId}
            placement="topLeft"
            checked={checkDuplicationId === 'RST0001'}
            alert={
              checkDuplicationId === 'RST0002'
                ? '이미 사용 중인 아이디 입니다. 다른 아이디를 입력하세요.'
                : msg
            }
          />
          </Col>
          <CommonButton
            disabled={
              !(
                lengthStatus === 'success' &&
                validStatus === 'success' &&
                strange === 'success'
              )
            }
            onClick={handleDuplicationID}
            type="solid"
          >
            중복 확인
          </CommonButton>
        </Row>
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
        <div>5 - 20자</div>
        <CheckOutlined
          className="NewIdValid"
          style={
            validStatus === 'success' && strange === 'success'
              ? { color: '#16AC66' }
              : { color: '#75757F' }
          }
        />
        <div>영문 소문자, 숫자와 특수기호 (_), (-) 만 사용</div>
      </Row>
    </>
  );
};

export default NewIdInput;

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, useCoreStores } from 'teespace-core';
import LoginPasswordInput from '../components/login/LoginPasswordInput';
import LoginIdInput from '../components/login/LoginIdInput';
import { Loader } from './MainPageStyle';
import LoadingImg from '../assets/WAPL_Loading.gif';
import Cookies from 'js-cookie';
import styled from 'styled-components';

function PrivateLoginPage() {
  const [form] = Form.useForm();
  const { authStore } = useCoreStores();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [errorResult, setErrorResult] = useState(null);

  useEffect(()=>{
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('DEVICE_TYPE'); 
   },[])

  const onFinish = async values => {
    setIsLoading(true);
    try {
      const res = await authStore.login({
        id: values.username, // localhost용 id= "seonhyeok_kim2@tmax.co.kr"
        deviceType: 'PC',
        domainUrl: '',
        authorizeType: 'Ksign',
      });
      if (res.id) {
        if (window.location.pathname.includes('/mobile')) {
          history.push(`/friend`);
        } else {
          history.push(`/f/${authStore.user.id}/profile`);
        }
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      setErrorResult(e.message);
      setIsLoading(false);
    }
  };


  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loader" />
      </Loader>
    );
  }
  return (
    <Form
      // {...layout}
      name="basic"
      initialValues={{
        saveId: false,
        autoLogin: false,
      }}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <LoginIdInput />
      {/* <LoginPasswordInput /> */}
      {isLoading === true && <span>로그인 중</span>}
      {isLoading === false && errorResult && (
        <span>로그인 실패! 사유: {errorResult}</span>
      )}
      <Form.Item noStyle>
        <Button type="solid" htmlType="submit">
          로그인
        </Button>
      </Form.Item>
    </Form>
  );
}

export default PrivateLoginPage;

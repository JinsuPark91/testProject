import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import TermsFooter from '../components/Login/TermsFooter';
import LogoHeader from '../components/Login/LogoHeader';
import LoginContent from '../components/Login/LoginContent';
import teeIcon from '../assets/ic_favicon.png';
import loginBG from '../assets/login_background.png';
import './LoginPage.css';

const LoginContainer = styled.div`
  margin-left: 11rem;
  height: 100%;
  width: 23.06rem;
  padding-top: 8.75rem;
`;
const FlexCenter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

function LoginPage() {
  const history = useHistory();

  const goSignup = () => {
    history.push(`/register`);
  };

  return (
    <div
      id="LoginBackgroundLayout"
      style={{
        backgroundImage: `url(${loginBG})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right center',
        backgroundSize: 'cover',
      }}
    >
      <LoginContainer>
        <FlexCenter>
          <img alt="login" src={teeIcon} />
        </FlexCenter>
        <FlexCenter style={{ marginTop: `0.83rem` }}>
          만들고 모일수록 즐거운 공간
        </FlexCenter>
        <div style={{ height: `1rem` }} />
        <LogoHeader />
        <div style={{ height: `2.06rem` }} />
        <LoginContent />
        <FlexCenter>
          <Button name="goSearchID" htmlType="button" type="text">
            아이디 찾기
          </Button>
          <Button name="goSearchPassword" htmlType="button" type="text">
            비밀번호 찾기
          </Button>
          <Button
            name="goSignup"
            htmlType="button"
            type="text"
            onClick={goSignup}
          >
            회원가입
          </Button>
        </FlexCenter>
        <div style={{ height: 'calc(100% - 32rem)' }} />

        <TermsFooter isService />
      </LoginContainer>
    </div>
  );
}

export default LoginPage;

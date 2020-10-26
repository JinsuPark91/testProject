import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import TermsFooter from '../components/Login/TermsFooter';
import LogoHeader from '../components/Login/LogoHeader';
import LoginContent from '../components/Login/LoginContent';
import teeIcon from '../assets/teespace_favicon.png';
import loginBG from '../assets/login_background.png';
import './LoginPage.css';

const LoginLayout = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  background-image: url(${loginBG});
  background-repeat: no-repeat;
  background-position: right center;
  background-size: cover;
`;
const Container = styled.div`
  width: 50%;
  min-width: 320px;
  margin-right: auto;
  background-color: #fff;
`;
const Content = styled.div`
  height: 100%;
  width: 273px;
  margin: 0 auto;
  text-align: center;
  padding-top: 8.75rem;
  display: flex;
  flex-direction: column;
`;
const FlexCenter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  margin-bottom: 1.125rem;
  .ant-btn {
    font-size: 0.75rem;
    padding: 0;
    height: auto;
  }
`;
const TitleText = styled.p`
  font-weight: 500;
  margin-bottom: 1.125rem;
  color: #0B1D41;
  font-size: 0.9375rem;
  letter-spacing: 2.65px;
`;
const ImgBox = styled.div `
  margin-bottom: 0.6875rem;
  & img {
    width: 50px;
    height: 50px;
  }
`
const LineBar = styled.span `
  width: 1px;
  height: 13px;
  background-color: #9398ab;
  margin: auto 0.75rem;
  display:inline-block;
`
const InfoText = styled.p`
  font-size: 0.6875rem;
  font-weight: 400;
  color: #828282;
  letter-spacing: 0;
`;

function LoginPage() {
  const history = useHistory();

  const goSignup = () => {
    history.push(`/register`);
  };

  return (
    <LoginLayout id="LoginBackgroundLayout">
      <Container>
        <Content>
          <ImgBox>
            <img alt="" src={teeIcon} />
          </ImgBox>
          <TitleText>만들고 모일수록 즐거운 공간</TitleText>
          <LogoHeader />
          <LoginContent />
          <FlexCenter>
            <Button name="goSearchID" htmlType="button" type="text">
              아이디 찾기
            </Button>
            <LineBar/>
            <Button name="goSearchPassword" htmlType="button" type="text">
              비밀번호 찾기
            </Button>
            <LineBar/>
            <Button
              name="goSignup"
              htmlType="button"
              type="text"
              onClick={goSignup}
            >
              회원가입
            </Button>
          </FlexCenter>
          <InfoText>TeeSpace는 ToGate와 Chrome에 최적화되어 있습니다.</InfoText>
          <TermsFooter isService />
        </Content>
      </Container>
    </LoginLayout>
  );
}

export default LoginPage;

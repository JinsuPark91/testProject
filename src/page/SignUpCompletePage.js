import React from 'react';
import styled from 'styled-components';
import signupCompleteImage from '../assets/sign_in_complete.png';
import CommonButton from '../components/commons/Button';
import { useHistory } from 'react-router-dom';

const FormCotentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: cetner;
`;

function SignUpCompletePage() {
  const history = useHistory();
  const getCreateId = localStorage.getItem('CreateUser');
  const handleOnClick = () => {
    history.push(`/login`);
  };
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img alt="signupComplete" src={signupCompleteImage} />
      <FormCotentWrapper>
        <div style={{ height: '2.63rem' }} />
        <div>회원 가입 완료</div>
        <div style={{ height: '0.81rem' }} />
        <div>TeeSpace 회원이 되신 걸 축하합니다.</div>
        <div style={{ height: '2.5rem' }} />
        <div>아이디: {getCreateId}</div>
        <CommonButton type="solid" onClick={handleOnClick}>
          로그인하고 TeeSpace시작
        </CommonButton>
      </FormCotentWrapper>
    </div>
  );
}

export default SignUpCompletePage;

import React from 'react';
import styled from 'styled-components';
import LogoHeader from '../components/Login/LogoHeader';
import TermsFooter from '../components/Login/TermsFooter';
import SignupContent from '../components/Signup/SignupContent';

const Container = styled.div`
  display: flex;
  height: 100%;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  h1 {
    margin: 4.75rem 0 2.5rem;
  }
`;

function SignUpPage() {
  return (
    <Container>
      <LogoHeader />
      <SignupContent />
      <TermsFooter isService={false} />
    </Container>
  );
}

export default SignUpPage;

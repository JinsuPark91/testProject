import React from 'react';
import styled from 'styled-components';
import LogoHeader from '../components/Login/LogoHeader';
import TermsFooter from '../components/Login/TermsFooter';
import SignupFormContent from '../components/Signup/SignupFormContent';

const FormCotentWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

function SignUpFormPage() {
  return (
    <div>
      <div style={{ display: `flex`, minHeight: `4.75rem` }} />
      <LogoHeader />
      <div style={{ height: `2.5rem` }} />
      <FormCotentWrapper>
        <SignupFormContent />
      </FormCotentWrapper>
      <div style={{ height: `2.5rem` }} />
      <TermsFooter isService={false} />
      <div style={{ display: `flex`, minHeight: `4.75rem` }} />
    </div>
  );
}

export default SignUpFormPage;

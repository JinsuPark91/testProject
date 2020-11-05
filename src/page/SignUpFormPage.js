import React from 'react';
import styled from 'styled-components';
import LogoHeader from '../components/login/LogoHeader';
import TermsFooter from '../components/login/TermsFooter';
import SignupFormContent from '../components/signup/SignupFormContent';

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

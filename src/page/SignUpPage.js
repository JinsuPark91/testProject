import React from 'react';
import LogoHeader from '../components/Login/LogoHeader';
import TermsFooter from '../components/Login/TermsFooter';
import SignupContent from '../components/Signup/SignupContent';

function SignUpPage() {
  return (
    <div>
      <div style={{ display: `flex`, minHeight: `4.75rem` }} />
      <LogoHeader />
      <div style={{ height: `2.5rem` }} />
      <SignupContent />
      <div style={{ height: `2.5rem` }} />
      <TermsFooter isService={false} />
      <div style={{ display: `flex`, minHeight: `4.75rem` }} />
    </div>
  );
}

export default SignUpPage;

import React from 'react';
import teeLogo from '../../assets/bi_teekitakka.svg';

const LogoHeader = () => {
  return (
    <div style={{ display: `flex`, justifyContent: `center` }}>
      <img style={{ width: `auto` }} alt="logo" src={teeLogo} />
    </div>
  );
};

export default LogoHeader;

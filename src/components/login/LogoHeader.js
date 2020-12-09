import React from 'react';
import styled from 'styled-components';
import teeLogo from '../../assets/bi_teekitakka.svg';

const ImgBox = styled.h1`
  margin-bottom: 2.063rem;
  text-align: center;
  & img {
    width: 184px;
    height: 35px;
  }
`;

const LogoHeader = () => {
  return (
    <ImgBox>
      <img alt="logo" src={teeLogo} />
    </ImgBox>
  );
};

export default LogoHeader;

import React from 'react';
import styled from 'styled-components';
import LoadingImg from '../../assets/WAPL_Loading.gif';

const MobileLoader = () => {
  return (
    <Loader>
      <img src={LoadingImg} alt="loading" />
    </Loader>
  );
};

export default MobileLoader;

const Loader = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  user-select: none;

  & img {
    width: 5rem;
    height: auto;
  }
`;

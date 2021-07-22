/* eslint-disable no-underscore-dangle */
import React, { useMemo } from 'react';
import { WorksApp } from 'wapl-works';
import { Loader, Wrapper } from './MainPageStyle';
import LoadingImg from '../assets/WAPL_Loading.gif';
import { useInitialize } from '../hook';

const MainWaplWorksPage = () => {
  // 기본 data fetch
  const isLoaded = useInitialize();
  const WorksWrapper = useMemo(() => <WorksApp />, []);

  return !isLoaded ? (
    <Loader>
      <img src={LoadingImg} alt="loader" />
    </Loader>
  ) : (
    <Wrapper>
      {window.env.REACT_APP_WORKS_ONLY === 'yes' && WorksWrapper}
    </Wrapper>
  );
};

export default MainWaplWorksPage;

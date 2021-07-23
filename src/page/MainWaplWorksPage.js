/* eslint-disable no-underscore-dangle */
import React, { Suspense } from 'react';
import { Loader, Wrapper } from './MainPageStyle';
import LoadingImg from '../assets/WAPL_Loading.gif';
import { useInitialize } from '../hook';
import WaplWorksPage from './WaplWorksPage';

const MainWaplWorksPage = () => {
  // 기본 data fetch
  const isLoaded = useInitialize();

  return !isLoaded ? (
    <Loader>
      <img src={LoadingImg} alt="loader" />
    </Loader>
  ) : (
    <Suspense fallback={<></>}>
      <Wrapper>
        {window.env.REACT_APP_WORKS_ONLY === 'yes' && <WaplWorksPage />}
      </Wrapper>
    </Suspense>
  );
};

export default MainWaplWorksPage;

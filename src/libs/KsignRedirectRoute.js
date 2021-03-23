import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import wwms from './wwms';
import { Loader } from '../page/MainPageStyle';
import LoadingImg from '../assets/WAPL_Loading.gif';

export default function KsignRedirectRoute({ component: Component, ...rest }) {
  const { authStore } = useCoreStores();
  const history = useHistory();
  const searchParams = new URLSearchParams(window.location.search);
  const getToken = searchParams.get('token');
  const getDeviceKey = searchParams.get('devicekey');

  useEffect(() => {
    // NOTE. 사용자 인증이 된 상태에서 웹소켓 연결을 시도
    if (!wwms.isConnected && authStore.isAuthenticated) {
      wwms.connect(authStore.user.id);
    }
  }, [authStore.user.id, authStore.isAuthenticated]);

  let loginInfo;
  loginInfo = {
    //ksign 용 로그인 input
    // accessToken: getToken,
    // deviceKey: getDeviceKey,
    deviceType: 'PC',
    domainUrl: '',
    id: 'bin_lim@tmax.co.kr',
    authorizeType: 'Ksign',
  };

  return (
    <Route
      {...rest}
      render={props => {
        //로그인 된 경우
        if (authStore.isAuthenticated) {
          return <Component />;
        }
        //로그인 안됐는데 토큰 있을경우
        else if (getToken && getDeviceKey) {
          console.log(loginInfo);
          Promise.all([authStore.login(loginInfo)])
            .then(async res => {
              if (res) {
                // history.replace(window.location.pathname);
                // NOTE. 이전 경로가 존재하면 해당 경로로 이동
                const stateFrom = props.location.state?.from;
                if (stateFrom) {
                  history.push(
                    `${stateFrom.pathname}${props.location.state?.from.search}`,
                  );
                } else {
                  if (window.location.pathname.includes('/mobile')) {
                    history.push(`/friend`);
                  } else {
                    history.push(`/f/${authStore.user.id}/profile`);
                  }
                }
              }
              return null;
            })
            .catch(e => {
              history.push('/privateLogin');
              console.log(e);
              throw e;
            });
        } else {
          history.push('/privateLogin');
        }
      }}
    />
  );
}

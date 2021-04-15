import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import Cookies from 'js-cookie';
import wwms from './wwms';

export default function KsignRedirectRoute({ component: Component, ...rest }) {
  const { authStore } = useCoreStores();
  const history = useHistory();
  const searchParams = new URLSearchParams(window.location.search);
  const getLoginId = searchParams.get('loginId');
  const getDeviceId = searchParams.get('deviceId');

  useEffect(() => {
    // NOTE. 사용자 인증이 된 상태에서 웹소켓 연결을 시도
    if (!wwms.isConnected && authStore.isAuthenticated) {
      wwms.connect(authStore.user.id);
    }
  }, [authStore.user.id, authStore.isAuthenticated]);

  let loginInfo;
  if (window.location.pathname.includes('/mobile')) {
    loginInfo = {
      // ksign 용 로그인 input
      deviceType: 'Mobile',
      // domainUrl: '',
      // deviceId: getDeviceId,
      // id: getLoginId,
      authorizeType: 'Ksign',
      ssoType:
        window?.env?.REACT_APP_SSO_TYPE || process?.env?.REACT_APP_SSO_TYPE,
    };
  } else {
    loginInfo = {
      // domainUrl: '',
      deviceType: 'PC',
      // id: getLoginId,
      authorizeType: 'Ksign',
      ssoType:
        window?.env?.REACT_APP_SSO_TYPE || process?.env?.REACT_APP_SSO_TYPE,
    };
  }

  return (
    <Route
      {...rest}
      render={props => {
        (async () => {
          try {
            const stateFrom = props.location.state?.from;
            const getRoutingPath = Cookies.get('routingPath') ? Cookies.get('routingPath')  : "/mobile/login"
            const getNibId = Cookies.get('NIBID');

            const res = await authStore.login(loginInfo);

            if (res) {
              // if (getNibId) {
                  // NOTE. 이전 경로가 존재하면 해당 경로로 이동
                if (stateFrom) {
                  history.push(
                    `${stateFrom.pathname}${props.location.state?.from.search}`,
                  );
                } else {
                  if (getRoutingPath.includes('/mobile')) {
                    const exceptMobilePath = getRoutingPath.replace(
                      '/mobile',
                      '',
                    );
                    if (exceptMobilePath.includes('/login')) {
                      history.push(`/friend`);
                    } else {
                      history.push(exceptMobilePath);
                    }
                  } else {
                    history.push(`/f/${authStore.user.id}/profile`);
                  }
                }
              // } else if (getRoutingPath.includes('/mobile')) {
              //   const exceptMobilePath = getRoutingPath.replace('/mobile', '');
              //   if (exceptMobilePath.includes('login')) {
              //     history.push(`/friend`);
              //   } else {
              //     history.push(exceptMobilePath);
              //   }
              // } else {
              //   history.push(`/f/${authStore.user.id}/profile`);
              // }
            }
          } catch (e) {
            history.push('/privatelogin');
            console.error(e);
          }
        })();
        return null;
      }}
    />
  );
}

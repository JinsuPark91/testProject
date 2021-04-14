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

  // useEffect(() => {
  //   const preLogout = async () => {
  //     await authStore.logout();
  //     // Cookies.remove('ACCESS_TOKEN');
  //     // Cookies.remove('DEVICE_TYPE');
  //   };
  //   if (authStore.user?.loginId) {
  //     preLogout();
  //   }
  // }, [authStore]);

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
        process.env.REACT_APP_SSO_TYPE || window?.env?.REACT_APP_SSO_TYPE,
    };
  } else {
    loginInfo = {
      // domainUrl: '',
      deviceType: 'PC',
      // id: getLoginId,
      authorizeType: 'Ksign',
      ssoType:
        process.env.REACT_APP_SSO_TYPE || window?.env?.REACT_APP_SSO_TYPE,
    };
  }

  /*

  return (
    <Route
      {...rest}
      render={props => {
        //로그인 된 경우
        if (authStore.isAuthenticated) {
          return <Component />;
        }
        //가장 처음 loginId & deviceId 있을때 index.jsp호출한다.
        else if (getLoginId) {
          const stateFrom = props.location.state?.from;

          Cookies.set(
            'routingPath',
            stateFrom?.pathname ? stateFrom.pathname : window.location.pathname,
            process.env.REACT_APP_ENV === 'local'
              ? {}
              : {
                  domain: `.${window.location.hostname}`,
                },
          );
          // history.push(`/cnu/sso/index2.jsp?deviceId=${getDeviceId}`)
          if (process.env.REACT_APP_ENV === 'local') {
            window.location.href = `https://test-id44.teespace.com/cnu/sso/index.jsp?deviceId=${getDeviceId}`;
          } else {
            window.location.href = `/cnu/sso/index.jsp?deviceId=${getDeviceId}`;
          }
        } else if (!getLoginId) {
          console.log(loginInfo);
          const getRoutingPath = Cookies.get('routingPath');
          console.log(`getRoturingPath`, getRoutingPath);
          // Promise.all([authStore.login(loginInfo)])
          // .then(async res => {
          // if (res) {
          // history.replace(window.location.pathname);
          // NOTE. 이전 경로가 존재하면 해당 경로로 이동
          const stateFrom = props.location.state?.from;
          console.log('stateFrom', stateFrom);
          if (stateFrom) {
            history.push(
              `${stateFrom.pathname}${props.location.state?.from.search}`,
            );
          } else {
            if (window.location.pathname.includes('/mobile')) {
              const exceptMobilePath = getRoutingPath.replace('/mobile', '');
              if (exceptMobilePath.includes('login')) {
                console.log(
                  '###########################################################',
                );
                history.push(`/friend`);
              } else {
                history.push(exceptMobilePath);
              }
            } else {
              history.push(`/f/${authStore.user.id}/profile`);
            }
          }
          // }
          return null;
          // })
          // .catch(e => {
          //   history.push('/privatelogin');
          // });
        }
      }}
    />
  );

  */

  return (
    <Route
      {...rest}
      render={props => {
        (async () => {
          try {
            const stateFrom = props.location.state?.from;

            if (getLoginId) {
              Cookies.set(
                'routingPath',
                stateFrom?.pathname
                  ? stateFrom.pathname
                  : window.location.pathname,
                process.env.REACT_APP_ENV === 'local'
                  ? {}
                  : {
                      domain: `.${window.location.hostname}`,
                    },
              );

              if (process.env.REACT_APP_ENV === 'local') {
                window.location.href = `https://test-id44.teespace.com/cnu/sso/index.jsp?deviceId=${getDeviceId}`;
              } else {
                window.location.href = `/cnu/sso/index.jsp?deviceId=${getDeviceId}`;
              }
            } else {
              const res = await authStore.login(loginInfo);
              const getRoutingPath = Cookies.get('routingPath');
              const getNibId = Cookies.get('NIBID');
              if (res) {
                if (getNibId) {
                  if (stateFrom) {
                    history.push(
                      `${stateFrom.pathname}${props.location.state?.from.search}`,
                    );
                  }
                } else {
                  if (window.location.pathname.includes('/mobile')) {
                    const exceptMobilePath = getRoutingPath?.replace(
                      '/mobile',
                      '',
                    );
                    if (exceptMobilePath.includes('login')) {
                      history.push(`/friend`);
                    } else {
                      history.push(exceptMobilePath);
                    }
                  } else {
                    history.push(`/f/${authStore.user.id}/profile`);
                  }
                }
              }
            }
            // NOTE. 이전 경로가 존재하면 해당 경로로 이동
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

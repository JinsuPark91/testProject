import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useCoreStores, API } from 'teespace-core';
import Cookies from 'js-cookie';
import wwms from './wwms';
import keycloak from './keycloak';
import { LogoutTimer } from './logoutTimer';
import HyperAuthRepository from './HyperAuthRepository.js';
import { ssoType } from './auth';
import NotFoundPage from '../page/NotFoundPage';

export default function KsignRedirectRoute({ component: Component, ...rest }) {
  const { authStore } = useCoreStores();
  const history = useHistory();
  const getNibId = Cookies.get('NIBID');
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const conURL = url.split(`//`)[1]; // xxx.dev.teespace.net
  const mainURL = conURL.slice(conURL.indexOf('.') + 1, conURL.length); // dev.teespace.net

  useEffect(() => {
    if (getNibId) {
      // NOTE. 사용자 인증이 된 상태에서 웹소켓 연결을 시도
      if (!wwms.isConnected && authStore.isAuthenticated) {
        wwms.connect(authStore.user.id);
      }
    } else {
      const refreshTokenHandler = async () => {
        if (keycloak.authenticated) {
          const res = await keycloak.updateToken(60);

          Cookies.set(
            'ACCESS_TOKEN',
            keycloak.token,
            process.env.REACT_APP_ENV === 'local'
              ? {}
              : {
                  domain: `.${mainURL}`,
                },
          );
          return res;
        }
        return false;
      };
      API.refreshTokenHandler = refreshTokenHandler;
    }
  }, [authStore.user.id, authStore.isAuthenticated]);

  if (getNibId) {
    //index.jsp 탈 경우
    // const { authStore } = useCoreStores();
    // const history = useHistory();
    const searchParams = new URLSearchParams(window.location.search);
    const getLoginId = searchParams.get('loginId');
    const getDeviceId = searchParams.get('deviceId');

    let loginInfo;
    if (window.location.pathname.includes('/mobile')) {
      loginInfo = {
        // ksign 용 로그인 input
        deviceType: 'Mobile',
        authorizeType: 'Ksign',
        ssoType: ssoType,
      };
    } else {
      loginInfo = {
        deviceType: 'PC',
        authorizeType: 'Ksign',
        ssoType: ssoType,
      };
    }

    return (
      <Route
        {...rest}
        render={props => {
          (async () => {
            try {
              const stateFrom = props.location.state?.from;
              const getRoutingPath = Cookies.get('routingPath');

              const res = await authStore.login(loginInfo);
              if (res) {
                if (stateFrom) {
                  history.push(
                    `${stateFrom.pathname}${props.location.state?.from.search}`,
                  );
                } else {
                  if (getRoutingPath?.includes('/mobile')) {
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
              }
            } catch (e) {
              console.error(e);
              return <Route component={NotFoundPage} />;
            }
          })();
          return null;
        }}
      />
    );
  } else {
    //ssoType은 ksign이나, hyperauth 타야되는 경우(ksign 인증 x)

    let domainName;
    let loginInfo;

    if (process.env.REACT_APP_ENV === 'local') {
      [domainName] = new URL(process.env.REACT_APP_DOMAIN_URL).hostname.split(
        '.',
      );
      loginInfo = {
        id: keycloak.tokenParsed.preferred_username,
        deviceType: 'PC',
        domainUrl: domainName,
        isLocal: 'local',
        ssoType: ssoType,
      };
    } else {
      [domainName] = url.split(`//`)[1].split(`.`);
      loginInfo = {
        deviceType: 'PC',
        domainUrl: '',
        ssoType: ssoType,
      };
    }
    return (
      <Route
        {...rest}
        render={props => {
          (async () => {
            try {
              if (
                authStore.user?.loginId &&
                authStore.user?.loginId !==
                  keycloak.tokenParsed?.preferred_username
              ) {
                await authStore.logout().then(() => {
                  Cookies.remove('ACCESS_TOKEN');
                  Cookies.remove('DEVICE_TYPE');
                });
              }

              const res = await authStore.login(loginInfo);

              if (res) {
                Cookies.set(
                  'DEVICE_TYPE',
                  'PC',
                  process.env.REACT_APP_ENV === 'local'
                    ? {}
                    : {
                        domain: `.${window.location.host}`,
                      },
                );
              }

              if (process.env.REACT_APP_ENV !== 'local') {
                await HyperAuthRepository.getRememberMe({
                  sessionState: keycloak.tokenParsed.session_state,
                }).then(result => {
                  // on || off
                  if (result === 'off') {
                    LogoutTimer.start();
                  }
                });
              }
              // NOTE. 이전 경로가 존재하면 해당 경로로 이동
              const stateFrom = props.location.state?.from;
              if (stateFrom) {
                history.push(
                  `${stateFrom.pathname}${props.location.state?.from.search}`,
                );
              } else {
                history.push(`/f/${authStore.user.id}/profile`);
              }
            } catch (e) {
              console.error(e);
              return <Route component={NotFoundPage} />;
            }
          })();
          return null;
        }}
      />
    );
  }
}

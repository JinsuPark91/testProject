import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useCoreStores, WaplAuthRepository, API } from 'teespace-core';
import { useKeycloak } from '@react-keycloak/web';
import Cookies from 'js-cookie';
import { LogoutTimer } from './logoutTimer';
import HyperAuthRepository from './HyperAuthRepository.js';

function KeycloakRedirectRoute({ component: Component, ...rest }) {
  const { keycloak } = useKeycloak();
  const { authStore } = useCoreStores();
  const history = useHistory();

  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const conURL = url.split(`//`)[1]; // xxx.dev.teespace.net
  const mainURL = conURL.slice(conURL.indexOf('.') + 1, conURL.length); // dev.teespace.net
  let domainName;
  let loginInfo;
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (process.env.REACT_APP_ENV === 'local') {
    [domainName] = new URL(process.env.REACT_APP_DOMAIN_URL).hostname.split(
      '.',
    );
    loginInfo = {
      id: keycloak.tokenParsed.email,
      deviceType: 'PC',
      domainUrl: domainName,
      isLocal: 'local',
    };
  } else {
    [domainName] = url.split(`//`)[1].split(`.`);
    loginInfo = {
      deviceType: 'PC',
      domainUrl: '',
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
              authStore.user?.loginId !== keycloak.tokenParsed?.email
            ) {
              await authStore.logout().then(() => {
                Cookies.remove('ACCESS_TOKEN');
              });
            }

            const res = await authStore.login(loginInfo);

            if (res) {
              if (process.env.REACT_APP_ENV !== 'local') {
                if (!authStore.sessionInfo.isTermAgree) {
                  window.location.href = `${window.location.protocol}//${mainURL}/first-login`;
                  return null;
                }
              }
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
            if (props.location.state?.from) {
              history.push(
                `${props.location.state?.from.pathname}${props.location.state?.from.search}`,
              );
            } else {
              history.push(`/f/${authStore.user.id}/profile`);
            }
          } catch (e) {
            window.location.href = `${window.location.protocol}//${mainURL}/domain/${domainName}`;
            console.error(e);
          }
        })();
        return null;
      }}
    />
  );
}

export default KeycloakRedirectRoute;

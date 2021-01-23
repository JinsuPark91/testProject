import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import { useKeycloak } from '@react-keycloak/web';

function KeycloakRedirectRoute({ component: Component, ...rest }) {
  const { keycloak } = useKeycloak();
  const { authStore } = useCoreStores();
  const history = useHistory();

  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const conURL = url.split(`//`)[1]; // xxx.dev.teespace.net
  const mainURL = conURL.slice(conURL.indexOf('.') + 1, conURL.length); // dev.teespace.net
  let domainName;
  let loginInfo;

  if (process.env.REACT_APP_ENV === 'local') {
    [domainName] = process.env.REACT_APP_DEV_SERVICE_DOMAIN.split('.');
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
              await authStore.logout();
            }

            await authStore.login(loginInfo);

            // NOTE. 이전 경로가 존재하면 해당 경로로 이동
            if (props.location.state?.from) {
              history.push(props.location.state?.from.pathname);
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

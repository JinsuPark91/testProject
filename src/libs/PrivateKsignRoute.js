import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import wwms from './wwms';
import { useKeycloak } from '@react-keycloak/web';
import Cookies from 'js-cookie';

export default function PrivateKsignRoute({ component, ...rest }) {
  const { authStore } = useCoreStores();
  const getNibId = Cookies.get('NIBID');
  const { keycloak } = useKeycloak();

  useEffect(() => {
    // NOTE. 사용자 인증이 된 상태에서 웹소켓 연결을 시도
    if (!wwms.isConnected && authStore.isAuthenticated) {
      wwms.connect(authStore.user.id, authStore.user.loginId);
    }
  }, [authStore.user.id, authStore.user.loginId, authStore.isAuthenticated]);
  if (getNibId) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          authStore.isAuthenticated ? (
            React.createElement(component)
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                search: location.search,
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  } else {
    //ssoType은 ksign이나, hyperauth 타야되는 경우(ksign 인증 x)
    return (
      <Route
        {...rest}
        render={({ location }) => {
          return authStore.isAuthenticated &&
            keycloak.authenticated &&
            keycloak.tokenParsed.email === authStore.user?.loginId ? (
            React.createElement(component)
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location },
              }}
            />
          );
        }}
      />
    );
  }
}

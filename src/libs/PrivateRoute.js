import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useCoreStores } from 'teespace-core';
import wwms from './wwms';

export default function PrivateRoute({ component, ...rest }) {
  const { authStore } = useCoreStores();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    // NOTE. 사용자 인증이 된 상태에서 웹소켓 연결을 시도
    if (!wwms.isConnected && authStore.isAuthenticated) {
      wwms.connect(authStore.user.id, authStore.user.loginId);
    }
  }, [authStore.user.id, authStore.user.loginId, authStore.isAuthenticated]);

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

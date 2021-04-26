import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import wwms from './wwms';

export default function PrivateLocalRoute({ component: Component, ...rest }) {
  const { authStore } = useCoreStores();
  useEffect(() => {
    // NOTE. 사용자 인증이 된 상태에서 웹소켓 연결을 시도
    if (!wwms.isConnected && authStore.isAuthenticated) {
      wwms.connect(authStore.user.id, authStore.user.loginId);
    }
  }, [authStore.user.id, authStore.user.loginId, authStore.isAuthenticated]);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authStore.isAuthenticated ? (
          <Component />
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
}

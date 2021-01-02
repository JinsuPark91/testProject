import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useCoreStores } from 'teespace-core';
import wwms from './wwms';

export default function PrivateRoute({ component, ...rest }) {
  const { authStore } = useCoreStores();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    if (!wwms.isConnected) {
      wwms.connect(authStore.user.id);
    }
  }, [authStore]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authStore.isAuthenticated &&
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
        )
      }
    />
  );
}

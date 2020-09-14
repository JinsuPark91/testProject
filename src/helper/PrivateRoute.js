import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';

export default function PrivateRoute({ component, ...rest }) {
  const { authStore } = useCoreStores();

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
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

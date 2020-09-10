import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStore } from '../store';

export default function PrivateRoute({ component, ...rest }) {
  const { authStore } = useStore();

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

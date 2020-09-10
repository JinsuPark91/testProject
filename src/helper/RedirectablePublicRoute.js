import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStore } from '../store';

export default function RedirectablePublicRoute({ component, ...rest }) {
  const { authStore } = useStore();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !authStore.isAuthenticated ? (
          component
        ) : (
          <Redirect
            to={{
              pathname: `/f/${authStore.getMyInfo.userLoginId}`,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

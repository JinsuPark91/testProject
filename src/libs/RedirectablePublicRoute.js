import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';

export default function RedirectablePublicRoute({
  component: Component,
  ...rest
}) {
  const { userStore, authStore } = useCoreStores();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !authStore.isAuthenticated ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: `/f/${userStore.myProfile.id}/profile`,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

import React, { useState, useEffect } from 'react';
import keycloak from '../keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Cookies from 'js-cookie';

export default ({ children }) => {
  const isLocal = process.env.REACT_APP_ENV === 'local';
  const eventLogger = event => {
    switch (event) {
      case 'onAuthSuccess':
      case 'onAuthRefreshSuccess': {
        Cookies.set(
          'ACCESS_TOKEN',
          keycloak.token,
          isLocal
            ? {}
            : {
                domain: `.${window.location.host.slice(
                  window.location.host.indexOf('.') + 1,
                  window.location.host.length,
                )}`,
              },
        );
        break;
      }
      case 'onAuthLogout':
        window.location.href = '/';
        break;
      default:
        break;
    }
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      onEvent={eventLogger}
      LoadingComponent={<></>}
      initOptions={{
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      }}
    >
      {children}
    </ReactKeycloakProvider>
  );
};

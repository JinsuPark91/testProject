import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCoreStores, WWMS } from 'teespace-core';
import { getEnv } from '../env';

export default function PrivateRoute({ component, ...rest }) {
  const { authStore, userStore } = useCoreStores();
  const [hasWWMSConfig, setHasWWMSConfig] = useState(null);

  const { websocketURL } = getEnv();

  if (hasWWMSConfig === null) {
    WWMS.setConfig({
      url: `${websocketURL}?USER_ID=${userStore.myProfile.id}&action=&CONNECTION_ID=undefined`,
      isDebug: true,

      useInterval: false,
      intervalTime: 1000,

      useReconnect: true,
      reconnectInterval: 2000,

      intervalFunction: () => {
        console.log('send ping.');
      },
      onopen: null,
      onerror: null,
      onmessage: null,
      onclose: null,
    });
    WWMS.connect();
    setHasWWMSConfig(true);
  }

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

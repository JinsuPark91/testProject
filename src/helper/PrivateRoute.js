import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCoreStores, WWMS } from 'teespace-core';

export default function PrivateRoute({ component, ...rest }) {
  const { authStore } = useCoreStores();
  const [hasWWMSConfig, setHasWWMSConfig] = useState(null);
  // 테스트용 에코서버
  const echoServer = 'wss://echo.websocket.org';

  if (hasWWMSConfig === null) {
    WWMS.setConfig({
      // url: `${process.env.REACT_APP_WEBSOCKET_URL}?USER_ID=${authStore.myInfo.id}&action=&CONNECTION_ID=undefined`,
      url: echoServer,
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

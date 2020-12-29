import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CoreStoreProvider, GlobalCommonStyles } from 'teespace-core';
import { createGlobalStyle } from 'styled-components';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { setEnv, getEnv } from './env';
import keycloak from './libs/keycloak';

const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${global.screen.width / 13.66}%}
  }
`;

setEnv({
  serviceURL: `${window.location.protocol}//${
    process.env.REACT_APP_DEV_SERVICE_DOMAIN || window.location.hostname
  }/${process.env.REACT_APP_DEV_PATH}`,
  resourceURL: `${window.location.protocol}//${
    process.env.REACT_APP_DEV_SERVICE_DOMAIN || window.location.hostname
  }`,
  comURL:
    global.env.REACT_APP_COMMON_URL ||
    `${window.location.protocol}//${
      process.env.REACT_APP_DEV_COM_DOMAIN || window.location.hostname
    }`,
  hsmURL:
    global.env.REACT_APP_HSM_URL ||
    `${window.location.protocol}//${
      process.env.REACT_APP_DEV_HSM_DOMAIN || window.location.hostname
    }`,
  websocketURL: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
    process.env.REACT_APP_DEV_WEBSOCKET_DOMAIN || window.location.hostname
  }/${process.env.REACT_APP_DEV_WEBSOCKET_PATH}`,
  meetingURL: `${window.location.protocol}//${process.env.REACT_APP_DEV_COM_DOMAIN}`,
});
const url = window.location.origin; //  http://xxx.dev.teespace.net
const con_url = url.split(`//`)[1]; // xxx.dev.teespace.net
const sub_url = url.split(`//`)[1].split(`.`)[0]; //  xxx
const main_url = con_url.slice(con_url.indexOf('.') + 1, con_url.length); // dev.teespace.net

const getCookieValue = key => {
  const cookieKey = `${key}=`;
  let result = '';
  const cookieArr = document.cookie.split(';');

  for (let i = 0; i < cookieArr.length; i++) {
    if (cookieArr[i][0] === ' ') {
      cookieArr[i] = cookieArr[i].substring(1);
    }

    if (cookieArr[i].indexOf(cookieKey) === 0) {
      result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
      return result;
    }
  }
  return result;
};

ReactDOM.render(
  <CoreStoreProvider config={getEnv()}>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={
        // tokenParam
        getCookieValue(`ACCESS_TOKEN`)
          ? {
              // onLoad: 'check-sso',
              token: getCookieValue(`ACCESS_TOKEN`),
              refreshToken: getCookieValue(`REFRESH_TOKEN`),
            }
          : {
              // onLoad: 'check-sso',
              // silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
              checkLoginIframe: false,
              redirectUri:
                process.env.REACT_APP_ENV === 'local'
                  ? `${window.location.href}`
                  : `${window.location.protocol}//${main_url}/domain/${sub_url}`,
            }
      }
    >
      <GlobalStyle />
      <GlobalCommonStyles />
      <App />
    </ReactKeycloakProvider>
  </CoreStoreProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

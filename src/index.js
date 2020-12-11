import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CoreStoreProvider, GlobalCommonStyles } from 'teespace-core';
import { createGlobalStyle } from 'styled-components';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { setEnv, getEnv } from './env';
import keycloak from './libs/keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';


const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${global.screen.width / 13.66}%}
  }
`;

setEnv({
  serviceURL: `http://${
    process.env.REACT_APP_DEV_SERVICE_DOMAIN || window.location.hostname
  }/${process.env.REACT_APP_DEV_PATH}`,
  resourceURL: `http://${
    process.env.REACT_APP_DEV_SERVICE_DOMAIN || window.location.hostname
  }`,
  websocketURL: `ws://${
    process.env.REACT_APP_DEV_WEBSOCKET_DOMAIN || window.location.hostname
  }/${process.env.REACT_APP_DEV_WEBSOCKET_PATH}`,
});
const url = window.location.origin; //  http://xxx.dev.teespace.net
const sub_url = url.split('//')[1].split('.')[0];  //  xxx
const con_url = url.split(sub_url)  
const mail_url = con_url[1].slice(1,con_url[1].length)  //  dev.teespace.net  

ReactDOM.render(
  <CoreStoreProvider config={getEnv()}>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        checkLoginIframe: false,
        redirectUri: process.env.REACT_APP_ENV ===  'local' ?  `http://localhost:3000`: `http://${mail_url}?domain=${sub_url}`,
      }}
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

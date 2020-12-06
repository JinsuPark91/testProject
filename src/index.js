import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CoreStoreProvider, GlobalCommonStyles } from 'teespace-core';
import { createGlobalStyle } from 'styled-components';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { setEnv, getEnv } from './env';

const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${global.screen.width / 13.66}%}
  }
`;

setEnv({
  serviceURL: `http://${
    process.env.REACT_APP_DEV_SERVICE_DOMAIN || window.location.hostname
  }/${process.env.REACT_APP_DEV_PATH}`,
  websocketURL: `ws://${
    process.env.REACT_APP_DEV_WEBSOCKET_DOMAIN || window.location.hostname
  }/${process.env.REACT_APP_DEV_WEBSOCKET_PATH}`,
});

ReactDOM.render(
  <CoreStoreProvider config={getEnv()}>
    <GlobalStyle />
    <GlobalCommonStyles />
    <App />
  </CoreStoreProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

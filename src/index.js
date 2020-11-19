import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CoreStoreProvider, GlobalCommonStyles } from 'teespace-core';
import { createGlobalStyle } from 'styled-components';
import App from './App';
import * as serviceWorker from './serviceWorker';

const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${global.screen.width / 13.66}%}
  }
`;

ReactDOM.render(
  <CoreStoreProvider
    config={{
      serviceURL: process.env.REACT_APP_SERVICE_URL,
      websocketURL: process.env.REACT_APP_WEBSOCKET_URL,
    }}
  >
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

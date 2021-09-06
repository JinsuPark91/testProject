import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CoreStoreProvider, API, initGA, ThemeStore } from 'teespace-core';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { i18n } from './i18n';
import MobileApp from './components/mobile/MobileApp';
// import WebApp from './App';
import * as serviceWorker from './serviceWorker';
import { setEnv, getEnv } from './env';

// const GlobalStyle = createGlobalStyle`
//   html {
//     font-size: ${global.screen.width / 16}%}
//   }
// `;

/**
 * FIXME: 충남대 /mobile 빌드용 임시 entry 파일
 * - ~.wapi.ai와 ~.wapl.ai/mobile을 구분하기 위한 파일이며,
 *   WebApp 또는 MobileApp 컴포넌트를 사용하는 부분 이외에는 index.js와 동일해야 함
 * - yarn build:mobile시 index.mobile.js 파일을 entry로 빌드하며,
 *   WebApp 컴포넌트에 해당하는 부분들이 빠진채로 빌드됨
 * - 추후에는 빌드 entry를 나누지 않고 React.lazy 또는 코드 스플리팅을 적용하여
 *   동일한 entry에서 웹과 모바일을 분리해야 함
 */

console.log('Mobile build');

if (process.env.NODE_ENV !== 'development') {
  console.log = () => {};
  console.error = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.debug = () => {};
}

const legacyDomainURL = `${window.location.protocol}//${
  process.env.REACT_APP_DEV_SERVICE_DOMAIN || window.location.hostname
}`;
const serviceURL =
  process.env.REACT_APP_API_BASE_URL ||
  `${legacyDomainURL}/${process.env.REACT_APP_DEV_PATH}`;
const resourceURL = process.env.REACT_APP_DOMAIN_URL || legacyDomainURL;
const comURL =
  process.env.REACT_APP_COMMON_URL ||
  global.env.REACT_APP_COMMON_URL ||
  `${window.location.protocol}//${
    process.env.REACT_APP_DEV_COM_DOMAIN || window.location.hostname
  }`;
const hsmURL =
  process.env.REACT_APP_HSM_URL ||
  global.env.REACT_APP_HSM_URL ||
  `${window.location.protocol}//${
    process.env.REACT_APP_DEV_HSM_DOMAIN || window.location.hostname
  }`;
const websocketURL =
  process.env.REACT_APP_WEBSOCKET_URL ||
  `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
    process.env.REACT_APP_DEV_WEBSOCKET_DOMAIN || window.location.hostname
  }/${process.env.REACT_APP_DEV_WEBSOCKET_PATH}`;
const meetingURL =
  process.env.REACT_APP_HYPERMEETING_URL ||
  `${window.location.protocol}//${process.env.REACT_APP_MEETING_URL}`;

setEnv({
  serviceURL,
  resourceURL,
  comURL,
  hsmURL,
  websocketURL,
  meetingURL,
});

// NOTE. 로컬 환경에서 Proxy를 사용하는 경우 localhost 로 호출되어야하기 때문에
//  서비스URL(serviceURL)을 지정하면 안 됨.
if (
  process.env.REACT_APP_ENV === 'local' &&
  process.env.REACT_APP_USE_PROXY === 'yes'
) {
  API.baseURL = `${window.location.protocol}//${window.location.hostname}:${
    window.location.port
  }${new URL(process.env.REACT_APP_API_BASE_URL).pathname}`;
} else {
  API.baseURL = serviceURL;
}

initGA(global.env.PLATFORM_GA_ID);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    console.debug(error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
    console.debug(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      console.log(this.state.error);
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

ReactDOM.render(
  <Suspense fallback={<></>}>
    <CoreStoreProvider config={getEnv()}>
      <I18nextProvider i18n={i18n}>
        <Observer>
          {() => (
            <ThemeProvider theme={ThemeStore.theme}>
              <BrowserRouter>
                <Switch>
                  <Route path="/mobile" component={MobileApp} />
                  {/* <Route path="/">
              <GlobalStyle />
              <WebApp />
            </Route> */}
                </Switch>
              </BrowserRouter>
            </ThemeProvider>
          )}
        </Observer>
      </I18nextProvider>
    </CoreStoreProvider>
  </Suspense>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

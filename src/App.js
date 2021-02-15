import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import './App.less';
import { create } from 'mobx-persist';
import { logPageView, PortalProvider, useCoreStores } from 'teespace-core';
import { initApp as initTalkApp } from 'teespace-talk-app';
import { initApp as initDriveApp } from 'teespace-drive-app';
import { initApp as initNoteApp } from 'teespace-note-app';
import { initApp as initMeetingApp } from 'teespace-meeting-app';
import { initApp as initMailApp, WindowMail } from 'teespace-mail-app';
import {
  initApp as initCalendarApp,
  initializeApp as initializeCalendarApp,
} from 'teespace-calendar-app';
// import { I18nextProvider } from 'react-i18next';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Cookies from 'js-cookie';
import AdminPage from './page/AdminPage';
import NotFoundPage from './page/NotFoundPage';
import SignUpPage from './page/SignUpPage';
import SignUpFormPage from './page/SignUpFormPage';
import SignUpCompletePage from './page/SignUpCompletePage';
import DriveSharedFilePage from './page/DriveSharedFilePage';
import OfficeFilePage from './page/OffiveFilePage';
import LogoutPage from './page/LogoutPage';
import MainPage from './page/MainPage';
import RedirectablePublicRoute from './libs/RedirectablePublicRoute';
import PrivateRoute from './libs/PrivateRoute';
import KeycloakRedirectRoute from './libs/KeycloakRedirectRoute';
import keycloak from './libs/keycloak';
import { getCookieValue } from './utils/CookieUtil';

// MiniTalk 임시.
import { getQueryParams } from './utils/UrlUtil';
import NewWindowPage from './page/NewWindowPage';
// MiniTalk 임시.

// import i18next from './i18n';

const hydrate = create();

function App() {
  const [isHydrating, setIsHydrating] = useState(false);
  const { authStore, userStore } = useCoreStores();
  const history = useHistory();
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const conURL = url.split(`//`)[1]; // xxx.dev.teespace.net
  const subURL = url.split(`//`)[1].split(`.`)[0]; //  xxx
  const mainURL = conURL.slice(conURL.indexOf('.') + 1, conURL.length); // dev.teespace.net
  const isLocal = process.env.REACT_APP_ENV === 'local';

  const eventLogger = (event, error) => {
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

  // MiniTalk 임시.
  const { mini: isMini } = getQueryParams(window.location.search);
  // MiniTalk 임시.

  // initialize apps
  useEffect(() => {
    initTalkApp();
    initDriveApp();
    initCalendarApp();
    initializeCalendarApp();
    initNoteApp();
    initMeetingApp();
    initMailApp();
  }, []);

  // hydrate mobx stores
  useEffect(() => {
    Promise.all([hydrate('user', userStore)])
      .then(() => {
        userStore.initHydratedMyProfile({});
        setIsHydrating(true);
      })
      .catch(e => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GA 페이지뷰 로그 수집
  useEffect(() => {
    return history.listen(location => {
      logPageView(location);
    });
  }, [history]);

  if (!isHydrating) return <></>;
  return (
    <DndProvider backend={HTML5Backend}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/drive/files/:fileId">
          <DriveSharedFilePage />
        </Route>
        <Route>
          <ReactKeycloakProvider
            authClient={keycloak}
            onEvent={eventLogger}
            LoadingComponent={<></>}
            initOptions={{
              onLoad: 'login-required',
              redirectUri: '',
            }}
          >
            <PortalProvider>
              {/* <I18nextProvider i18n={i18next}> */}
              <BrowserRouter>
                <Switch>
                  <Route exact path="/logout" component={LogoutPage} />
                  <KeycloakRedirectRoute
                    exact
                    path="/login"
                    component={MainPage}
                  />
                  <PrivateRoute
                    path="/office/:fileId"
                    component={OfficeFilePage}
                  />
                  <RedirectablePublicRoute
                    exact
                    path="/register"
                    component={<SignUpPage />}
                  />
                  <RedirectablePublicRoute
                    exact
                    path="/registerForm"
                    component={<SignUpFormPage />}
                  />
                  <RedirectablePublicRoute
                    exact
                    path="/registerComplete"
                    component={<SignUpCompletePage />}
                  />
                  <PrivateRoute
                    path="/:resourceType(s|f|m)/:resourceId/:mainApp?"
                    component={isMini ? NewWindowPage : MainPage}
                  />
                  <PrivateRoute path="/admin" component={AdminPage} />
                  <Route component={NotFoundPage} />
                </Switch>
                {/* <PrivateRoute
            path="/users"
            component={MainPage}
          /> */}
              </BrowserRouter>
              {/* </I18nextProvider> */}
            </PortalProvider>
          </ReactKeycloakProvider>
        </Route>
      </Switch>
    </DndProvider>
  );
}

export default App;

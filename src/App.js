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
import {
  logPageView,
  PortalProvider,
  useCoreStores,
  CoreInitializeTranslation,
} from 'teespace-core';
import { initApp as initTalkApp } from 'teespace-talk-app';
import { initApp as initDriveApp } from 'teespace-drive-app';
import { initApp as initNoteApp } from 'teespace-note-app';
import { initApp as initMeetingApp } from 'teespace-meeting-app';
import { initApp as initMailApp } from 'teespace-mail-app';
import {
  initApp as initCalendarApp,
  initializeApp as initializeCalendarApp,
} from 'teespace-calendar-app';
import AdminPage from './page/AdminPage';
import NotFoundPage from './page/NotFoundPage';
import SignUpPage from './page/SignUpPage';
import SignUpFormPage from './page/SignUpFormPage';
import SignUpCompletePage from './page/SignUpCompletePage';
import DriveSharedFilePage from './page/DriveSharedFilePage';
import OfficeFilePage from './page/OffiveFilePage';
import NewWindowPage from './page/NewWindowPage';
import MainPage from './page/MainPage';
import RedirectablePublicRoute from './libs/RedirectablePublicRoute';
import { getQueryParams } from './utils/UrlUtil';
import initMonitoringLog from './libs/monitoringLog';
import {
  AuthProvider,
  AuthRoute,
  PrivateAuthRoute,
  LogoutComponent,
} from './libs/auth';
import PrivateLoginPage from './page/PrivateLoginPage';

const hydrate = create();

function App() {
  const [isHydrating, setIsHydrating] = useState(false);
  const { userStore } = useCoreStores();
  const history = useHistory();
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const isLocal = process.env.REACT_APP_ENV === 'local';

  // MiniTalk 임시.
  const { mini: isMini } = getQueryParams(window.location.search);
  // MiniTalk 임시.

  // initialize apps
  useEffect(() => {
    initTalkApp(isMini);
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
        userStore.myProfile.setLanguage(sessionStorage.getItem('language'));
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

  useEffect(() => {
    initMonitoringLog();
  }, []);

  if (!isHydrating) return <></>;
  return (
    <DndProvider backend={HTML5Backend}>
      <CoreInitializeTranslation />
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/drive/files/:fileId">
          <DriveSharedFilePage />
        </Route>
        <Route>
          <AuthProvider>
            <PortalProvider>
              <BrowserRouter>
                <Switch>
                  <Route exact path="/logout" component={LogoutComponent} />
                  <AuthRoute exact path="/login" component={MainPage} />
                  <Route path="/privateLogin" component={PrivateLoginPage} />
                  <PrivateAuthRoute
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
                  <PrivateAuthRoute
                    path="/:resourceType(s|f|m)/:resourceId/:mainApp?"
                    component={isMini ? NewWindowPage : MainPage}
                  />
                  <PrivateAuthRoute path="/admin" component={AdminPage} />
                  <Route component={NotFoundPage} />
                </Switch>
              </BrowserRouter>
            </PortalProvider>
          </AuthProvider>
        </Route>
      </Switch>
    </DndProvider>
  );
}

export default App;

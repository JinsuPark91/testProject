import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './App.less';
import { create } from 'mobx-persist';
import { PortalProvider, useCoreStores } from 'teespace-core';
import { initApp as initDriveApp } from 'teespace-drive-app';
import { initApp as initCalendarApp } from 'teespace-calendar-app';
// import { I18nextProvider } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import AdminPage from './page/AdminPage';
import LoginPage from './page/LoginPage';
import NotFoundPage from './page/NotFoundPage';
import SignUpPage from './page/SignUpPage';
import SignUpFormPage from './page/SignUpFormPage';
import SignUpCompletePage from './page/SignUpCompletePage';
import DriveSharedFilePage from './page/DriveSharedFilePage';
import OfficeFilePage from './page/OffiveFilePage';
import LogoutPage from './page/LogoutPage';
// import MainPage from './local-test/MainPage';
import MainPage from './page/MainPage';
import RedirectablePublicRoute from './libs/RedirectablePublicRoute';
import PrivateRoute from './libs/PrivateRoute';
import KeycloakRedirectRoute from './libs/KeycloakRedirectRoute';
// import i18next from './i18n';

const hydrate = create();

function App() {
  const [isHydrating, setIsHydrating] = useState(false);
  const { initialized } = useKeycloak();
  const { authStore, userStore } = useCoreStores();

  // initialize apps
  useEffect(() => {
    initDriveApp();
    initCalendarApp();
  }, []);

  // hydrate mobx stores
  useEffect(() => {
    if (!initialized) {
      return;
    }
    Promise.all([hydrate('auth', authStore), hydrate('user', userStore)])
      .then(() => {
        userStore.initHydratedMyProfile({});
        setIsHydrating(true);
      })
      .catch(e => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  if (!isHydrating || !initialized) return <></>;
  return (
    <DndProvider backend={HTML5Backend}>
      <PortalProvider>
        {/* <I18nextProvider i18n={i18next}> */}
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route exact path="/logout" component={LogoutPage} />
            <Route exact path="/drive/files/:fileId">
              <DriveSharedFilePage />
            </Route>
            <KeycloakRedirectRoute
              exact
              path="/login"
              component={process.env.REACT_APP_ENV === `local` ? LoginPage : MainPage}
            />
            <PrivateRoute path="/office/:fileId" component={OfficeFilePage} />
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
              component={MainPage}
            />
            <Route path="/admin">
              <AdminPage />
            </Route>

            <Route component={NotFoundPage} />
            {/* <PrivateRoute
            path="/users"
            component={MainPage}
          /> */}
          </Switch>
        </BrowserRouter>
        {/* </I18nextProvider> */}
      </PortalProvider>
    </DndProvider>
  );
}

export default App;

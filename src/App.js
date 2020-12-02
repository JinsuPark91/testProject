import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './App.less';
import { create } from 'mobx-persist';
import { useCoreStores } from 'teespace-core';
import { I18nextProvider } from 'react-i18next';
import ServicePage from './page/ServicePage';
import LoginPage from './page/LoginPage';
import NotFoundPage from './page/NotFoundPage';
import SignUpPage from './page/SignUpPage';
import SignUpFormPage from './page/SignUpFormPage';
import SignUpCompletePage from './page/SignUpCompletePage';
import DriveSharedFilePage from './page/DriveSharedFilePage';
// import MainPage from './local-test/MainPage';
import MainPage from './page/MainPage';
import RedirectablePublicRoute from './libs/RedirectablePublicRoute';
import PrivateRoute from './libs/PrivateRoute';
import i18next from './i18n';

const hydrate = create();

function App() {
  const [isHydrating, setIsHydrating] = useState(false);
  const { authStore, userStore } = useCoreStores();

  useEffect(() => {
    Promise.all([hydrate('auth', authStore), hydrate('user', userStore)])
      .then(() => {
        userStore.initHydratedMyProfile({});
        setIsHydrating(true);
      })
      .catch(e => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isHydrating) return <></>;
  return (
    <DndProvider backend={HTML5Backend}>
      <I18nextProvider i18n={i18next}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route exact path="/drive/files/:fileId">
              <DriveSharedFilePage />
            </Route>
            <RedirectablePublicRoute
              exact
              path="/login"
              component={<LoginPage />}
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
              component={MainPage}
            />
            <Route component={NotFoundPage} />
            {/* <PrivateRoute
            path="/users"
            component={MainPage}
          /> */}
          </Switch>
        </BrowserRouter>
      </I18nextProvider>
    </DndProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import '../../App.less';
import { create } from 'mobx-persist';
import { PortalProvider, useCoreStores } from 'teespace-core';
import { useTalkApp } from 'teespace-talk-app';
import { initApp as initDriveApp } from 'teespace-drive-app';
import {
  initApp as initCalendarApp,
  initializeApp as initializeCalendarApp,
} from 'teespace-calendar-app';
import { initApp as initNoteApp } from 'teespace-note-app';
import SignUpPage from '../../page/SignUpPage';
import SignUpFormPage from '../../page/SignUpFormPage';
import SignUpCompletePage from '../../page/SignUpCompletePage';
import MobileCreateRoomPage from './MobileCreateRoomPage';
import MobileMainPage from './MobileMainPage';
import RedirectablePublicRoute from '../../libs/RedirectablePublicRoute';
import {
  AuthProvider,
  AuthRoute,
  PrivateAuthRoute,
  LogoutComponent,
} from '../../libs/auth';
import PrivateLoginPage from '../../page/PrivateLoginPage';

const hydrate = create();

const MobileApp = () => {
  const [isHydrating, setIsHydrating] = useState(false);
  const { userStore } = useCoreStores();
  const isLocal = process.env.REACT_APP_ENV === 'local';

  useTalkApp();
  // initialize apps
  useEffect(() => {
    // initTalkApp();
    initDriveApp();
    initCalendarApp();
    initializeCalendarApp();
    initNoteApp();
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

  if (!isHydrating) return <></>;
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route>
            <AuthProvider>
              <PortalProvider>
                <BrowserRouter basename="/mobile">
                  <Switch>
                    <Route exact path="/logout" component={LogoutComponent} />
                    <AuthRoute exact path="/login" component={MobileMainPage} />
                    <Route path="/privatelogin" component={PrivateLoginPage} />
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
                      exact
                      path="/room/:loginUserId/create"
                      component={MobileCreateRoomPage}
                    />
                    <PrivateAuthRoute
                      path="/:resourceType/:resourceId?"
                      component={MobileMainPage}
                    />
                    <Redirect to="/friend" />
                  </Switch>
                </BrowserRouter>
              </PortalProvider>
            </AuthProvider>
          </Route>
        </Switch>
      </BrowserRouter>
    </DndProvider>
  );
};

// room|create|select|talk|note|calendar
export default MobileApp;

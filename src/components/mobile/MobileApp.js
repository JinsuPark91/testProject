import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import '../../App.less';
import { create } from 'mobx-persist';
import { PortalProvider, useCoreStores } from 'teespace-core';
import { initApp as initTalkApp } from 'teespace-talk-app';
import { initApp as initDriveApp } from 'teespace-drive-app';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Cookies from 'js-cookie';
import NotFoundPage from '../../page/NotFoundPage';
import SignUpPage from '../../page/SignUpPage';
import SignUpFormPage from '../../page/SignUpFormPage';
import SignUpCompletePage from '../../page/SignUpCompletePage';
import LogoutPage from '../../page/LogoutPage';
import MobileMainPage from './MobileMainPage';
import RedirectablePublicRoute from '../../libs/RedirectablePublicRoute';
import PrivateRoute from '../../libs/PrivateRoute';
import KeycloakRedirectRoute from '../../libs/KeycloakRedirectRoute';
import keycloak from '../../libs/keycloak';

const hydrate = create();

const MobileApp = () => {
  const [isHydrating, setIsHydrating] = useState(false);
  const { userStore } = useCoreStores();
  const isLocal = process.env.REACt_APP_ENV === 'local';

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

  // initialize apps
  useEffect(() => {
    initTalkApp();
    initDriveApp();
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
                <BrowserRouter>
                  <Switch>
                    <Route exact path="/logout" component={LogoutPage} />
                    <KeycloakRedirectRoute
                      exact
                      path="/login"
                      component={MobileMainPage}
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
                      path="/:resourceType(room|talk)/:resourceId"
                      component={MobileMainPage}
                    />
                    <Route component={NotFoundPage} />
                  </Switch>
                </BrowserRouter>
              </PortalProvider>
            </ReactKeycloakProvider>
          </Route>
        </Switch>
      </BrowserRouter>
    </DndProvider>
  );
};

export default MobileApp;

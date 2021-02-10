import React, { useEffect, useState } from 'react';
import { initApp as initTalkApp } from 'teespace-talk-app';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import { create } from 'mobx-persist';
import { useCoreStores } from 'teespace-core';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import PrivateRoute from '../../libs/PrivateRoute';
import KeycloakRedirectRoute from '../../libs/KeycloakRedirectRoute';
import keycloak from '../../libs/keycloak';
import MobileMainPage from './MobileMainPage';

const hydrate = create();

const MobileApp = () => {
  const [isHydrating, setIsHydrating] = useState(false);
  const { userStore } = useCoreStores();
  const history = useHistory();
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const conURL = url.split(`//`)[1]; // xxx.dev.teespace.net
  const isLocal = process.env.REACT_APP_ENV === 'local';

  useEffect(() => {
    initTalkApp();
  }, []);

  useEffect(() => {
    Promise.all([hydrate('user', userStore)])
      .then(() => {
        userStore.initHydratedMyProfile({});
        setIsHydrating(true);
      })
      .catch(e => console.error(e));
  }, []);

  if (!isHydrating) return <></>;
  return (
    <Switch>
      <Route>
        <ReactKeycloakProvider
          authClient={keycloak}
          LoadingComponent={<></>}
          initOptions={{
            onLoad: 'login-required',
            redirectUri: '',
          }}
        >
          <BrowserRouter>
            <Switch>
              <KeycloakRedirectRoute
                exact
                path="/login"
                component={MobileMainPage}
              />
              <PrivateRoute
                path="/:resourceType(s|f|m)/:resourceId/:mainApp?"
                component={MobileMainPage}
              />
            </Switch>
          </BrowserRouter>
        </ReactKeycloakProvider>
      </Route>
    </Switch>
  );
};

export default MobileApp;

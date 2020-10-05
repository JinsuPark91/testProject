import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.less';
import { create } from 'mobx-persist';
import { useCoreStores } from 'teespace-core';
import ServicePage from './page/ServicePage';
import LoginPage from './page/LoginPage';
import CommonIntroPage from './page/CommonIntroPage';
import NotFoundPage from './page/NotFoundPage';
import SignUpPage from './page/SignUpPage';
import MainPage from './page/MainPage';
import RedirectablePublicRoute from './helper/RedirectablePublicRoute';
import PrivateRoute from './helper/PrivateRoute';

const hydrate = create();

function App() {
  const [isHydrating, setIsHydrating] = useState(false);
  const { authStore } = useCoreStores();

  useEffect(() => {
    Promise.all([hydrate('auth', authStore)])
      .then(() => setIsHydrating(true))
      .catch(e => console.error(e));
  });

  if (!isHydrating) return <></>;

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ServicePage} />
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
        <PrivateRoute path="/(s|f|m)/:id/:mainApp?" component={MainPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

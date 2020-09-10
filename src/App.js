import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.less';
import { create } from 'mobx-persist';
import ServicePage from './page/ServicePage';
import LoginPage from './page/LoginPage';
import NotFoundPage from './page/NotFoundPage';
import SignUpPage from './page/SignUpPage';
import MainPage from './page/MainPage';
import RedirectablePublicRoute from './helper/RedirectablePublicRoute';
import PrivateRoute from './helper/PrivateRoute';
import { useStore, StoreProvider, RootStore } from './store';

const hydrate = create();

function App() {
  const [isHydrating, setIsHydrating] = useState(false);
  const { authStore } = useStore();

  useEffect(() => {
    Promise.all([hydrate('auth', authStore)]).then(() => setIsHydrating(true));
  });

  if (!isHydrating) return <></>;

  return (
    <BrowserRouter>
      <StoreProvider store={RootStore}>
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
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;

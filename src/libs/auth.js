import React from 'react';
import ReactKsignProvider from './Providers/ReactKsignProvider';
import ReactKeycloakProvider from './Providers/ReactKeycloakProvider';
import KeycloakRedirectRoute from './KeycloakRedirectRoute';
import KsignRedirectRoute from './KsignRedirectRoute';
import PrivateRoute from './PrivateRoute';
import PrivateKsignRoute from './PrivateKsignRoute';
import LogoutPage from '../page/LogoutPage';
import KsignLogoutPage from '../page/KsignLogoutPage';

const ssoType =
  window.env.REACT_APP_SSO_TYPE === '%SSO_TYPE%'
    ? process.env.REACT_APP_SSO_TYPE
    : window.env.REACT_APP_SSO_TYPE || process.env.REACT_APP_SSO_TYPE;
let authType;
switch (ssoType) {
  case 'ksign':
    authType = 'Ksign';
    break;
  case 'hyperauth':
    authType = 'HyperAuth';
    break;
  default:
    break;
}

export const AuthProvider = ({ children }) => {
  const RootProvider = (authType => {
    switch (authType) {
      case 'HyperAuth':
        return ReactKeycloakProvider;
      case 'Ksign':
        return ReactKsignProvider;
      default:
        break;
    }
  })(authType);
  return <RootProvider>{children}</RootProvider>;
};

export const AuthRoute = ({ children, ...rest }) => {
  const RootRoute = (authType => {
    switch (authType) {
      case 'HyperAuth':
        return KeycloakRedirectRoute;
      case 'Ksign':
        return KsignRedirectRoute;
      default:
        break;
    }
  })(authType);
  return <RootRoute {...rest}>{children}</RootRoute>;
};

export const PrivateAuthRoute = ({ children, ...rest }) => {
  const PrivateRootRoute = (authType => {
    switch (authType) {
      case 'HyperAuth':
        return PrivateRoute;
      case 'Ksign':
        return PrivateKsignRoute;
      default:
        break;
    }
  })(authType);
  return <PrivateRootRoute {...rest}>{children}</PrivateRootRoute>;
};

export const LogoutComponent = () => {
  const RootLogoutComponent = (authType => {
    switch (authType) {
      case 'HyperAuth':
        return LogoutPage;
      case 'Ksign':
        return KsignLogoutPage;
      default:
        break;
    }
  })(authType);
  return <RootLogoutComponent />;
};

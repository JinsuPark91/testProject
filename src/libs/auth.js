import React from 'react';
import ReactKsignProvider from './Providers/ReactKsignProvider';
import ReactKeycloakProvider from './Providers/ReactKeycloakProvider';
import KeycloakRedirectRoute from './KeycloakRedirectRoute';
import KsignRedirectRoute from './KsignRedirectRoute';
import LocalRedirectRoute from './LocalRedirectRoute';
import PrivateRoute from './PrivateRoute';
import PrivateKsignRoute from './PrivateKsignRoute';
import PrivateLocalRoute from './PrivateLocalRoute';
import LogoutPage from '../page/LogoutPage';
import KsignLogoutPage from '../page/KsignLogoutPage';
import LocalLogoutPage from '../page/LocalLogoutPage';

export const ssoType =
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
  case 'local':
    authType = 'Local';
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
      case 'Local':
        return ReactKsignProvider; //local과 ksign은 단순 wrapper 이므로
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
      case 'Local':
        return LocalRedirectRoute;
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
      case 'Local':
        return PrivateLocalRoute;
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
      case 'Local':
        return LocalLogoutPage;
      default:
        break;
    }
  })(authType);
  return <RootLogoutComponent />;
};

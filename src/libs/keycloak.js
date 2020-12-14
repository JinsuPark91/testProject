import Keycloak from 'keycloak-js';

const keycloakConfig = {

  url:  window.env.REACT_APP_HYPERAUTH_URL || process.env.REACT_APP_HYPERAUTH_URL, // keycloak server 주소
  // realm: 'HyperSpace', // keycloak admin에서 생성한 realm 이름
  clientId: window.env.REACT_APP_HYPERAUTH_CLIENT_ID || process.env.REACT_APP_HYPERAUTH_CLIENT_ID, // keycloak admin에서 해당 app과 연결한 clientId
  // url: 'http://localhost:8080/auth',
  // realm: 'demo', // keycloak admin에서 생성한 realm 이름
  // clientId: 'vanila', // keycloak admin에서 해당 app과 연결한 clientId
  // admin용
  realm: 'tmax',
  // clientId: 'account',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

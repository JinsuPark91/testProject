import Keycloak from 'keycloak-js';

const keycloakConfig = {

  url: 'https://222.122.67.216:8443/auth', // keycloak server 주소
  // realm: 'HyperSpace', // keycloak admin에서 생성한 realm 이름
  clientId: 'hyperspace', // keycloak admin에서 해당 app과 연결한 clientId
  // url: 'http://localhost:8080/auth',
  // realm: 'demo', // keycloak admin에서 생성한 realm 이름
  // clientId: 'vanila', // keycloak admin에서 해당 app과 연결한 clientId
  // admin용
  realm: 'tmax',
  // clientId: 'account',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

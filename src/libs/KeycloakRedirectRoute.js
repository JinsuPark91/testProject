import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import { useKeycloak } from '@react-keycloak/web';

function KeycloakRedirectRoute({ component: Component, ...rest }) {
  const { keycloak } = useKeycloak();
  const { authStore, userStore } = useCoreStores();
  const history = useHistory();

  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const sub_url = url.split('//')[1].split('.')[0]; //  xxx
  const con_url = url.split(sub_url);
  const mail_url = con_url[1].slice(1, con_url[1].length); //dev.teespace.net

  return (
    <Route
      {...rest}
      render={props => {
        if (keycloak.authenticated) {
          console.log(process.env.REACT_APP_ENV);
          if (process.env.REACT_APP_ENV !== 'local') {
            authStore
              .login()
              .then(() => {
                history.push(`/f/${authStore.user.loginId}/profile`);
              })
              .catch(e => console.error(e));
          }
          return <Component {...props} />;
        } else {
          if (process.env.REACT_APP_ENV === 'local') {
            return <Component {...props} />;
          } else {
            keycloak.login({
              redirectUri: `http://${mail_url}?domain=${sub_url}`,
              locale: 'ko', // login page locale 설정. 'en' or 'ko' 설정.
            }); // keycloak login page로 redirect
          }
        }
        return null;
      }}
    />
  );
}

export default KeycloakRedirectRoute;

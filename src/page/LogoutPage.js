import React, { useEffect, useCallback } from 'react';
import { useCoreStores, WWMS } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import keycloak from '../libs/keycloak';

const LogoutPage = () => {
  const history = useHistory();
  const { authStore } = useCoreStores();

  const logoutLogic = useCallback(async () => {
    const url = window.location.origin; //  http://xxx.dev.teespace.net
    const con_url = url.split(`//`)[1]; // xxx.dev.teespace.net
    const main_url = con_url.slice(con_url.indexOf('.') + 1, con_url.length); // dev.teespace.net

    await authStore.logout();
    if (process.env.REACT_APP_ENV === `local`) {
      WWMS.disconnect();
      history.push(`/login`);
    } else {
      WWMS.disconnect();
      /* keycloak 임시 logout */
      await keycloak.logout({
        redirectUri: `${window.location.protocol}//${main_url}/spaces`,
      });
    }
  }, []);

  useEffect(() => {
    logoutLogic();
  }, []);

  return <div />;
};
export default LogoutPage;

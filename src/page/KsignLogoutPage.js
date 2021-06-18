import React, { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';
import Cookies from 'js-cookie';
import wwms from '../libs/wwms';
import keycloak from '../libs/keycloak';

const KsignLogoutPage = () => {
  const { authStore } = useCoreStores();
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const redirectURL = `${url}/login`;
  const getNibId = Cookies.get('NIBID');
  const getKsignId = Cookies.get('KSIGN_ID');
  const getIdToken = Cookies.get('ID_TOKEN');

  useEffect(() => {
    const logoutLogic = async () => {
      await authStore.logout();

      wwms.disconnect();
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('DEVICE_TYPE');
      Cookies.remove('ID_TOKEN');
      Cookies.remove('KSIGN_ID');
      if (
        getNibId ||
        getKsignId ||
        getIdToken ||
        authStore.user.grade === 'guest'
      ) {
        window.location.href = `/cnu/sso/logout.jsp`;
      } else {
        await keycloak.logout({
          redirectUri: redirectURL,
        });
      }
    };

    logoutLogic();
  }, [authStore]);

  return <div />;
};
export default KsignLogoutPage;

import React, { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';
import Cookies from 'js-cookie';
import wwms from '../libs/wwms';
import keycloak from '../libs/keycloak';

const KsignLogoutPage = () => {
  const { authStore } = useCoreStores();
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const redirectURL = `${url}/login`;
  const getKsignId = Cookies.get('KSIGN_ID');
  const getIdToken = Cookies.get('ID_TOKEN');

  useEffect(() => {
    const logoutLogic = async () => {
      if (getKsignId || getIdToken || authStore.user.grade === 'guest') {
        await authStore.logout();

        wwms.disconnect();
        Cookies.remove('ACCESS_TOKEN');
        Cookies.remove('DEVICE_TYPE');
        Cookies.remove('ID_TOKEN');
        Cookies.remove('KSIGN_ID');
        window.location.href = `/cnu/sso/logout.jsp`;
      } else {
        await authStore.logout();

        wwms.disconnect();
        Cookies.remove('ACCESS_TOKEN');
        Cookies.remove('DEVICE_TYPE');
        Cookies.remove('ID_TOKEN');
        Cookies.remove('KSIGN_ID');
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

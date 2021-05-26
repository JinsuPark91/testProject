import React, { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';
import Cookies from 'js-cookie';
import wwms from '../libs/wwms';
import { useKeycloak } from '@react-keycloak/web';

const KsignLogoutPage = () => {
  const { authStore } = useCoreStores();
  const { keycloak } = useKeycloak();
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const redirectURL = `${url}/login`;
  const getNibId = Cookies.get('NIBID');

  useEffect(() => {
    const logoutLogic = async () => {
      await authStore.logout();

      wwms.disconnect();
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('DEVICE_TYPE');
      if (getNibId || authStore.user.grade === 'guest') {
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

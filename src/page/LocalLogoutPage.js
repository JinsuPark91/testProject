import React, { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';
import Cookies from 'js-cookie';
import wwms from '../libs/wwms';
import { useHistory } from 'react-router-dom';

const LocalLogoutPage = () => {
  const { authStore } = useCoreStores();
  const history = useHistory();

  useEffect(() => {
    const logoutLogic = async () => {
      await authStore.logout();
      wwms.disconnect();
      Cookies.remove('NIBID');
      Cookies.remove('DEVICE_TYPE');
      history.replace('/privatelogin');
    };

    logoutLogic();
  }, [authStore]);

  return <div />;
};
export default LocalLogoutPage;

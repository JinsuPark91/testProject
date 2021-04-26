import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import Cookies from 'js-cookie';
import wwms from './wwms';

export default function LocalRedirectRoute({ component: Component, ...rest }) {
  const { authStore } = useCoreStores();
  const history = useHistory();

  //local용 로그인 정보
  let loginInfo;
  loginInfo = {
    deviceType: 'PC',
    authorizeType: 'Ksign',
  };

  return (
    <Route
      {...rest}
      render={props => {
        (async () => {
          try {
            const getNibId = Cookies.get('NIBID');
            if (
              authStore.user?.loginId &&
              authStore.user?.loginId !== getNibId
            ) {
              await authStore.logout().then(() => {
                Cookies.remove('NIBID');
              });
            }

            const res = await authStore.login(loginInfo);

            if (res) {
              // NOTE. 이전 경로가 존재하면 해당 경로로 이동
              const stateFrom = props.location.state?.from;
              if (stateFrom) {
                history.push(
                  `${stateFrom.pathname}${props.location.state?.from.search}`,
                );
              } else {
                history.push(`/f/${authStore.user.id}/profile`);
              }
            }
          } catch (e) {
            history.push('/privatelogin');
            console.error(e);
          }
        })();
        return null;
      }}
    />
  );
}

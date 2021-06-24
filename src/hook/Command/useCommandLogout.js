/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';

export const useCommandLogout = handleOpen => {
  const { commandStore, roomStore } = useCoreStores();
  const { uiStore } = useStores();
  const handler = useCallback(
    ({ params = [] }) => {
      handleOpen(params)();
    },
    [handleOpen],
  );

  useEffect(() => {
    const command = '/logout';

    autorun(() => {
      if (!commandStore.get(command)) {
        commandStore.register('platform', command, handler, {
          desc: {
            ko: '로그아웃합니다',
            en: 'Logout from WAPL',
          },
        });
      } else {
        commandStore.unregister(command);
      }
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler, roomStore, uiStore]);
};

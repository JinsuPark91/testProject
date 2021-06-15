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
            // TODO: UI string 발간 이후 수정할 것
            ko: '로그아웃을 합니다',
            en: 'logout from WAPL',
          },
        });
      } else {
        commandStore.unregister(command);
      }
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler, roomStore, uiStore]);
};

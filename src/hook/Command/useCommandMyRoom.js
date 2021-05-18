/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';

export const useCommandMyRoom = () => {
  const { commandStore, roomStore } = useCoreStores();
  const { handlerStore, uiStore } = useStores();
  const handler = useCallback(
    ({ command }) => handlerStore.getHandler(command)(),
    [handlerStore],
  );

  useEffect(() => {
    const command = '/myroom';

    autorun(() => {
      const isMyroom =
        roomStore.getRoom(uiStore.resourceId)?.type === 'WKS0001';

      if (!isMyroom && !commandStore.get(command)) {
        commandStore.register('platform', command, handler, {
          desc: {
            ko: '마이룸으로 이동합니다.',
            en: 'Go to My Room.',
          },
        });
      }
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler, roomStore, uiStore]);
};

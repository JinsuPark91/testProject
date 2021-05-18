/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';

export const useCommandOrgChart = () => {
  const { commandStore, roomStore } = useCoreStores();
  const { handlerStore, uiStore } = useStores();
  const handler = useCallback(
    ({ command, roomModel: { id: roomId } }) =>
      handlerStore.getHandler(command, roomId)(),
    [handlerStore],
  );

  useEffect(() => {
    const command = '/org chart';

    autorun(() => {
      const isMyroom =
        roomStore.getRoom(uiStore.resourceId)?.type === 'WKS0001';

      if (!isMyroom && !commandStore.get(command)) {
        commandStore.register('platform', command, handler, {
          desc: {
            ko: '구성원 리스트를 보여줍니다.',
            en: 'Display Users list.',
          },
        });
      }
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler, roomStore, uiStore]);
};

/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';
import { autorun, computed } from 'mobx';
import { useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';

export const useCommandAnnounce = () => {
  const { commandStore, roomStore } = useCoreStores();
  const { handlerStore, uiStore } = useStores();
  const hasBotRoom = computed(
    () => !roomStore.getRoomArray(true).every(({ isBotRoom }) => !isBotRoom),
  ).get();
  const handler = useCallback(
    ({ command }) => handlerStore.getHandler(command)(),
    [handlerStore],
  );

  useEffect(() => {
    const command = '/announce';

    autorun(() => {
      if (hasBotRoom) {
        const isBotRoom = roomStore.getRoom(uiStore.resourceId)?.isBotRoom;

        if (!isBotRoom && !commandStore.get(command)) {
          commandStore.register('platform', command, handler, {
            // TODO: 임시 번역
            desc: {
              ko: '서비스 알림으로 이동합니다.',
              en: 'Go to Service Announce.',
            },
          });
        } else if (isBotRoom && commandStore.get(command)) {
          commandStore.unregister(command);
        }
      }
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler, hasBotRoom, roomStore, uiStore]);
};

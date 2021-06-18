/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';

export const useCommandMute = () => {
  const { commandStore, roomStore } = useCoreStores();
  const { handlerStore, uiStore } = useStores();
  const handler = useCallback(
    ({ command, roomModel: { id: roomId } }) =>
      handlerStore.getHandler(command, roomId)(),
    [handlerStore],
  );

  useEffect(() => {
    const command = '/mute';

    autorun(() => {
      const roomInfo = roomStore.getRoom(uiStore.resourceId);
      const isMyroom = roomInfo?.type === 'WKS0001';
      const isAlarmUsed = !!roomInfo?.isAlarmUsed;

      if (isAlarmUsed && !isMyroom && !commandStore.get(command)) {
        commandStore.register('platform', command, handler, {
          desc: {
            ko: '현재 룸의 알림을 끄세요.',
            en: 'Turn off notification for the current room.',
          },
        });
      } else if ((!isAlarmUsed || isMyroom) && commandStore.get(command)) {
        commandStore.unregister(command);
      }
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler, roomStore, uiStore]);
};

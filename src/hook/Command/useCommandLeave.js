/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';

export const useCommandLeave = () => {
  const { commandStore, roomStore } = useCoreStores();
  const { handlerStore, uiStore } = useStores();
  const handler = useCallback(
    ({ command, roomModel: { id: roomId } }) =>
      handlerStore.getHandler(command, roomId)(),
    [handlerStore],
  );

  useEffect(() => {
    const command = '/leave';
    autorun(() => {
      const roomInfo = roomStore.getRoom(uiStore.resourceId);
      const isMyroom = roomInfo?.type === 'WKS0001';
      if (!isMyroom && !commandStore.get(command)) {
        commandStore.register('platform', command, handler, {
          desc: {
            // TODO: ui string 발간 이후 수정
            ko: '지금 있는 방에서 나갑니다.',
            en: 'Leave from this room.',
          },
        });
      } else if (isMyroom && commandStore.get(command)) {
        commandStore.unregister(command);
      }
    });
    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler, roomStore, uiStore]);
};

/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';

export const useCommandNewRoom = handler => {
  const { commandStore } = useCoreStores();

  useEffect(() => {
    const command = '/new room';

    commandStore.register('platform', command, handler, {
      desc: {
        ko: '새로운 룸을 생성하세요.',
        en: 'Create a new room.',
      },
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler]);
};

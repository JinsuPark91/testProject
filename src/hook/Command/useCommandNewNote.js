/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';
import { useCoreStores, EventBus } from 'teespace-core';

export const useCommandNewNote = propHandler => {
  const { commandStore } = useCoreStores();
  const handler = useCallback(() => {
    propHandler();
  }, [propHandler]);

  useEffect(() => {
    const command = '/new note';

    commandStore.register('platform', command, handler, {
      desc: {
        ko: '새 페이지를 생성하세요.',
        en: 'Create a new page.',
      },
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler]);
};

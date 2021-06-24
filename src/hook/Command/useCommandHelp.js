/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';

export const useCommandHelp = handler => {
  const { commandStore } = useCoreStores();

  useEffect(() => {
    const command = '/help';

    commandStore.register('platform', command, handler, {
      desc: {
        ko: '고객지원 페이지를 호출하세요.',
        en: 'Call the Customer Support page.',
      },
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler]);
};

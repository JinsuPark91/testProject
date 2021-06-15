/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';

export const useCommandHelp = handler => {
  const { commandStore } = useCoreStores();

  useEffect(() => {
    const command = '/help';

    commandStore.register('platform', command, handler, {
      desc: {
        // TODO: ui string 발행 이후 수정할 것
        ko: '고객지원 페이지로 이동합니다',
        en: 'Open help page',
      },
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler]);
};

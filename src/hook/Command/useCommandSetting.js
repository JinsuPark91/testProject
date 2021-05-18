/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';

export const useCommandSetting = handler => {
  const { commandStore } = useCoreStores();

  useEffect(() => {
    const command = '/setting';

    commandStore.register('platform', command, handler, {
      desc: {
        ko: '설정 팝업을 호출하세요.',
        en: 'Open the Settings popup.',
      },
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler]);
};

/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';
import { useCoreStores } from 'teespace-core';

export const useCommandSearchDrive = propHandler => {
  const { commandStore } = useCoreStores();
  const handler = useCallback(() => {
    propHandler();
  }, [propHandler]);

  useEffect(() => {
    const command = '/search drive';

    commandStore.register('drive', command, handler, {
      desc: {
        ko: '드라이브 파일, 폴더를 검색하세요.',
        en: 'Search for drive files, folders.',
      },
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler]);
};

/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';

export const useCommandOpenCalendar = handler => {
  const { commandStore } = useCoreStores();

  useEffect(() => {
    const command = '/open calendar';
    commandStore.register('platform', command, handler, {
      desc: {
        // TODO: ui string 발간 이후 수정 필요
        ko: '캘린더를 엽니다.',
        en: 'Open calendar app',
      },
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler]);
};

export const useCommandOpenDrive = handler => {
  const { commandStore } = useCoreStores();

  useEffect(() => {
    const command = '/open drive';
    commandStore.register('platform', command, handler, {
      desc: {
        // TODO: ui string 발간 이후 수정 필요
        ko: '드라이브를 엽니다.',
        en: 'Open drive app',
      },
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler]);
};

export const useCommandOpenNote = handler => {
  const { commandStore } = useCoreStores();

  useEffect(() => {
    const command = '/open note';
    commandStore.register('platform', command, handler, {
      desc: {
        // TODO: ui string 발간 이후 수정 필요
        ko: '노트를 엽니다.',
        en: 'Open note app',
      },
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler]);
};

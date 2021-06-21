/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';

const COMMAND_DESC = {
  calendar: {
    ko: '캘린더를 엽니다.',
    en: 'Open calendar app',
  },
  drive: {
    ko: '드라이브를 엽니다.',
    en: 'Open drive app',
  },
  note: {
    ko: '노트를 엽니다.',
    en: 'Open note app',
  },
  meeting: {
    ko: '미팅을 시작합니다.',
    en: 'Open meeting app',
  },
};

export const useCommandOpenApp = (appName, handler) => {
  const { commandStore } = useCoreStores();

  useEffect(() => {
    const command = `/open ${appName}`;
    commandStore.register('platform', command, handler, {
      desc: {
        ko: COMMAND_DESC[appName].ko,
        en: COMMAND_DESC[appName].en,
      },
    });

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler, appName]);
};

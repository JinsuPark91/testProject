/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { computed } from 'mobx';
import { useCoreStores } from 'teespace-core';

const COMMAND_DESC = {
  calendar: {
    ko: '캘린더 앱을 호출하세요.',
    en: 'Open calendar app.',
  },
  drive: {
    ko: '드라이브 앱을 호출하세요.',
    en: 'Open drive app.',
  },
  note: {
    ko: '노트 앱을 호출하세요.',
    en: 'Open note app.',
  },
  meeting: {
    ko: '미팅 앱을 호출하세요.',
    en: 'Open meeting app.',
  },
  mail: {
    ko: '메일 앱의 받은 메일함으로 이동합니다.',
    en: 'Move to Inbox in the mail app.',
  },
  mail: {
    ko: '메일을 엽니다.',
    en: 'Open mail app',
  },
};

export const useCommandOpenApp = (appName, handler) => {
  const {
    commandStore,
    spaceStore: { currentSpace },
  } = useCoreStores();
  const isValid = computed(() => currentSpace?.plan !== 'BASIC').get();
  useEffect(() => {
    const command = `/open ${appName}`;
    if (command !== 'mail' || isValid) {
      commandStore.register('platform', command, handler, {
        desc: {
          ko: COMMAND_DESC[appName].ko,
          en: COMMAND_DESC[appName].en,
        },
      });

      return () =>
        commandStore.get(command) && commandStore.unregister(command);
    }
  }, [commandStore, handler, appName, isValid]);
};

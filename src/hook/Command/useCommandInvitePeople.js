/* eslint-disable import/prefer-default-export */
import { computed } from 'mobx';
import { useCallback, useEffect } from 'react';
import { useCoreStores } from 'teespace-core';

export const useCommandInvitePeople = handleOpen => {
  const { commandStore } = useCoreStores();

  const isTmaxDomain = !!/^(tmax)\./gi.exec(window.location.hostname);
  const isValid = computed(() => !isTmaxDomain).get();

  const handler = useCallback(
    ({ params = [] }) => {
      handleOpen(params)();
    },
    [handleOpen],
  );

  useEffect(() => {
    const command = '/invite people id@example.com';

    if (isValid) {
      commandStore.register('platform', command, handler, {
        desc: {
          ko: '이메일 주소를 입력하여 초대장을 보내세요.',
          en: 'Enter email address to send an invitation.',
        },
        hasParams: true,
        prefix: '/invite people ',
      });
    }

    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler, isValid]);
};

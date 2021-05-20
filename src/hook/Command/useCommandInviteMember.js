/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { autorun } from 'mobx';
import { useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';

export const useCommandInviteMember = handler => {
  const { commandStore, roomStore, userStore } = useCoreStores();
  const { uiStore } = useStores();

  useEffect(() => {
    const command = '/invite member';

    autorun(() => {
      let isValid = false;
      const { resourceType } = uiStore;

      if (resourceType !== 'm' && resourceType !== 'f') {
        const room = roomStore.getRoomMap().get(uiStore.resourceId);
        const isMyRoom = room?.type === 'WKS0001';
        const isGuest = userStore.myProfile?.isGuest;

        isValid = !isMyRoom && !isGuest;
      }

      if (isValid && !commandStore.get(command)) {
        commandStore.register('platform', command, handler, {
          desc: {
            ko: '룸에 새로운 멤버를 초대하세요.',
            en: 'Invite new members to the room.',
          },
        });
      } else if (!isValid && commandStore.get(command)) {
        commandStore.unregister(command);
      }
    });
    return () => commandStore.get(command) && commandStore.unregister(command);
  }, [commandStore, handler, roomStore, uiStore, userStore]);
};

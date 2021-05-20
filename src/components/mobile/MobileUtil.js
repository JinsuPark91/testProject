import { RoomStore, UserStore } from 'teespace-core';
import { rootStore } from '../../stores';

export const getRoomId = () => {
  const { uiStore } = rootStore;
  const targetId =
    uiStore.resourceId === UserStore.myProfile.id
      ? RoomStore.getRoomArray()[0].id
      : uiStore.resourceId;
  return targetId;
};

const findRoom = () => {
  const targetId = getRoomId();
  return RoomStore.getRoomMap().get(targetId);
};

export const getRoomName = () => {
  const { myProfile } = UserStore;
  const found = findRoom();
  if (found) {
    if (found?.type === 'WKS0001') {
      return myProfile.displayName;
    }
    if (found?.customName || found?.name) {
      return found?.customName || found?.name;
    }
  }
  return null;
};

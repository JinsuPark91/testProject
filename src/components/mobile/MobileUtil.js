import { RoomStore, UserStore } from 'teespace-core';
import PlatformUIStore from '../../stores/PlatformUIStore';

const findRoom = () => {
  return RoomStore.getRoomMap().get(PlatformUIStore.resourceId);
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
  return myProfile.displayName;
};

export const extraFunction = () => {};

import { UserStore } from 'teespace-core';

export const isB2B = () => {
  return UserStore.myProfile.type === 'USR0001';
};

export const isSpaceAdmin = () => {
  return UserStore.myProfile.grade === 'admin';
};

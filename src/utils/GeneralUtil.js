import { UserStore, SpaceStore } from 'teespace-core';
import { fallbackLanguage } from '../i18n';

export const isB2B = () => {
  return UserStore.myProfile.type === 'USR0001';
};

export const isSpaceAdmin = () => {
  return UserStore.myProfile.grade === 'admin';
};

export const isBasicPlan = () => {
  return SpaceStore.currentSpace?.plan === 'BASIC';
};

export const getLanguage = () => {
  const { language } = UserStore.myProfile;
  if (!language) return fallbackLanguage;

  const match = language.match(/en|ko/g);
  const isValidLanguage = !!match;
  if (isValidLanguage) return match?.[0];

  return fallbackLanguage;
};

export const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

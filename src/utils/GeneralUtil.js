import { UserStore, SpaceStore, ConfigStore } from 'teespace-core';
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

export const isDarkMode = () => {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
};

// For LNB Modal
export const getLeftDistance = adjust => {
  const MODAL_LEFT_WITH_GROUP = 19.935;
  const MODAL_LEFT_WITHOUT_GROUP = 16.81;

  let distance = ConfigStore.isFromCNU
    ? MODAL_LEFT_WITHOUT_GROUP
    : MODAL_LEFT_WITH_GROUP;

  if (adjust) distance += adjust;

  return `${distance}rem`;
};

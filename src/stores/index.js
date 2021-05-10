/* eslint-disable import/prefer-default-export */

import uiStore from './uiStore';
import roomSettingStore from './roomSettingStore';
import historyStore from './historyStore';
import friendStore from './friendStore';

const rootStore = {
  uiStore,
  roomSettingStore,
  historyStore,
  friendStore,
};

const useStores = () => {
  return rootStore;
};

export { useStores, rootStore };

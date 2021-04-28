/* eslint-disable import/prefer-default-export */

import uiStore from './uiStore';
import roomSettingStore from './roomSettingStore';
import historyStore from './historyStore';

const rootStore = {
  uiStore,
  roomSettingStore,
  historyStore,
};

const useStores = () => {
  return rootStore;
};

export { useStores, rootStore };

/* eslint-disable import/prefer-default-export */

import uiStore from './uiStore';
import roomSettingStore from './roomSettingStore';
import historyStore from './historyStore';
import friendUiStore from './friendUiStore';
import handlerStore from './handlerStore';
import mobileStore from './mobileStore';

const rootStore = {
  uiStore,
  roomSettingStore,
  historyStore,
  friendUiStore,
  handlerStore,
  mobileStore,
};

const useStores = () => {
  return rootStore;
};

export { useStores, rootStore };

import { rootStore } from '../stores';

const { uiStore } = rootStore;

let intervalId = null;
const TIME = 1000;
const TALK = 'talk';
const MEETING = 'meeting';

const handleCheck = () => {
  // 유효하지 않은 윈도우 검사하여 끄기.
  uiStore
    .getWindows(TALK)
    .filter(windowInfo => windowInfo.handler && windowInfo.handler.closed)
    .forEach(windowInfo => uiStore.closeWindow(windowInfo.type, windowInfo.id));

  // 숨겨진 윈도우 창이 있는지 검사하여 floating Btn 띄우기
  const isTalkWindowHidden = !!uiStore
    .getWindows(TALK)
    .find(elem => elem.handler?.document.hidden);

  if (isTalkWindowHidden !== uiStore.floatBtnVisible)
    uiStore.setFloatBtnVisible(isTalkWindowHidden);

  uiStore
    .getWindows(MEETING)
    .filter(windowInfo => windowInfo.handler && windowInfo.handler.closed)
    .forEach(windowInfo => uiStore.closeWindow(windowInfo.type, windowInfo.id));
};

const clear = () => {
  clearInterval(intervalId);
  intervalId = null;
  uiStore.setFloatBtnVisible(false);
};

export const runWatcher = () => {
  if (intervalId) clear();
  intervalId = setInterval(() => {
    handleCheck();
  }, TIME);
};

export const stopWatcher = () => {
  if (intervalId) clear();
};

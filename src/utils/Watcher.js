import { rootStore } from '../stores';

const { uiStore } = rootStore;

let intervalId = null;
const TIME = 1000;

const check = () => {
  const talkWindows = uiStore.getWindows('talk');
  const meetingWindows = uiStore.getWindows('meeting');

  // 유효하지 않은 윈도우 검사하여 끄기.
  talkWindows
    .filter(windowInfo => windowInfo.handler && windowInfo.handler.closed)
    .forEach(windowInfo => uiStore.closeWindow(windowInfo.type, windowInfo.id));

  meetingWindows
    .filter(windowInfo => windowInfo.handler && windowInfo.handler.closed)
    .forEach(windowInfo => uiStore.closeWindow(windowInfo.type, windowInfo.id));
};

const clear = () => {
  clearInterval(intervalId);
  intervalId = null;
};

export const runWatcher = () => {
  if (intervalId) clear();

  intervalId = setInterval(() => {
    check();
  }, 1000);
};

export const stopWatcher = () => {
  if (intervalId) clear();
};

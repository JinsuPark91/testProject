import PlatformUIStore from '../stores/PlatformUIStore';

let intervalId = null;
const TIME = 1000;

const check = () => {
  const talkWindows = PlatformUIStore.getWindows('talk');
  const meetingWindows = PlatformUIStore.getWindows('meeting');

  // 유효하지 않은 윈도우 검사하여 끄기.
  talkWindows
    .filter(windowInfo => windowInfo.handler && windowInfo.handler.closed)
    .forEach(windowInfo =>
      PlatformUIStore.closeWindow(windowInfo.type, windowInfo.id),
    );

  meetingWindows
    .filter(windowInfo => windowInfo.handler && windowInfo.handler.closed)
    .forEach(windowInfo =>
      PlatformUIStore.closeWindow(windowInfo.type, windowInfo.id),
    );
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

import { API, AuthStore, UserStore } from 'teespace-core';

const INSERT_INTERVAL_TIME = 1000 * 60 * 3;

const currentState = {
  timer: null,
  insertTimer: null,
  appId: null,
  start: null,
  stack: [],
};

const getMainApp = () => {
  if (window.location.href.includes('talk')) return 'talk';
  if (window.location.href.includes('mail')) return 'mail';
  if (window.location.href.includes('support')) return 'support';
  return undefined;
};

const getSubApp = () => {
  return window.location.href.split('sub=')[1];
};

const getCurrentAppName = () => {
  if (window.location.href.includes('sub')) return getSubApp();
  return getMainApp();
};

// 현재 사용하고 있는 앱이 무엇인지 확인하고, 앱에 대한 카운트를 올림
const countFunction = () => {
  if (!AuthStore.isAuthenticated) return;

  const userId = UserStore.myProfile.id;
  const appName = getCurrentAppName();

  if (userId && appName) {
    const stackItem = currentState.stack.find(
      e => e.appName === appName && e.userId === userId,
    );
    if (stackItem) {
      stackItem.count += 1;
    } else {
      currentState.stack.push({
        appName,
        userId,
        count: 1,
      });
    }
  }
};

// 수집한 로그를 서버로 보냄
const insertLog = () => {
  if (currentState.stack.length === 0) return;

  const tempStack = currentState.stack.slice();
  currentState.stack = [];

  const inputData = {
    dto: {
      log: tempStack.map(e => ({
        timestamp: Math.floor(new Date().getTime() / 1000),
        user_id: e.userId,
        app_id: e.appName,
        duration_sec: e.count,
        device_type: 'PC',
      })),
    },
  };

  API.post('Monitoring/SessionDurationLog', inputData);
};

(function initMonitoringLog() {
  if (!window.MONITORING_LOG_INITIALIZED) {
    currentState.timer = setInterval(countFunction, 1000);
    currentState.insertTimer = setInterval(insertLog, INSERT_INTERVAL_TIME);
    window.MONITORING_LOG_INITIALIZED = true;
  }
})();

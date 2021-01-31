import { WWMS } from 'teespace-core';
import { getEnv } from '../env';

const wwms = {
  connect: userId => {
    const { websocketURL } = getEnv();

    WWMS.setConfig({
      url: `${websocketURL}?USER_ID=${userId}&action=&CONNECTION_ID=undefined`,
      isDebug: true,

      useInterval: false,
      intervalTime: 1000,

      useReconnect: true,
      reconnectInterval: 2000,
      useDefaultHandler: true,

      intervalFunction: () => {
        console.log('send ping.');
      },
      onopen: null,
      onerror: null,
      onmessage: null,
      onclose: null,
    });
    WWMS.connect();
  },
  disconnect: () => {
    WWMS.disconnect();
  },
  isConnected: WWMS.isConnected,
};
export default wwms;

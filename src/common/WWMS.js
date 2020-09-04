import Config from '../config';

function WWMS() {}

WWMS.prototype = {
  isDebug: true,
  url: Config.websocketURL,
  intervalTimer: null,
  useInterval: false,
  intervalFunction: null,
  intervalTime: 3000,
  useReconnect: false,
  reconnectInterval: 3000,
  reconnect: false,
  reconnectTimer: null,
  onopen: null,
  onclose: null,
  onmessage: null,
  onerror: null,
  websocket: null,
  handlers: new Map(),
  setConfig(config) {
    this.url = Config.websocketURL;

    this.isDebug = config.isDebug || false;

    this.intervalTimer = null;
    this.useInterval = config.useInterval || false;
    this.intervalFunction = config.intervalFunction || null;
    this.intervalTime = config.intervalTime || 3000;

    this.useReconnect = config.useReconnect || false;
    this.reconnectInterval = config.reconnectInterval || 3000;
    this.reconnect = false;
    this.reconnectTimer = null;

    this.onopen = config.onopen || null;
    this.onclose = config.onclose || null;
    this.onmessage = config.onmessage || null;
    this.onerror = config.onerror || null;

    this.websocket = null;
    this.handlers = new Map();
  },
  startInterval() {
    if (this.useInterval) {
      this.stopInterval();
      this.intervalTimer = setInterval(
        this.intervalFunction,
        this.intervalTime,
      );
    }
  },

  stopInterval() {
    if (this.useInterval && this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  },

  debug(msg, error) {
    if (this.isDebug) {
      if (error) console.error(msg, error);
      else console.warn(msg);
    }
  },

  connect() {
    const that = this;
    if (that.websocket && that.websocket.readyState === WebSocket.OPEN) {
      that.debug('웹소켓이 이미 연결되어 있습니다.');
      return;
    }

    try {
      that.websocket = new WebSocket(that.url);
      that.websocket.onopen = () => {
        if (that.reconnect) {
          that.debug('웹소켓이 재연결되었습니다.');
          that.reconnect = false;
        } else {
          that.debug('웹소켓이 연결되었습니다.');
        }
        // do something..

        if (that.onopen) {
          that.onopen();
        }
        if (that.useInterval) {
          that.startInterval();
        }
      };

      that.websocket.onmessage = message => {
        if (!message || !message.data || !message.data.length) {
          that.debug('유효하지 않은 메세지 입니다.');
          return;
        }

        const parsedMessage = JSON.parse(message.data);

        if (!parsedMessage.CH_TYPE) {
          that.debug('메세지에 채널 타입이 없습니다.');
          return;
        }

        try {
          that.handlers.get(parsedMessage.CH_TYPE)(parsedMessage);
          // do somethig..
          if (that.onmessage) that.onmessage(parsedMessage);
        } catch (e) {
          that.debug('핸들러를 실행 할 수 없습니다.', e);
        }
      };

      that.websocket.onerror = () => {
        // do something..
        if (that.onerror) that.onerror();
      };

      that.websocket.onclose = closeEvent => {
        const { code: closeCode } = closeEvent;
        switch (closeCode) {
          // normal
          case 1000:
            that.debug(`웹소켓 연결을 해제하였습니다. (code : ${closeCode})`);
            break;

          // abnormal
          default:
            if (that.useReconnect) {
              that.debug(
                `웹소켓 연결이 끊어졌습니다. ${that.reconnectInterval}ms후, 재연결을 시도합니다. (code : ${closeCode})`,
              );
              that.reconnect = true;
              if (that.reconnectTimer) {
                clearTimeout(that.reconnectTimer);
                that.reconnectTimer = null;
              }
              that.reconnectTimer = setTimeout(
                that.connect.bind(that),
                that.reconnectInterval,
              );
            } else {
              that.debug(`웹소켓 연결이 끊어졌습니다. (code : ${closeCode})`);
            }
            break;
        }

        // do something..
        if (that.useInterval) {
          that.stopInterval();
        }

        if (that.onclose) that.onclose();
      };
    } catch (e) {
      that.debug(`웹소켓 연결에 실패했습니다.`, e);
      that.websocket = null;
    }
  },

  disconnect() {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      this.debug('웹소켓 연결을 해제할 수 없습니다.');
      return;
    }

    this.websocket.close(1000);
  },

  send(message) {
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(message);
    }
  },

  addHandler(channelType, handler) {
    console.log('test');
    if (!channelType || typeof channelType !== 'string') {
      this.debug(`잘못된 채널 타입 입니다. (${channelType})}`);
    } else if (!handler || typeof handler !== 'function') {
      this.debug(`잘못된 핸들러 입니다.`);
    } else if (this.handlers.has(channelType)) {
      this.debug(`이미 등록된 채널 타입 입니다. (${channelType})}`);
    } else {
      this.handlers.set(channelType, handler);
    }
  },

  removeHandler(channelType) {
    if (typeof channelType !== 'string') {
      this.debug(`잘못된 채널 타입 입니다. (${channelType})}`);
    } else if (!this.handlers.has(channelType)) {
      this.debug(`${channelType} 에 대한 등록된 핸들러가 없습니다.`);
    } else {
      this.handlers.delete(channelType);
    }
  },

  disableReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.useReconnect = false;
  },

  enableReconnect() {
    this.useReconnect = true;
  },
};

export default new WWMS();

const Config = (() => {
  const config = {
    serviceURL: '',
    websocketURL: '',
  };

  global.window.$config = config;

  return {
    setConfig(opts) {
      global.window.$config = { config, ...opts };
    },
    get serviceURL() {
      return global.window.$config.serviceURL;
    },
    get websocketURL() {
      return global.window.$config.websocketURL;
    },
  };
})();

export default Config;

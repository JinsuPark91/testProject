const Config = (() => {
  let config = {
    serviceURL: '',
    websocketURL: '',
  };

  return {
    setConfig(opts) {
      config = { config, ...opts };
    },
    get serviceURL() {
      return config.serviceURL;
    },
    get websocketURL() {
      return config.websocketURL;
    },
  };
})();

export default Config;

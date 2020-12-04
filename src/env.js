const env = {
  serviceURL: null,
  websocketURL: null,
};

export const getEnv = () => {
  return env;
};

export const setEnv = ({ serviceURL = null, websocketURL = null }) => {
  env.serviceURL = serviceURL || env.serviceURL;
  env.websocketURL = websocketURL || env.websocketURL;
};

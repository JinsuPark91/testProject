const env = {
  serviceURL: null,
  resourceURL: null,
  websocketURL: null,
};

export const getEnv = () => {
  return env;
};

export const setEnv = ({
  serviceURL = null,
  resourceURL = null,
  websocketURL = null,
}) => {
  env.serviceURL = serviceURL || env.serviceURL;
  env.resourceURL = resourceURL || env.resourceURL;
  env.websocketURL = websocketURL || env.websocketURL;
};

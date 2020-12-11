const env = {
  serviceURL: null,
  resourceURL: null,
  comURL : null,
  websocketURL: null,
};

export const getEnv = () => {
  return env;
};

export const setEnv = ({
  serviceURL = null,
  resourceURL = null,
  comURL = null,
  websocketURL = null,
}) => {
  env.serviceURL = serviceURL || env.serviceURL;
  env.resourceURL = resourceURL || env.resourceURL;
  env.comURL = comURL || env.comURL;
  env.websocketURL = websocketURL || env.websocketURL;
};

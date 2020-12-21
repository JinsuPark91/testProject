const env = {
  serviceURL: null,
  resourceURL: null,
  comURL: null,
  hsmURL: null,
  websocketURL: null,
  meetingURL: null,
};

export const getEnv = () => {
  return env;
};

export const setEnv = ({
  serviceURL = null,
  resourceURL = null,
  comURL = null,
  hsmURL = null,
  websocketURL = null,
  meetingURL = null,
}) => {
  env.serviceURL = serviceURL || env.serviceURL;
  env.resourceURL = resourceURL || env.resourceURL;
  env.comURL = comURL || env.comURL;
  env.hsmURL = hsmURL || env.hsmURL;
  env.websocketURL = websocketURL || env.websocketURL;
  env.meetingURL = meetingURL || env.meetingURL;
};

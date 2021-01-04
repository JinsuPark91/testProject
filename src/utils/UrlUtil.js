export const getMainWaplURL = urlPath => {
  if (process.env.REACT_APP_ENV === 'local') {
    const mainURL = process.env.REACT_APP_DEV_SERVICE_DOMAIN.split('.')
      .slice(1)
      .join('.');
    return `${window.location.protocol}//${mainURL}${urlPath || ''}`;
  }
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const conURL = url.split(`//`)[1]; // xxx.dev.teespace.net
  const mainURL = conURL.slice(conURL.indexOf('.') + 1, conURL.length); // dev.teespace.net

  return `${window.location.protocol}//${mainURL}${urlPath || ''}`;
};

export const getWaplSubDomain = () => {
  if (process.env.REACT_APP_ENV === 'local') {
    return process.env.REACT_APP_DEV_SERVICE_DOMAIN.split('.')[0];
  }
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  return url.split(`//`)[1].split(`.`)[0]; //  xxx
};

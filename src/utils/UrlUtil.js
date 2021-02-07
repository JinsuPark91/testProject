export const getMainURL = () => {
  if (process.env.REACT_APP_ENV === 'local') {
    return new URL(process.env.REACT_APP_DOMAIN_URL).hostname
      .split('.')
      .slice(1)
      .join('.');
  }
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const conURL = url.split(`//`)[1]; // xxx.dev.teespace.net
  return conURL.slice(conURL.indexOf('.') + 1, conURL.length); // dev.teespace.net\
};

export const getMainWaplURL = urlPath => {
  if (process.env.REACT_APP_ENV === 'local') {
    return `${window.location.protocol}//${getMainURL()}${urlPath || ''}`;
  }
  return `${window.location.protocol}//${getMainURL()}${urlPath || ''}`;
};

export const getWaplSubDomain = () => {
  if (process.env.REACT_APP_ENV === 'local') {
    return new URL(process.env.REACT_APP_DOMAIN_URL).hostname.split('.')[0];
  }
  const url = window.location.origin; //  http://xxx.dev.teespace.net
  return url.split(`//`)[1].split(`.`)[0]; //  xxx
};

export const getQueryParams = (searchParams = window.location.search) => {
  if (searchParams) {
    let result = {};
    const params = new URLSearchParams(searchParams);
    params.forEach((value, key) => {
      result = { ...result, [key]: value };
    });
    return result;
  }
  return {};
};

export const getQueryString = queryParams => {
  if (queryParams) return new URLSearchParams(queryParams).toString();
  return '';
};

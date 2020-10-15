// eslint-disable-next-line import/prefer-default-export
export const queryStringToObject = queryString => {
  let result = null;
  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    result = Object.fromEntries(urlParams);
  }
  return result;
};

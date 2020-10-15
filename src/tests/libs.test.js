import { queryStringToObject } from '../libs/utils';

describe('Library Tests', () => {
  it('queryStringToObject', () => {
    expect(queryStringToObject(null)).toEqual(null);
    expect(queryStringToObject('a')).toEqual({ a: '' });
    expect(queryStringToObject('key1=test&key2=value')).toEqual({
      key1: 'test',
      key2: 'value',
    });
  });
});

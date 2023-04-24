// office365Api.tests.js
import chai from 'chai';
import { getQueryUrl, getItemChildrenAPIUrl } from './server';

describe('Office 365 API', () => {
  describe('getQueryUrl', () => {
    it('should return a query string from a given query object', () => {
      const queryObject = {
        key1: 'value1',
        key2: 'value2',
      };
      const expectedResult = '?key1=value1&key2=value2';
      const result = getQueryUrl(queryObject);
      chai.expect(result).to.equal(expectedResult);
    });
  });

  describe('getItemChildrenAPIUrl', () => {
    it('should return the correct API URL for getting item children', () => {
      const siteId = '52ea637f-e10b-4fbd-b819-f4910e5e8cf2';
      const itemId = '01ZUKCFDQCAZ546SFEV5FZHLNBJBKYIUZR';
      const query = {
        $top: 5,
      };
      const expectedResult =
        'https://graph.microsoft.com/v1.0/sites/root/sites/52ea637f-e10b-4fbd-b819-f4910e5e8cf2/drive/items/01ZUKCFDQCAZ546SFEV5FZHLNBJBKYIUZR/children?$top=5';
      const result = getItemChildrenAPIUrl(siteId, itemId, query);
      chai.expect(result).to.equal(expectedResult);
    });
  });

  
});

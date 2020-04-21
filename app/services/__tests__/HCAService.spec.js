// eslint-disable-next-line jest/no-mocks-import
import * as mockHCA from '../__mocks__/mockHCA';
// eslint-disable-next-line jest/no-mocks-import
import {
  mockNullUserLocHistory,
  mockUserLocHistory,
} from '../__mocks__/mockUserLocHistory';
import HCAService from '../HCAService';
import { LocationData } from '../LocationService';

jest.mock('rn-fetch-blob', () => {
  return {
    fs: {
      readFile: () => mockHCA.validYaml,
    },
  };
});

describe('HCAService', () => {
  describe('getAuthoritiesList()', () => {
    it('Given a successful reseponse, returns a list of health care authorities with a valid schema', async () => {
      jest
        .spyOn(HCAService, 'fetchAuthoritiesYaml')
        .mockResolvedValueOnce({ path: () => '' });

      const authorities = await HCAService.getAuthoritiesList();
      const testAuthority = authorities[0]['Test Authority'];

      expect(testAuthority[0]['url']).toBe(
        'https://raw.githack.com/tripleblindmarket/safe-places/develop/examples/safe-paths.json',
      );

      // Has a `bounds` with a `ne` and `sw` field
      expect(testAuthority[1]['bounds']['ne']).toBeTruthy();
      expect(testAuthority[1]['bounds']['sw']).toBeTruthy();
    });

    it('Given an unsuccessful response, returns an empty array', async () => {
      jest.spyOn(HCAService, 'fetchAuthoritiesYaml').mockImplementation(() => {
        throw new Error();
      });

      await expect(HCAService.getAuthoritiesList()).resolves.toEqual([]);
    });
  });

  describe('hasSavedAuthorities()', () => {
    it('returns false when the user has not saved any health care authorities yet', async () => {
      jest.spyOn(HCAService, 'getUserAuthorityList').mockResolvedValue(false);
      await expect(HCAService.hasSavedAuthorities()).resolves.toBe(false);
    });

    it('returns true when the user has saved a health care authority', async () => {
      jest
        .spyOn(HCAService, 'getUserAuthorityList')
        .mockResolvedValue(mockHCA.validParsed);

      await expect(HCAService.hasSavedAuthorities()).resolves.toBe(true);
    });
  });

  describe('getAuthoritiesInCurrentLoc()', () => {
    beforeAll(() => {
      jest
        .spyOn(HCAService, 'getAuthoritiesList')
        .mockResolvedValue(mockHCA.validParsed);
    });

    it('returns a list of authorities whose bounds include the current GPS location of the user', async () => {
      // Returns a point within the bounding box of an authority
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockUserLocHistory);

      const authorities = await HCAService.getAuthoritiesInCurrentLoc();
      expect(authorities[0]).toEqual(mockHCA.validParsed[0]);
    });

    it('returns an empty array if no authorities bounds include the current GPS location of the user', async () => {
      // Returns a point outside the bounding box of any authority
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockNullUserLocHistory);

      await expect(HCAService.getAuthoritiesInCurrentLoc()).resolves.toEqual(
        [],
      );
    });
  });

  describe('getAuthoritiesFromUserLocHistory()', () => {
    beforeAll(() => {
      jest
        .spyOn(HCAService, 'getAuthoritiesList')
        .mockResolvedValue(mockHCA.validParsed);
    });

    it('returns true if the user was in the bounding box of an authority in the past 28 days', async () => {
      // Returns a point within the bounding box of an authority
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockUserLocHistory);

      const authorities = await HCAService.getAuthoritiesFromUserLocHistory();
      expect(authorities[0]).toEqual(mockHCA.validParsed[0]);
    });

    it('returns false if the user was not in the bounding box of any authority in the past 28 days', async () => {
      // Returns a point outside the bounding box of any authority
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockNullUserLocHistory);

      await expect(
        HCAService.getAuthoritiesFromUserLocHistory(),
      ).resolves.toEqual([]);
    });
  });

  describe('findNewAuthorities()', () => {
    let alertSpy;

    beforeEach(() => {
      alertSpy = jest.spyOn(HCAService, 'pushAddNewAuthoritesFromLoc');
    });

    it('does not prompt the user there are no new authorities', async () => {
      jest
        .spyOn(HCAService, 'getNewAuthoritiesInUserLoc')
        .mockResolvedValueOnce([]);
      await HCAService.findNewAuthorities();
      expect(alertSpy).toHaveBeenCalledTimes(0);
    });

    it('prompts the user when there are new authorities in their current location', async () => {
      jest
        .spyOn(HCAService, 'getNewAuthoritiesInUserLoc')
        .mockResolvedValueOnce(mockHCA.validParsed);
      await HCAService.findNewAuthorities();
      expect(alertSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAuthorityBounds()', () => {
    it('returns undefined if the authority does not have a `bounds` key', () => {
      expect(
        HCAService.getAuthorityBounds(mockHCA.invalidParsedNoBounds),
      ).toEqual(undefined);
    });

    it('returns the `bounds` key that is in the second index of authority values array', () => {
      const bounds = {
        ne: { latitude: 36.42025904738132, longitude: -121.93670068664551 },
        sw: { latitude: 38.29988330010084, longitude: -123.2516993133545 },
      };
      expect(HCAService.getAuthorityBounds(mockHCA.validParsed[0])).toEqual(
        bounds,
      );
    });
  });

  describe('getAuthorityUrl()', () => {
    it('returns undefined if the authority does not have a `url` key', () => {
      expect(HCAService.getAuthorityUrl(mockHCA.invalidParsedNoBounds)).toEqual(
        undefined,
      );
    });

    it('returns the `url` key that is in the first index of authority values array', () => {
      const url =
        'https://raw.githack.com/tripleblindmarket/safe-places/develop/examples/safe-paths.json';
      expect(HCAService.getAuthorityUrl(mockHCA.validParsed[0])).toEqual(url);
    });
  });

  describe('getNewAuthoritiesInUserLoc()', () => {
    beforeAll(() => {
      jest
        .spyOn(HCAService, 'getAuthoritiesList')
        .mockResolvedValueOnce(mockHCA.validParsed);
    });

    it('returns an empty array if there are no authorities in the area', async () => {
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockNullUserLocHistory);
      jest.spyOn(HCAService, 'getUserAuthorityList').mockResolvedValueOnce([]);

      await expect(HCAService.getNewAuthoritiesInUserLoc()).resolves.toEqual(
        [],
      );
    });

    it('filters out authorities the user has already subscribed to', async () => {
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockUserLocHistory);
      jest
        .spyOn(HCAService, 'getUserAuthorityList')
        .mockResolvedValueOnce(mockHCA.validParsed);

      await expect(HCAService.getNewAuthoritiesInUserLoc()).resolves.toEqual(
        [],
      );
    });

    it('returns an array of new authorities that the user has not subscribed to and are within their current location', async () => {
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockUserLocHistory);
      jest.spyOn(HCAService, 'getUserAuthorityList').mockResolvedValueOnce([]);

      await expect(HCAService.getNewAuthoritiesInUserLoc()).resolves.toEqual(
        mockHCA.validParsed,
      );
    });
  });
});

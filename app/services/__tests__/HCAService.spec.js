import { mockValidHCAList, mockValidHCAYaml } from '../__mocks__/mockHCA';
import {
  mockNullUserLocHistory,
  mockUserLocHistory,
} from '../__mocks__/mockUserLocHistory';
import HCAService from '../HCAService';
import { LocationData } from '../LocationService';

jest.mock('rn-fetch-blob', () => {
  return {
    fs: {
      readFile: () => mockValidHCAYaml,
    },
  };
});

describe('HCAService', () => {
  describe('getAuthoritiesList()', () => {
    it('Given a successful reseponse, returns a list of health care authorities with a valid schema', async () => {
      jest
        .spyOn(HCAService, 'fetchAuthoritiesYaml')
        .mockResolvedValueOnce({ path: () => '../__mocks__/mockHCA.yaml' });

      const authorities = await HCAService.getAuthoritiesList();
      const authority = authorities[0];
      const testAuthority = authority['Test Authority'];

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
        .mockResolvedValue(mockValidHCAList);

      await expect(HCAService.hasSavedAuthorities()).resolves.toBe(true);
    });
  });

  describe('getAuthoritiesInCurrentLoc()', () => {
    beforeAll(() => {
      jest
        .spyOn(HCAService, 'getAuthoritiesList')
        .mockResolvedValue(mockValidHCAList);
    });

    it('returns a list of authorities whose bounds include the current GPS location of the user', async () => {
      // Returns a point within the bounding box of an authority
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockUserLocHistory);

      const authorities = await HCAService.getAuthoritiesInCurrentLoc();
      expect(authorities[0]).toEqual(mockValidHCAList[0]);
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

  describe('isUserGPSInAuthorityBounds()', () => {
    beforeAll(() => {
      jest
        .spyOn(HCAService, 'getAuthoritiesList')
        .mockResolvedValue(mockValidHCAList);
    });

    it('returns true if the user is in the bounding box of an authority', async () => {
      // Returns a point within the bounding box of an authority
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockUserLocHistory);

      await expect(HCAService.isUserGPSInAuthorityBounds()).resolves.toBe(true);
    });

    it('returns false if the user is not in the bounding box of an authority', async () => {
      // Returns a point outside the bounding box of any authority
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockNullUserLocHistory);

      await expect(HCAService.isUserGPSInAuthorityBounds()).resolves.toBe(
        false,
      );
    });
  });

  describe('getAuthoritiesFromUserLocHistory()', () => {
    beforeAll(() => {
      jest
        .spyOn(HCAService, 'getAuthoritiesList')
        .mockResolvedValue(mockValidHCAList);
    });

    it('returns true if the user was in the bounding box of an authority in the past 28 days', async () => {
      // Returns a point within the bounding box of an authority
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValue(mockUserLocHistory);

      const authorities = await HCAService.getAuthoritiesFromUserLocHistory();
      expect(authorities[0]).toEqual(mockValidHCAList[0]);
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
});

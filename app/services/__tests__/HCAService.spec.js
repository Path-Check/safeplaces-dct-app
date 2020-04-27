import {
  AUTHORITY_SOURCE_SETTINGS,
  ENABLE_HCA_AUTO_SUBSCRIPTION,
} from '../../constants/storage';
import * as storageHelpers from '../../helpers/General';
// eslint-disable-next-line jest/no-mocks-import
import * as mockHCA from '../__mocks__/mockHCA';
// eslint-disable-next-line jest/no-mocks-import
import {
  mockMostRecentUserLoc,
  mockNullMostRecentUserLoc,
  mockNullUserLocHistory,
  mockUserLocHistory,
} from '../__mocks__/mockUserLocHistory';
import { HCAService } from '../HCAService';
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
      console.error = jest.fn(); // Supress error log

      jest
        .spyOn(HCAService, 'fetchAuthoritiesYaml')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(HCAService.getAuthoritiesList()).resolves.toEqual([]);
    });
  });

  describe('hasSavedAuthorities()', () => {
    it('returns false when the user has not saved any health care authorities yet', async () => {
      jest
        .spyOn(HCAService, 'getUserAuthorityList')
        .mockResolvedValueOnce(false);
      await expect(HCAService.hasSavedAuthorities()).resolves.toBe(false);
    });

    it('returns true when the user has saved a health care authority', async () => {
      jest
        .spyOn(HCAService, 'getUserAuthorityList')
        .mockResolvedValueOnce(mockHCA.validParsed);

      await expect(HCAService.hasSavedAuthorities()).resolves.toBe(true);
    });
  });

  describe('getAuthoritiesFromUserLocHistory()', () => {
    beforeEach(() => {
      jest
        .spyOn(HCAService, 'getAuthoritiesList')
        .mockResolvedValue(mockHCA.validParsed);
    });

    it('returns true if the user was in the bounding box of an authority in the past 28 days', async () => {
      // Returns a point within the bounding box of an authority
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValueOnce(mockUserLocHistory);

      const authorities = await HCAService.getAuthoritiesFromUserLocHistory();
      expect(authorities[0]).toEqual(mockHCA.validParsed[0]);
    });

    it('returns false if the user was not in the bounding box of any authority in the past 28 days', async () => {
      // Returns a point outside the bounding box of any authority
      jest
        .spyOn(LocationData.prototype, 'getLocationData')
        .mockReturnValueOnce(mockNullUserLocHistory);

      await expect(
        HCAService.getAuthoritiesFromUserLocHistory(),
      ).resolves.toEqual([]);
    });
  });

  describe('findNewAuthorities()', () => {
    let autoSubscribeAlertSpy, newAuthoritiesAlertSpy;

    beforeEach(() => {
      autoSubscribeAlertSpy = jest.spyOn(
        HCAService,
        'pushAlertNewSubscriptions',
      );

      newAuthoritiesAlertSpy = jest.spyOn(
        HCAService,
        'pushAlertNewSubscriptions',
      );
    });

    afterEach(() => {
      autoSubscribeAlertSpy.mockClear();
      newAuthoritiesAlertSpy.mockClear();
    });

    describe('when there are new authorities', () => {
      beforeEach(() => {
        jest
          .spyOn(HCAService, 'getNewAuthoritiesInUserLoc')
          .mockResolvedValueOnce(mockHCA.validParsed);
      });

      it('when auto subscribed, alerts the user to their new authorities', async () => {
        jest
          .spyOn(HCAService, 'isAutosubscriptionEnabled')
          .mockResolvedValueOnce(true);
        await HCAService.findNewAuthorities();
        expect(autoSubscribeAlertSpy).toHaveBeenCalledTimes(1);
      });

      it('when not auto subscribed, alerts the user to new authorities available for subscription', async () => {
        jest
          .spyOn(HCAService, 'isAutosubscriptionEnabled')
          .mockResolvedValueOnce(false);
        await HCAService.findNewAuthorities();
        expect(newAuthoritiesAlertSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('does not prompt the user there are no new authorities', async () => {
      jest
        .spyOn(HCAService, 'getNewAuthoritiesInUserLoc')
        .mockResolvedValueOnce([]);
      await HCAService.findNewAuthorities();
      expect(autoSubscribeAlertSpy).toHaveBeenCalledTimes(0);
      expect(newAuthoritiesAlertSpy).toHaveBeenCalledTimes(0);
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
    beforeEach(() => {
      jest
        .spyOn(HCAService, 'getAuthoritiesList')
        .mockResolvedValue(mockHCA.validParsed);
    });

    it('returns an empty array if there are no authorities in the area', async () => {
      jest
        .spyOn(LocationData.prototype, 'getMostRecentUserLoc')
        .mockReturnValueOnce(mockNullMostRecentUserLoc);
      jest.spyOn(HCAService, 'getUserAuthorityList').mockResolvedValueOnce([]);

      await expect(HCAService.getNewAuthoritiesInUserLoc()).resolves.toEqual(
        [],
      );
    });

    it('filters out authorities the user has already subscribed to', async () => {
      jest
        .spyOn(LocationData.prototype, 'getMostRecentUserLoc')
        .mockReturnValueOnce(mockMostRecentUserLoc);
      jest
        .spyOn(HCAService, 'getUserAuthorityList')
        .mockResolvedValueOnce(mockHCA.validParsed);

      await expect(HCAService.getNewAuthoritiesInUserLoc()).resolves.toEqual(
        [],
      );
    });

    it('returns an array of new authorities that the user has not subscribed to and are within their current location', async () => {
      jest
        .spyOn(LocationData.prototype, 'getMostRecentUserLoc')
        .mockReturnValueOnce(mockMostRecentUserLoc);
      jest.spyOn(HCAService, 'getUserAuthorityList').mockResolvedValueOnce([]);

      await expect(HCAService.getNewAuthoritiesInUserLoc()).resolves.toEqual(
        mockHCA.validParsed,
      );
    });
  });

  describe('hasUserSetSubscription()', () => {
    it('returns false if the user has not set a subcription status yet', async () => {
      await expect(HCAService.hasUserSetSubscription()).resolves.toBe(false);
    });

    it('returns true if the user has not set a subcription status - either true or false', async () => {
      await storageHelpers.SetStoreData(ENABLE_HCA_AUTO_SUBSCRIPTION, true);
      await expect(HCAService.hasUserSetSubscription()).resolves.toBe(true);

      await storageHelpers.SetStoreData(ENABLE_HCA_AUTO_SUBSCRIPTION, false);
      await expect(HCAService.hasUserSetSubscription()).resolves.toBe(true);
    });
  });

  describe('isAutosubscriptionEnabled()', () => {
    it('returns false if the user has not enabled auto subscription', async () => {
      await storageHelpers.SetStoreData(ENABLE_HCA_AUTO_SUBSCRIPTION, false);
      await expect(HCAService.isAutosubscriptionEnabled()).resolves.toBe(false);
    });

    it('returns true if the user has enabled auto subscription', async () => {
      await storageHelpers.SetStoreData(ENABLE_HCA_AUTO_SUBSCRIPTION, true);
      await expect(HCAService.isAutosubscriptionEnabled()).resolves.toBe(true);
    });
  });

  describe('enableAutoSubscription()', () => {
    it('sets `ENABLE_HCA_AUTO_SUBSCRIPTION` to "true" in storage', async () => {
      await HCAService.enableAutoSubscription();
      await expect(
        storageHelpers.GetStoreData(ENABLE_HCA_AUTO_SUBSCRIPTION),
      ).resolves.toBe('true');
    });
  });

  describe('disableAutoSubscription()', () => {
    it('sets `ENABLE_HCA_AUTO_SUBSCRIPTION` to "false" in storage', async () => {
      await HCAService.disableAutoSubscription();
      await expect(
        storageHelpers.GetStoreData(ENABLE_HCA_AUTO_SUBSCRIPTION),
      ).resolves.toBe('false');
    });
  });

  describe('getUserAuthorityList()', () => {
    it('returns the list of Health Care Authorities that a user has saved', async () => {
      await storageHelpers.SetStoreData(
        AUTHORITY_SOURCE_SETTINGS,
        mockHCA.validParsed,
      );

      await expect(HCAService.getUserAuthorityList()).resolves.toEqual(
        mockHCA.validParsed,
      );
    });
  });

  describe('appendToAuthorityList()', () => {
    it('gets the existing authority list, appends the new authorities, and saves the new list back to storage', async () => {
      jest
        .spyOn(HCAService, 'getUserAuthorityList')
        .mockResolvedValueOnce(mockHCA.validParsed);

      await HCAService.appendToAuthorityList(mockHCA.validParsed);

      const newAuthorityList = await HCAService.getUserAuthorityList();

      expect(newAuthorityList.length).toBe(mockHCA.validParsed.length + 1);

      // Doesn't overwrite existing elements
      expect(newAuthorityList[0]).toEqual(mockHCA.validParsed[0]);
    });
  });
});

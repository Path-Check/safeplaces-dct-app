import dayjs from 'dayjs';
import * as ReactNative from 'react-native';

import { makeTimelineObject } from './GoogleTakeoutUtils';

const {
  location1,
  location2,
  location3,
  location4,
} = require('./fixtures/googleImport');

describe('importTakeoutData', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.doMock('react-native-zip-archive', () => {
      return {
        unzip: async () => '/tmp/test',
        subscribe: () => ({ remove: jest.fn() }),
      };
    });
    jest.doMock('react-native', () => {
      return {
        Platform: {
          OS: 'ios',
        },
      };
    });
  });

  it('throws NoRecentLocationsError exception if no location files found', async () => {
    jest.doMock('react-native-fs', () => {
      return {
        CachesDirectoryPath: '/tmp',
        exists: async () => false,
        readFile: async () => ({}),
        unlink: async () => {},
      };
    });

    const {
      importTakeoutData,
      NoRecentLocationsError,
    } = require('../GoogleTakeOutAutoImport');
    await expect(importTakeoutData('file://test.zip')).rejects.toThrowError(
      NoRecentLocationsError,
    );
  });

  it('throws InvalidFileExtensionError exception if wrong file format is supplied', async () => {
    jest.doMock('react-native-fs', () => {
      return {
        CachesDirectoryPath: '/tmp',
        exists: async () => false,
        readFile: async () => ({}),
        unlink: async () => {},
      };
    });

    const {
      importTakeoutData,
      InvalidFileExtensionError,
    } = require('../GoogleTakeOutAutoImport');
    await expect(importTakeoutData('file://test.tar')).rejects.toThrowError(
      InvalidFileExtensionError,
    );
  });

  it(`locations successfully added to local store`, async () => {
    const importGoogleLocations = jest.fn();
    jest.doMock('react-native', () => {
      return {
        Platform: {
          OS: 'ios',
        },
        NativeModules: {
          ...ReactNative.NativeModules,
          SecureStorageManager: {
            importGoogleLocations: importGoogleLocations,
          },
        },
      };
    });
    jest.doMock('react-native-fs', () => {
      const {
        location1,
        location2,
        location3,
        location4,
      } = require('./fixtures/googleImport');

      return {
        CachesDirectoryPath: '/tmp',
        exists: () => Promise.resolve(true),
        readFile: jest
          .fn()
          .mockReturnValueOnce(
            Promise.resolve(
              JSON.stringify({
                timelineObjects: [
                  makeTimelineObject(location1),
                  makeTimelineObject(location2),
                ],
              }),
            ),
          )
          .mockReturnValueOnce(
            Promise.resolve(
              JSON.stringify({
                timelineObjects: [
                  makeTimelineObject(location3),
                  makeTimelineObject(location4),
                ],
              }),
            ),
          ),
        unlink: async () => {},
      };
    });

    const { importTakeoutData } = require('../GoogleTakeOutAutoImport');
    await importTakeoutData('file://test.zip');
    expect(importGoogleLocations).toHaveBeenCalledWith([location1, location2]);
    expect(importGoogleLocations).toHaveBeenCalledWith([location3, location4]);
  });
});

describe('getFilenamesForLatest2Months', () => {
  it('correctly returns files for last 2 months', () => {
    const {
      getFilenamesForLatest2Months,
    } = require('../GoogleTakeOutAutoImport');
    expect(
      getFilenamesForLatest2Months('', dayjs(new Date(2020, 3, 18))),
    ).toEqual([
      `/Takeout/Location History/Semantic Location History/2020/2020_MARCH.json`,
      `/Takeout/Location History/Semantic Location History/2020/2020_APRIL.json`,
    ]);

    // account for the January edge case
    expect(
      getFilenamesForLatest2Months('', dayjs(new Date(2020, 0, 18))),
    ).toEqual([
      `/Takeout/Location History/Semantic Location History/2019/2019_DECEMBER.json`,
      `/Takeout/Location History/Semantic Location History/2020/2020_JANUARY.json`,
    ]);
  });
});

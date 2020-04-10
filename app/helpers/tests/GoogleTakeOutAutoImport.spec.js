import { makeTimelineObject } from './GoogleTakeoutUtils';
const {
  location1,
  location2,
  location3,
  location4,
} = require('./fixtures/googleImport');

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('importTakeoutData', () => {
  beforeEach(() => {
    jest.resetModules();
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
    jest.doMock('../GoogleData', () => {
      const {
        location1,
        location2,
        location3,
      } = require('./fixtures/googleImport');

      return {
        mergeJSONWithLocalData: async () => [location1, location2, location3],
      };
    });

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
    jest.doMock('../GoogleData', () => {
      return {
        mergeJSONWithLocalData: async () => {},
      };
    });

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
    jest.doMock('../GoogleData', () => {
      const {
        location1,
        location2,
        location3,
        location4,
      } = require('./fixtures/googleImport');

      return {
        mergeJSONWithLocalData: jest
          .fn()
          .mockReturnValueOnce([location1, location2])
          .mockReturnValueOnce([location3, location4]),
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
            JSON.stringify([
              makeTimelineObject(location1),
              makeTimelineObject(location2),
            ]),
          )
          .mockReturnValueOnce(
            JSON.stringify([
              makeTimelineObject(location3),
              makeTimelineObject(location4),
            ]),
          ),
        unlink: async () => {},
      };
    });

    const { importTakeoutData } = require('../GoogleTakeOutAutoImport');
    const newLocations = await importTakeoutData('file://test.zip');
    expect(newLocations).toEqual([location1, location2, location3, location4]);
  });

  it(`no locations inserted if they already exist in local store`, async () => {
    jest.doMock('../GoogleData', () => {
      return {
        mergeJSONWithLocalData: jest
          .fn()
          .mockReturnValueOnce([])
          .mockReturnValueOnce([]),
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
            JSON.stringify([
              makeTimelineObject(location1),
              makeTimelineObject(location2),
            ]),
          )
          .mockReturnValueOnce(
            JSON.stringify([
              makeTimelineObject(location3),
              makeTimelineObject(location4),
            ]),
          ),
        unlink: async () => {},
      };
    });

    const { importTakeoutData } = require('../GoogleTakeOutAutoImport');
    const newLocations = await importTakeoutData('file://tmp/test.zip');
    expect(newLocations.length).toEqual(0);
  });
});
